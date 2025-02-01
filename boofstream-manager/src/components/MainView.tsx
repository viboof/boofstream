"use client";

import { BoofConfig, BoofSet, BoofState, Character, GameResult, MeleeStage, Player, StartggPlayer } from "boofstream-common";
import PlayerInfo from "./playerinfo/PlayerInfo";
import Image from "next/image";
import Boof from "@/assets/boof.gif";
import { useEffect, useState } from "react";
import { getBackendHost } from "@/utils";
import BigButton from "./forms/BigButton";
import PortMatcher from "./PortMatcher";
import SetSelector from "./setselector/SetSelector";
import TournamentInfo from "./TournamentInfo";
import Modal from "./utils/Modal";
import Hr from "./utils/Hr";
import ConfigModal from "./config/ConfigModal";
import GameResultsInfo from "./gameresults/GameResultsInfo";

const DEFAULT_PLAYER: Player = {
    score: 0,
    sponsor: "",
    name: "",
    twitter: "",
    pronouns: "",
    seed: -1,
    losers: false,
    country: "",
    state: "",
};

export default function MainView(
    { state, config, onChange, onSave, onConfigChange, onConfigSave }: 
    { 
        state: BoofState,
        config: BoofConfig,
        onChange: (state: BoofState) => void, 
        onSave: (state: BoofState) => void,
        onConfigChange: (config: BoofConfig) => void,
        onConfigSave: (config: BoofConfig) => void,
    },
) {
    const [sggPlayers, setSggPlayers] = useState([] as StartggPlayer[]);
    const [sets, setSets] = useState([] as BoofSet[]);
    const [loaded, setLoaded] = useState(false);

    const [showChangeSetModal, setShowChangeSetModal] = useState(false);
    const [showCompletedSets, setShowCompletedSets] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [changeSetLoading, setChangeSetLoading] = useState(false);

    const slippiPort = config.slippi.port;
    const tournamentUrl = config.startgg.tournamentUrl;

    async function loadPlayers(tourneyUrl: string | undefined = tournamentUrl) {
        if (!tourneyUrl) return;

        const parts = tourneyUrl.split("start.gg/")[1].split("/");

        // 0          1                            2     3             4
        // tournament/don-t-park-on-the-grass-2024/event/melee-singles/brackets
        const url = "https://start.gg/" + parts.slice(0, 4).join("/");

        const res = await fetch(getBackendHost() + "startgg/init?url=" + encodeURIComponent(url));
        const json = await res.json()
        if (json.error) {
            console.error("ERROR LOADING PLAYERS:", json.error);
            // await loadPlayers(url);
            return;
        }
        console.log("setting sggPlayers:",json.players);
        setSggPlayers(json.players);
    }

    async function loadSets(url: string) {
        const parts = url.split("start.gg/")[1].split("/");

        // 0          1                            2     3             4
        // tournament/don-t-park-on-the-grass-2024/event/melee-singles/brackets
        url = "https://start.gg/" + parts.slice(0, 4).join("/");

        const res = await fetch(getBackendHost() + "startgg/sets?url=" + encodeURIComponent(url));
        const json = await res.json();
        if (json.error) {
            console.error("ERROR LOADING SETS:", json.error);
            // await loadSets(url);
            return;
        }
        setSets(json);
    }

    useEffect(() => { 
        (async () => {
            const tourneyUrl = tournamentUrl;

            if (tourneyUrl) {
                await loadPlayers(tourneyUrl);
                await loadSets(tourneyUrl);
            }

            setLoaded(true);
        })().then();
    }, []);

    function loadTournament() {
        if (!tournamentUrl) {
            setSggPlayers([]);
            return;
        }
        loadPlayers().then(() => loadSets(tournamentUrl).then());
    }

    function onChangeAndSave(state: BoofState) {
        onChange(state);
        onSave(state);
    }

    function toggleSlippiConnection() {
        if (state.slippiConnected) {
            fetch(getBackendHost() + "slippi/disconnect", { method: "POST" });
            onChangeAndSave({
                ...state,
                slippiConnected: false,
                slippi: undefined
            });
        } else {
            fetch(getBackendHost() + "slippi/livestream", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ port: slippiPort })
            }).then(() => onChangeAndSave({ ...state, slippiConnected: true }));
        }
    }

    function onPortMatch(player1IsPort1?: boolean) {
        const slippi = state.slippi!!;

        if (player1IsPort1 === undefined) {
            onChangeAndSave({ ...state, slippi: { ...slippi, player1IsPort1: undefined } });
            return;
        }

        const player1Character = player1IsPort1 ? slippi.character1 : slippi.character2;
        const player1Color = player1IsPort1 ? slippi.characterColor1 : slippi.characterColor2;

        const player2Character = player1IsPort1 ? slippi.character2 : slippi.character1;
        const player2Color = player1IsPort1 ? slippi.characterColor2 : slippi.characterColor1;

        onChangeAndSave({
            ...state,
            slippi: { ...slippi, player1IsPort1 },
            player1: { ...state.player1, character: player1Character, characterColor: player1Color },
            player2: { ...state.player2, character: player2Character, characterColor: player2Color }
        });
    }

    function resetMatch() {
        const slippi = state.slippi;

        if (slippi) {
            slippi.player1IsPort1 = undefined;
        }

        onChangeAndSave({
            ...state,
            slippi,
            tournament: {
                ...state.tournament,
                phase: "",
                match: "",
            },
            player1: DEFAULT_PLAYER,
            player2: DEFAULT_PLAYER,
        });
    }

    function computePlayerMap(): Map<number, StartggPlayer> {
        const map: Map<number, StartggPlayer> = new Map();

        for (const player of sggPlayers) {
            map.set(player.entrantId, player);
        }

        return map;
    }

    const playerMap = computePlayerMap();

    function loadSet(set: BoofSet) {
        let player1 = playerMap.get(set.player1Id)!!.player;
        let player2 = playerMap.get(set.player2Id)!!.player;

        if (set.round === "Grand Final") {
            player2.losers = true;
        } else if (set.round === "Grand Final Reset") {
            player1.losers = true;
            player2.losers = true;
        }

        onChangeAndSave({
            ...state,
            tournament: {
                ...state.tournament,
                match: set.round,
                phase: set.phase,
            },
            player1,
            player2,
        });

        setShowChangeSetModal(false);
    }

    function resetScores() {
        onChangeAndSave({ 
            ...state, 
            player1: { ...state.player1, score: 0 },
            player2: { ...state.player2, score: 0 },
        });
    }

    function swapPlayers() {
        let slippi = state.slippi;

        if (slippi && slippi.player1IsPort1 !== undefined && slippi.player1IsPort1 !== null) {
            slippi.player1IsPort1 = !slippi.player1IsPort1;
            
            const newGameResults: GameResult[] = [];

            for (const r of slippi.gameResults) {
                let result: GameResult = { ...r };  // copy

                result.player1IsWinner = !r.player1IsWinner;
                
                const oldP1Char = result.player1Character;
                const oldP2Char = result.player2Character;

                result.player1Character = oldP2Char;
                result.player2Character = oldP1Char;

                newGameResults.push(result);
            }

            slippi.gameResults = newGameResults;
        }

        onChangeAndSave({
            ...state,
            slippi,
            player1: state.player2,
            player2: state.player1,
        });
    }

    function onChangeGameResults(gameResults: GameResult[], removedResult?: GameResult) {
        let s: BoofState = { ...state };  // copy
    
        if (removedResult) {
            console.log("removedResult", removedResult);
            if (removedResult.player1IsWinner) s.player1.score--;
            else s.player2.score--;
        }

        s.slippi!!.gameResults = gameResults;

        onChangeAndSave(s);
    }

    function toggleSetStarted() {
        const s: BoofState = { ...state };  // copy
        
        // if we are ending
        if (s.started && s.slippi) {
            // reset game results
            s.slippi.gameResults = [];
        }

        s.started = !s.started;
        
        onChangeAndSave(s);
    }

    if (!loaded) {
        return null;
    }

    return <div style={{ margin: "32px", fontFamily: "sans-serif" }}>
        <center>
            <Image src={Boof} alt="boof logo" /> <h1 style={{ display: "inline", fontSize: 64 }}>boofstream</h1>
        </center>
		<Hr margin={16} />
        <div className="column">
            <PlayerInfo 
                player={state.player1} 
                sggPlayers={sggPlayers} 
                isPlayer1={true} 
                onChange={player1 => onChange({ ...state, player1 })}
                onSave={player1 => onSave({ ...state, player1 })}
            />
        </div>
        <div className="column">
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ width: "25vw" }}>
                    <center>
                    <h1 style={{ color: state.slippiConnected ? "green" : "red" }}>
                        wii is{state.slippiConnected ? "" : " NOT"} connected!
                    </h1>
                    </center>
                </div>
                <div>
                    <center>
                        <BigButton onClick={toggleSlippiConnection}>
                            {state.slippiConnected ? "disconnect from" : "connect to"} wii
                        </BigButton>
                    </center>
                </div>
                <hr style={{ marginTop: 16, marginBottom: 8 }} />
                <TournamentInfo 
                    value={state.tournament} 
                    onChange={tournament => onChange({ ...state, tournament })}
                    onSave={tournament => onSave({ ...state, tournament })}
                />
                <hr style={{ marginBottom: 16, marginTop: 8 }} />

                <center>click me when {state.started ? "set is over" : "handwarmers are done"}:</center>
                <BigButton 
                    color={state.started ? "red" : "#00ff00"}
                    onClick={toggleSetStarted}
                >
                    {state.started ? "end" : "start"} set
                </BigButton>
                <BigButton onClick={swapPlayers}>swap players</BigButton>
                <BigButton onClick={resetScores}>reset scores</BigButton>
                <BigButton onClick={resetMatch}>reset match</BigButton>
                <BigButton onClick={() => {
                    setChangeSetLoading(true);
                    loadSets(tournamentUrl).then(() => {
                        setShowChangeSetModal(true);
                        setChangeSetLoading(false);
                    });
                }}>{changeSetLoading ? "loading..." : "change set"}</BigButton>
                <BigButton onClick={() => setShowSettingsModal(true)}>settings</BigButton>
                {state.slippiConnected && state.slippi ?
                    <PortMatcher 
                        player1={state.player1} 
                        slippi={state.slippi}
                        onChange={onPortMatch}
                    /> :
                    ""
                }

                <Hr margin={16} />
                {state.slippi ?
                    <GameResultsInfo 
                        value={state.slippi.gameResults} 
                        player1={state.player1}
                        player2={state.player2}
                        onChange={onChangeGameResults} 
                    /> : ""
                }

                {/* ---- BEGIN MODALS ---- */}

                <Modal title="select set" isOpen={showChangeSetModal} onClose={() => setShowChangeSetModal(false)}>
                    <SetSelector 
                        sets={sets} 
                        onSelect={loadSet} 
                        playerMap={playerMap}
                        showCompleted={showCompletedSets}
                        onChangeShowCompleted={setShowCompletedSets}
                    />
                </Modal>

                <ConfigModal 
                    show={showSettingsModal} 
                    value={config}
                    obsConnected={state.obsConnected}
                    // admins have negative entrant IDs
                    startggPlayerCount={sggPlayers.filter(p => p.entrantId >= 0).length}
                    onClose={() => setShowSettingsModal(false)}
                    onChange={onConfigChange}
                    onSave={onConfigSave}
                    onOBSConnect={() => fetch(getBackendHost() + "obs/connect", { method: "post" })}
                    onOBSDisconnect={() => fetch(getBackendHost() + "obs/disconnect", { method: "post" } )}
                    onStartggLoad={() => loadTournament()}
                />
            </div>
        </div>
        <div className="column">
            <PlayerInfo 
                player={state.player2} 
                sggPlayers={sggPlayers} 
                isPlayer1={false} 
                onChange={player2 => onChange({ ...state, player2 })}
                onSave={player2 => onSave({ ...state, player2 })}
            />
        </div>
    </div>;
}
