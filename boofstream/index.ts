import * as startgg from "./startgg";

import { BoofState, Character, CHARACTER_COLORS, CharacterColor, Commentator, Player } from "../boofstream-common/boof";

import cors from "cors";
import express from "express";
import { OBSWebSocket } from "obs-websocket-js";
import { Server } from "socket.io";
import { SlpRealTime, SlpLiveStream } from "@vinceau/slp-realtime";
import { ConnectionEvent, ConnectionStatus, ConsoleConnection, PlayerType } from "@slippi/slippi-js";

import fs from "fs";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
let livestream: SlpLiveStream | null = null;
const realtime = new SlpRealTime();
let started = false;
const obs = new OBSWebSocket();

const configFile = fs.readFileSync("config.json");
const config = JSON.parse(configFile.toString("utf-8"));

if (config.obsPassword) {
    obs.connect("ws://127.0.0.1:4455", config.obsPassword);
}

function scene(sceneName: string) {
    obs.call("SetCurrentProgramScene", { sceneName });
}

const DEFAULT_PLAYER: Player = {
    score: 0,
    sponsor: "",
    name: "",
    losers: false,
    pronouns: "",
    twitter: "",
    country: "",
    state: "",
    seed: -1,
};

let state: BoofState = {
    tournament: {
        name: "",
        match: "",
        phase: "",
        bestOf: 5,
    },
    player1: DEFAULT_PLAYER,
    player2: DEFAULT_PLAYER,
    commentators: [],
    tournamentUrl: "",
    lastPlayer1Score: 0,
    lastPlayer2Score: 0,
    slippiConnected: false,
    doObsSwitch: false,
    started: false,
    slippiPort: 53742,
};

if (fs.existsSync("out/state.json")) {
    state = JSON.parse(fs.readFileSync("out/state.json").toString("utf-8"));
}

const P1_COLOR = "#00a800";
const P2_COLOR = "#0f7477";

function convertCountry(country: string) {
    if (!country) return {};
    
    return {
        "asset": `../boofstream/assets/country_flag/${country}.png`,
        "code": country.toUpperCase(),
    };
}

function convertState(country: string, state: string) {
    if (!country || !state) return {};
    
    return {
        "asset": `../boofstream/assets/state_flag/${country.toUpperCase()}/${state}.png`,
        "code": state,
    };
}

function convertCharacter(character?: Character, characterColor?: CharacterColor) {
    if (!character && character !== 0) return {};

    const color = characterColor == CharacterColor.DEFAULT
        ? 0
        : CHARACTER_COLORS[character].indexOf(characterColor!!) + 1;

    const colorNumber = color < 10 
        ? "0" + color 
        : "" + color;

    return {
        "1": {
            assets: {
                "base_files/icon": {
                    asset: `../boofstream/assets/characters/chara_2_${Character[character].toLowerCase()}_${colorNumber}.png`,
                    average_size: { x: 24.0, y: 24.0 },
                    type: ["icon"],
                }
            },
            skin: 1,
            "codename": "character",
            "display_name": "character",
            "en_name": "character",
            "name": "character",
        }
    }
}

function convertPlayer(player: Player, color: string) {
    return {
        color,
        teamName: "",
        losers: player.losers,
        score: player.score,
        player: {
            "1": {
                name: player.name + (player.losers && config.appendLToLosers ? " [L]" : ""),
                team: player.sponsor,
                pronoun: player.pronouns,
                twitter: player.twitter,
                seed: player.seed == -1 ? undefined : player.seed,
                country: convertCountry(player.country),
                state: convertState(player.country, player.state),
                character: convertCharacter(player.character, player.characterColor)
            }
        }
    }
}

function convertCommentator({ sponsor, name, twitter, pronouns }: Commentator) {
    return {
        team: sponsor,
        name,
        twitter,
        pronoun: pronouns,
    }
}

app.use(express.json());
app.use(cors());
app.use("/assets", express.static("assets"));

app.get("/countries", (req, res) => {
    res.json(fs.readdirSync("assets/country_flag").map(x => x.replace(".png", "")))
});

app.get("/countries/:country/states", (req, res) => {
    res.json(fs.readdirSync("assets/state_flag/" + req.params.country.toUpperCase()).map(x => x.replace(".png", "")))
});

app.get("/state", (_, res) => {
    if (!livestream) {
        state.slippiConnected = false;
    }

    res.json(state);
});

function writeState() {
    fs.writeFileSync("out/state.json", JSON.stringify(state));

    fs.writeFileSync("out/program_state.json", JSON.stringify({
        timestamp: new Date().getTime(),
        tournamentInfo: {
            tournamentName: state.tournament.name || "",
        },
        score: {
            "1": {
                team: {
                    "1": convertPlayer(state.player1, P1_COLOR),
                    "2": convertPlayer(state.player2, P2_COLOR),
                },
                phase: state.tournament.phase || "",
                match: state.tournament.match || "",
                best_of_text: "Best of " + state.tournament.bestOf,
            }
        },
        commentary: state.commentators.map(convertCommentator),
    }));
}

app.post("/state", (req, res) => {
    state = req.body;
    
    console.log("STATE:");
    console.log(state);

    writeState();

    setTimeout(() => io.emit("update_state", req.query.clientId), 100);

    res.status(201);
    res.end();
});

app.get("/startgg/init", startgg.init);
app.get("/startgg/sets", startgg.sets);
app.post("/startgg/sets/report", startgg.report);

function parseCharacterColor(player: PlayerType) {
    if (!player.characterColor) {
        return CharacterColor.DEFAULT;
    }
    // @ts-ignore
    return CHARACTER_COLORS[player.characterId!!][player.characterColor - 1];
}

app.post("/slippi/livestream", async (req, res) => {
    if (livestream) {
        livestream.end();
        livestream = null;
    }

    livestream = new SlpLiveStream("console");

    function onDisconnect() {
        livestream?.end();
        livestream = null;

        // wait a second to avoid fighting with the client
        setTimeout(() => {
            state.slippiConnected = false;
            state.slippi = undefined;
            writeState();
            io.emit("update_state", "slippi");
        }, 250);
    }

    livestream.connection.on(ConnectionEvent.STATUS_CHANGE, (status: ConnectionStatus) => {
        if (status == ConnectionStatus.DISCONNECTED) {
            onDisconnect();
        }
    });
    livestream.connection.on(ConnectionEvent.ERROR, onDisconnect);

    try {
        await livestream.start("127.0.0.1", req.body.port);
    } catch {
        onDisconnect();
        res.send("ok");
        res.status(201);
        return;
    }
    
    realtime.setStream(livestream);

    realtime.game.start$.subscribe(e => {
        console.log("PLAYER 0:", e.players[0]);
        console.log("PLAYER 1",e.players[1]);
        
        state = { ...state, slippi: {
            port1: e.players[0].port,
            port2: e.players[1].port,
            character1: e.players[0].characterId!!,
            character2: e.players[1].characterId!!,
            characterColor1: parseCharacterColor(e.players[0]),
            characterColor2: parseCharacterColor(e.players[1]),
            player1IsPort1: state.slippi ? state.slippi.player1IsPort1 : undefined,
        }, slippiConnected: true };

        const slippi = state.slippi!!;

        if (slippi.player1IsPort1 !== undefined) {
            state.player1.character = slippi.player1IsPort1
                ? slippi.character1
                : slippi.character2;
            state.player1.characterColor = slippi.player1IsPort1
                ? slippi.characterColor1
                : slippi.characterColor2;

            state.player2.character = slippi.player1IsPort1
                ? slippi.character2
                : slippi.character1;
            state.player2.characterColor = slippi.player1IsPort1
                ? slippi.characterColor2
                : slippi.characterColor1;
        }

        if (state.doObsSwitch) {
            scene(config.obsStartedMainScene);
        }

        writeState();
        io.emit("update_state", "slippi");

        console.log(state);
    });

    livestream.gameEnd$.subscribe(e => {
        const { slippi } = state;
        if (state.doObsSwitch) {
            scene(config.obsNoGameScene);
        }

        console.log("started:", state.started, "!slippi:", !slippi, "p1IsP1:", slippi?.player1IsPort1)

        if (!state.started || !slippi || slippi.player1IsPort1 === undefined) return;

        const player1Port = slippi.player1IsPort1 ? slippi.port1 : slippi.port2;
        const player1Wins = e.placements[player1Port - 1].position === 0;
    
        console.log("LRAS", e.lrasInitiatorIndex);

        if (e.lrasInitiatorIndex !== -1) {
            // LRAS - do nothing
            return;
        }

        if (player1Wins) {
            state.player1.score++;
        } else {
            state.player2.score++;
        }

        writeState();
        io.emit("update_state", "slippi");
    });

    livestream.playerFrame$.subscribe(frame => {        
        const slippi = state.slippi;

        if (!slippi) return;

        const internalCharacterId1 = frame.players[slippi.port1 - 1]!!.post.internalCharacterId;
        const internalCharacterId2 = frame.players[slippi.port2 - 1]!!.post.internalCharacterId;

        let updated = false;

        if (internalCharacterId1 == 7 && slippi.character1 === Character.ZELDA) { // sheik
            state.slippi!!.character1 = Character.SHEIK;
            updated = true;
        } else if (internalCharacterId1 == 19 && slippi.character1 === Character.SHEIK) { // zelda
            state.slippi!!.character1 = Character.ZELDA;
            updated = true;
        }

        if (internalCharacterId2 == 7 && slippi.character2 === Character.ZELDA) { // sheik
            state.slippi!!.character2 = Character.SHEIK;
            updated = true;
        } else if (internalCharacterId2 == 19 && slippi.character2 == Character.SHEIK) { // zelda
            state.slippi!!.character2 = Character.ZELDA;
            updated = true;
        }

        if (!updated) return;

        if (slippi.player1IsPort1 !== undefined) {
            state.player1.character = slippi.player1IsPort1
                ? slippi.character1
                : slippi.character2;
            state.player2.character = slippi.player1IsPort1
                ? slippi.character2
                : slippi.character1;
        }        writeState();

        io.emit("update_state", "slippi");
    })

    res.send("ok");
    res.status(200);
    res.end();
});

app.post("/slippi/disconnect", async (_, res) => {
    livestream?.end();
    livestream = null;

    res.send("ok");
    res.status(200);
    res.end();
})

app.post("/start", () => { 
    started = true; 
});
app.post("/end", () => { 
    started = false;
});

app.get("/die", async () => {
    throw new Error("die");
})

app.listen(1337, () => console.log("live!"));
server.listen(1338);
