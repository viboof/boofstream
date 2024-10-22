import { Request, Response } from "express";
import fs from "fs";
import { BoofSet, StartggPlayer } from "../boofstream-common/boof";

const SGG_TOKEN: String = JSON.parse(fs.readFileSync("config.json").toString("utf-8")).sggToken;
const COUNTRIES_TO_CODES = JSON.parse(fs.readFileSync("countriesToCodes.json").toString("utf-8"));

// TODO: cannot support >500 entrants
const INIT_GQL = `query($tournamentSlug: String, $eventSlug: String) {
  tournament(slug: $tournamentSlug) {
    admins {
      player {
        gamerTag,
        prefix
      }
      genderPronoun,
      authorizations(types: [TWITTER]) {
        externalUsername
      }
      location {
        state,
        country
      }
    }
  }
  event(slug: $eventSlug) {
    entrants(query: { perPage: 500 }) {
      nodes {
        id,
        initialSeedNum,
        participants {
          gamerTag,
          prefix,
          player {
            user {
              genderPronoun
              authorizations(types: [TWITTER]) {
                externalUsername
              }
              location {
                state,
                country
              }
            }
          }
        }
      }
    }
  }
}`;

// TODO: cannot support >500 sets
const SETS_GQL = `query($eventSlug: String) {
  event(slug: $eventSlug) {
    sets(perPage: 500) {
      nodes {
        id
        fullRoundText
        winnerId
        phaseGroup { 
          phase { 
            name 
          } 
        }
        slots {
          entrant {
            id
          }
        }
      }
    }
  }
}`;

const REPORT_GQL = (
    gameData: string
) => `mutation($setId: ID!, $winnerId: ID!) {
    reportBracketSet(
        setId: $setId, 
        winnerId: $winnerId,
        gameData: [
            ${gameData}
        ]
    ) {
        id
    }
}`;

const REPORT_GAME_GQL = (winnerId: number, gameNum: number) => `{ winnerId: ${winnerId}, gameNum: ${gameNum} }`;

export function wrap(f: (req: Request, res: Response) => Promise<void>) {
    return async function wrapped(req: Request, res: Response) {
        try {
            await f(req, res);
        } catch (e) {
            console.error(e);
            res.json({ error: e.toString() });
            res.status(500);
        }
    }
}

async function gqlfetch(query: string, variables: any) {
    const resp = (await fetch(
        "https://api.start.gg/gql/alpha",
        {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: "Bearer " + SGG_TOKEN
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        }
    ));

    const text = await resp.text();

    console.log("gqlfetch:", resp.status, text);

    return JSON.parse(text).data;
}

export const init = wrap(_init);
export const sets = wrap(_sets);
export const report = wrap(_report);

async function _init(req: Request, res: Response) {
    const url = req.query.url as string;
    const eventSlug = url.split(".gg/")[1];
    const tournamentSlug = url.split(".gg/tournament/")[1].split("/event")[0];

    console.log(eventSlug);
    console.log(tournamentSlug);

    const json = await gqlfetch(INIT_GQL, { eventSlug, tournamentSlug });

    const tourney = json.tournament;
    const event = json.event;

    let players: StartggPlayer[] = [];

    console.log("TOURNAMENT:",tourney);
    console.log("EVENT:",event);

    if (tourney.admins) {
        let adminId = -1;
        
        for (const admin of tourney.admins) {
            players.push({ entrantId: adminId, player: {
                sponsor: admin.player.prefix || "",
                name: admin.player.gamerTag,
                pronouns: admin.genderPronoun || "",
                twitter: admin.authorizations ? admin.authorizations[0].externalUsername : "",
                score: 0,
                losers: false,
                country: admin.location.country ? COUNTRIES_TO_CODES[admin.location.country] : "",
                state: admin.location.state || "",
                seed: -1,
            } });

            adminId--;
        }
    }

    for (const entrant of event.entrants.nodes) {
        const participant = entrant.participants[0];
        const player = participant.player;

        const hasLoc = !!player.user.location;

        players.push({ entrantId: entrant.id, player: {
            sponsor: participant.prefix || "",
            name: participant.gamerTag,
            pronouns: player.user.genderPronoun || "",
            twitter: player.user.authorizations ? player.user.authorizations[0].externalUsername : "",
            score: 0,
            losers: false,
            country: hasLoc && player.user.location.country ? COUNTRIES_TO_CODES[player.user.location.country] : "",
            state: hasLoc && player.user.location.state ? player.user.location.state : "",
            seed: entrant.initialSeedNum,
        } });
    }

    res.json({ players });
}

async function _sets(req: Request, res: Response) {
    const url = req.query.url as string;
    const eventSlug = url.split(".gg/")[1];

    const data = await gqlfetch(SETS_GQL, { eventSlug });

    let sets: BoofSet[] = [];

    for (const set of data.event.sets.nodes) {
        sets.push({
            id: set.id,
            player1Id: set.slots[0].entrant ? set.slots[0].entrant.id : 0,
            player2Id: set.slots[1].entrant ? set.slots[1].entrant.id : 0,
            round: set.fullRoundText || "",
            phase: set.phaseGroup.phase.name || "",
            completed: !!set.winnerId,
        })
    }

    res.json(sets.filter(s => s.player1Id && s.player2Id));
}

async function _report(req: Request, res: Response) {
    const { 
        setId, 
        player1Id, 
        player2Id,
        player1Wins,
    }: { 
        setId: number | string, 
        player1Id: number, 
        player2Id: number, 
        player1Wins: boolean[],
    } = req.body;

    let games: string[] = [];
    let p1WinCount = 0;
    let p2WinCount = 0;

    for (let i = 0; i < player1Wins.length; i++) {
        games.push(REPORT_GAME_GQL(player1Wins[i] ? player1Id : player2Id, i + 1));

        if (player1Wins[i]) p1WinCount++;
        else p2WinCount++;
    }

    const gql = REPORT_GQL(games.join(",\n"));

    console.log("report gql:", gql);

    const resp = await gqlfetch(gql, { setId, winnerId: p1WinCount >= p2WinCount ? player1Id : player2Id });
    console.log("REPORT RESP:", resp)

    res.json({ resp });
}
