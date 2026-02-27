import { BracketServiceClient, BracketSlugId, EventIdentifier, EventServiceClient, EventSlugPath, GetBracketRequest, GetEventEntrantsRequest, GetMatchesRequest, MatchesFilter, MatchState } from "@parry-gg/client";
import { BoofSet, StartggPlayer } from "boofstream-common";
import { Request, Response } from "express";
import { wrap } from "./webutil";
import { getRounds } from "./rounds";

global.XMLHttpRequest = require("xhr2");

const PARRY_GRPC_ENDPOINT = "https://grpcweb.parry.gg";

type Slugs = {
    tournamentSlug: string,
    eventSlug: string,
    phaseSlug: string,
    bracketSlug: string,
};

function _slugs(url: string): Slugs {
    // https://parry.gg/test-touranment-019c9d96/melee-singles/main/bracket
    const [
        tournamentSlug,
        eventSlug,
        phaseSlug,
        bracketSlug
    ] = url.split(".gg/")[1].split("/");

    return { tournamentSlug, eventSlug, phaseSlug, bracketSlug };
}

async function _init(req: Request, res: Response) {
    const url = req.query.url as string;
    const slugs = _slugs(url);
    
    const eventIdentifier = new EventIdentifier();
    const eventSlugPath = new EventSlugPath();
    eventSlugPath.setTournamentSlug(slugs.tournamentSlug);
    eventSlugPath.setEventSlug(slugs.eventSlug);
    eventIdentifier.setEventSlugPath(eventSlugPath);

    const eventRequest = new GetEventEntrantsRequest();
    eventRequest.setEventIdentifier(eventIdentifier);

    const auth = { "X-API-KEY": res.locals.config.startgg.token };
    //                                            ^ lol

    const eventClient = new EventServiceClient(PARRY_GRPC_ENDPOINT);
    
    const entrantsResp = await eventClient.getEventEntrants(eventRequest, auth);
    const entrants = entrantsResp.getEventEntrantsList();

    let players: StartggPlayer[] = [];

    for (const entrant of entrants) {
        const users = entrant.getEntrant()?.getUsersList();
        const user = users?.length === 1 ? users[0] : null;
        if (!user) continue;
        players.push({
            entrantId: entrant.getEntrant()!!.getId(),
            player: {
                score: 0,
                sponsor: "",  // parry.gg does not have
                twitter: "",  // parry.gg does not have
                losers: false,
                name: user?.getGamerTag() || "",
                seed: entrant.getSeed(),
                pronouns: user?.getPronouns() || "",
                country: user?.getLocationCountry().toLowerCase(),
                state: user?.getLocationState(),
            }
        });
    }

    res.json({ players });
}

async function _sets(req: Request, res: Response) {
    const url = req.query.url as string;
    const slugs = _slugs(url);

    let sets: BoofSet[] = [];

    const bracketSlugId = new BracketSlugId();
    bracketSlugId.setTournamentSlug(slugs.tournamentSlug);
    bracketSlugId.setEventSlug(slugs.eventSlug);
    bracketSlugId.setPhaseSlug(slugs.phaseSlug);
    bracketSlugId.setBracketSlug(slugs.bracketSlug);

    const request = new GetBracketRequest();
    request.setSlugId(bracketSlugId);

    const auth = { "X-API-KEY": res.locals.config.startgg.token };
    //                                            ^ lol

    const client = new BracketServiceClient(PARRY_GRPC_ENDPOINT);
    const bracketResp = await client.getBracket(request, auth);
    const bracket = bracketResp.getBracket()!!;

    const seedIdsToEntrantIds: Map<string, string> = new Map();

    for (const seed of bracket.getSeedsList()) {
        seedIdsToEntrantIds.set(seed.getId(), seed.getEventEntrant()!!.getEntrant()!!.getId());
    }

    const matches = bracketResp.getBracket()!!.getMatchesList();
    const rounds = getRounds(matches);

    const winnersRoundsMap: Map<number, string> = new Map();
    const losersRoundsMap: Map<number, string> = new Map();

    for (const round of rounds) {
        (round.winnersSide ? winnersRoundsMap : losersRoundsMap)
            .set(round.round, round.label);
    }

    for (const match of matches) {
        const p1id = seedIdsToEntrantIds.get(match.getSlotsList()[0].getSeedId());
        const p2id = seedIdsToEntrantIds.get(match.getSlotsList()[1].getSeedId());

        if (!p1id || !p2id) {
            continue;
        }

        sets.push({
            id: match.getId(),
            player1Id: p1id,
            player2Id: p2id,
            round: match.getWinnersSide() ? winnersRoundsMap.get(match.getRound())!! : losersRoundsMap.get(match.getRound())!!,
            phase: "Bracket",
            completed: match.getState() == MatchState.MATCH_STATE_COMPLETED,
        });
    }

    res.json(sets);
}

export const init = wrap(_init);
export const sets = wrap(_sets);
