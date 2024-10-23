"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PlayerInfo from "./components/PlayerInfo";
import { BoofSet, BoofState, Commentator, Player, Slippi, StartggPlayer } from "./types/boof";
import CommentatorInfo from "./components/CommentatorInfo";
import { getBackendHost, getSocketHost } from "./utils";
import { CharacterMatcher } from "./components/CharacterMatcher";

const socket = io(getSocketHost());

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
}

export default function Page() {
    const [name, setName] = useState("");
    const [match, setMatch] = useState("");
    const [phase, setPhase] = useState("");
    const [bestOf, setBestOf] = useState(5);
    const [player1, setPlayer1] = useState(DEFAULT_PLAYER);
    const [player2, setPlayer2] = useState(DEFAULT_PLAYER);
    const [key, setKey] = useState(Math.random());
    const [commentators, setCommentators] = useState([] as (Commentator | null)[]);
    const [tournamentUrl, setTournamentUrl] = useState("");
    const [sggPlayers, setSggPlayers] = useState([] as StartggPlayer[]);
    const [sets, setSets] = useState([] as BoofSet[]);
    const [setId, setSetId] = useState(0 as number | string);
    const [player1Id, setPlayer1Id] = useState(0);
    const [player2Id, setPlayer2Id] = useState(0);
    const [sggKey, setSggKey] = useState(Math.random());
    const [showCompleted, setShowCompleted] = useState(false);
    const [started, setStarted] = useState(false);
    const [reportSetConfirm, setReportSetConfirm] = useState(false);
    const [player1Name, setPlayer1Name] = useState("");
    const [player2Name, setPlayer2Name] = useState("");
    const [activeSet, setActiveSet] = useState(null as BoofSet | null);
    const [player1Wins, setPlayer1Wins] = useState([] as boolean[]);
    const [lastPlayer1Score, setLastPlayer1Score] = useState(0);
    const [lastPlayer2Score, setLastPlayer2Score] = useState(0);
    const [slippi, setSlippi] = useState(null as Slippi | null);
    const [slippiConnected, setSlippiConnected] = useState(false);
    const [slippiPort, setSlippiPort] = useState(-1);
    const clientId = Math.random();

    function save(p1 = player1, p2 = player2) {
        const state: BoofState = {
            tournament: { name, match, phase, bestOf },
            player1: p1,
            player2: p2,
            commentators: commentators.filter(c => c !== null),
            tournamentUrl,
            lastPlayer1Score,
            lastPlayer2Score,
            player1Wins,
            slippi: slippi || undefined,
            slippiConnected,
        }

        if (activeSet) {
            state.activeSet = activeSet;
        }

        fetch(getBackendHost() + "state?clientId=" + clientId, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(state),
        }).then(() => loadInit());
    }

    function addCommentator() {
        let newComms = [ ...commentators ];

        let squeezedIn = false;

        for (let i = 0; i < newComms.length; i++) {
            if (newComms[i] === null) {
                newComms[i] = { id: i + 1, sponsor: "", name: "", twitter: "", pronouns: "" };
                squeezedIn = true;
                break;
            }
        }

        if (!squeezedIn) {
            newComms.push({ id: newComms.length + 1, sponsor: "", name: "", twitter: "", pronouns: "" });
        }

        setCommentators(newComms);
    }

    function updateCommentator(commentator: Commentator) {
        setCommentators(commentators.map(elem => elem && elem.id === commentator.id ? commentator : elem));
    }

    function removeCommentator(id: number) {
        setCommentators(commentators.map(c => c && c.id === id ? null : c));
    }

    function computePlayerMap(): Map<number, StartggPlayer> {
        const map: Map<number, StartggPlayer> = new Map();

        for (const player of sggPlayers) {
            map.set(player.entrantId, player);
        }

        return map;
    }

    function loadSet(set: BoofSet) {
        const playerMap = computePlayerMap();

        let player1 = playerMap.get(set.player1Id)!!.player;
        let player2 = playerMap.get(set.player2Id)!!.player;

        if (set.round === "Grand Final") {
            player2.losers = true;
        } else if (set.round === "Grand Final Reset") {
            player1.losers = true;
            player2.losers = true;
        }

        setSetId(set.id);
        setPlayer1Id(set.player1Id);
        setPlayer2Id(set.player2Id);
        setPlayer1(player1);
        setPlayer2(player2);
        setMatch(set.round);
        setPhase(set.phase);
        setPlayer1Name(player1.name);
        setPlayer2Name(player2.name);
        setKey(Math.random());
        setSggKey(Math.random());
        setActiveSet(set);
    }

    function getSetList() {
        if (!sggPlayers.length) return;

        console.log("sets:", sets);

        const playerMap = computePlayerMap();

        console.log(playerMap);

        let out = [];

        for (const set of sets.filter(s => showCompleted || !s.completed)) {
            console.log(set);

            const p1 = playerMap.get(set.player1Id)!!.player.name;
            const p2 = playerMap.get(set.player2Id)!!.player.name;
            out.push(<><a href="#" key={set.id} style={{fontSize: 12}} onClick={e => {
                e.preventDefault();
                loadSet(set);
            }}>- {p1} v. {p2} - {set.round}</a><br /></>)
        }

        return <div>{out}</div>;
    }

    async function load(): Promise<BoofState> {
        return await fetch(getBackendHost() + "state")
            .then(res => res.json())
            .then((state: BoofState) => {
                setName(state.tournament.name);
                setMatch(state.tournament.match);
                setPhase(state.tournament.phase);
                setBestOf(state.tournament.bestOf);
                setPlayer1(state.player1);
                setPlayer2(state.player2);
                setCommentators(state.commentators);
                setTournamentUrl(state.tournamentUrl);
                setKey(Math.random());
                setPlayer1Wins(state.player1Wins);
                setLastPlayer1Score(state.lastPlayer1Score);
                setLastPlayer2Score(state.lastPlayer2Score);
                setSlippi(state.slippi || null);
                setSlippiConnected(state.slippiConnected);

                if (state.slippi && slippiConnected && state.slippi.player1IsPort1 !== undefined) {
                    onCharacterMatch(state.slippi.player1IsPort1, state.slippi);
                }

                if (state.activeSet) {
                    setActiveSet(state.activeSet);
                }

                loadInit(state.tournamentUrl);

                return state;
            });
    }

    useEffect(() => {
        if (activeSet === null || !sggPlayers.length || setId) return;
        console.log("sggPlayers",sggPlayers);

        const players = computePlayerMap();

        setSetId(activeSet.id);
        setPlayer1Id(activeSet.player1Id);
        setPlayer2Id(activeSet.player2Id);
        setPlayer1Name(players.get(activeSet.player1Id)!!.player.name);
        setPlayer2Name(players.get(activeSet.player2Id)!!.player.name);
    }, [sggPlayers]);

    function loadInit(url = tournamentUrl) {
        if (!url) return;

        loadSets(url);
        loadPlayers(url);
    }

    async function loadPlayers(url: string) {
        const res = await fetch(getBackendHost() + "startgg/init?url=" + encodeURIComponent(url));
        const json = await res.json()
        if (json.error) {
            console.error("ERROR LOADING PLAYERS:", json.error);
            await loadPlayers(url);
            return;
        }
        console.log("setting sggPlayers:",json.players);
        setSggPlayers(json.players);
    }

    async function loadSets(url: string) {
        const res = await fetch(getBackendHost() + "startgg/sets?url=" + encodeURIComponent(url));
        const json = await res.json();
        if (json.error) {
            console.error("ERROR LOADING SETS:", json.error);
            await loadSets(url);
            return;
        }
        setSets(json);
    }

    function resetMatch() {
        setMatch("");
        setPhase("");
        setPlayer1(DEFAULT_PLAYER);
        setPlayer2(DEFAULT_PLAYER);
        setSetId(0);
        setPlayer1Id(0);
        setPlayer2Id(0);
        setPlayer1Name("");
        setPlayer2Name("");

        setKey(Math.random());
    }

    useEffect(() => console.log("sggPlayers:",sggPlayers), [sggPlayers]);

    useEffect(() => { load().then() }, []);
    useEffect(() => {
        socket.on("update_state", (cid) => {
            console.log("update", cid);
            if (cid !== clientId) {
                load().then();
            }
        });
    }, []);
    useEffect(() => setSggKey(Math.random()), [sggPlayers, sets]);

    function toggleStarted() {
        if (started) {
            fetch(getBackendHost() + "/end");
        } else {
            fetch(getBackendHost() + "/start");
        }
        setStarted(!started);
    }

    function markWin(isPlayer1: boolean) {
        setLastPlayer1Score(player1.score);
        setLastPlayer2Score(player2.score);
        setPlayer1Wins([ ...player1Wins, isPlayer1 ]);

        if (isPlayer1) {
            setPlayer1({ ...player1, score: player1.score + 1 });
        } else {
            setPlayer2({ ...player2, score: player2.score + 1 });
        }

        setKey(Math.random());
    }

    function undoMarkWin() {
        setPlayer1Wins(player1Wins.slice(0, player1Wins.length - 1));

        player1.score = lastPlayer1Score;
        player2.score = lastPlayer2Score;
    }

    function reportSet() {
        if (!reportSetConfirm) {
            setReportSetConfirm(true);
            return;
        }

        fetch(getBackendHost() + "startgg/sets/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ setId, player1Id, player2Id, player1Wins }),
        }).then(res => {
            setReportSetConfirm(false);
            setPlayer1Wins([]);
            res.text().then(t => console.log("report set result: ", t));
        });
    }

    function onCharacterMatch(player1IsPort1: boolean, s = slippi) {
        setSlippi({ ...s!!, player1IsPort1 });
        setPlayer1({ 
            ...player1, 
            character: player1IsPort1 ? s!!.character1 : s!!.character2,
            characterColor: player1IsPort1 ? s!!.characterColor1 : s!!.characterColor2,
        });
        setPlayer2({
            ...player2,
            character: player1IsPort1 ? s!!.character2 : s!!.character1,
            characterColor: player1IsPort1 ? s!!.characterColor2 : s!!.characterColor1, 
        });
        setKey(Math.random());
    }

    function connectSlippi() {
        fetch(getBackendHost() + "slippi/livestream", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ port: slippiPort })
        }).then(() => setSlippiConnected(true));
    }

    function disconnectSlippi() {
        fetch(getBackendHost() + "slippi/disconnect", { method: "POST" });
        setSlippiConnected(false);
        setSlippi(null);
    }

    return <div style={{ height: "100vh" }}>
    <div>
        <button style={{fontSize: "32px"}} onClick={() => save()}>SAVE EVERYTHING</button>
        {/* <h1>match is: {started 
            ? <span style={{color: "green"}}>STARTED</span> 
            : <span style={{color: "red"}}>NOT STARTED</span>
        } <button onClick={() => toggleStarted()}>{started ? "end" : "start"}</button></h1> */}
    </div>
    <div style={{ width: "100%", height: "100%", display: "block" }}>
        <div style={{ float: "left", width: "50%", height: "100%", }}>
            <div style={{ width: "100%" }}>
                <div style={{ float: "left", width: "50%" }}>
                    <PlayerInfo 
                        key={key} 
                        player={1} 
                        value={player1} 
                        onChange={setPlayer1} 
                        sggPlayers={sggPlayers} 
                        onWin={() => markWin(true)}
                    />
                </div>
                <div style={{ float: "right", width: "50%" }}>
                    <PlayerInfo 
                        key={key} 
                        player={2} 
                        value={player2} 
                        onChange={setPlayer2} 
                        sggPlayers={sggPlayers} 
                        onWin={() => markWin(false)}
                    />
                </div>
            </div>
        </div>
        <div style={{ float: "right", width: "50%", height: "100%", }}>
            <div style={{ width: "100%"}}>
                <div style={{ float: "left", width: "50%" }}>
                    <h1>tournament</h1>
                    name: <input type="text" value={name} onChange={e => setName(e.target.value)} /><br />
                    match: <input type="text" value={match} onChange={e => setMatch(e.target.value)} /><br />
                    phase: <input type="text" value={phase} onChange={e => setPhase(e.target.value)} /><br />
                    best of: <input type="number" value={bestOf} onChange={e => setBestOf(e.target.valueAsNumber)} /><br />
                    <button onClick={() => resetMatch()}>reset match</button><br />
                    <h1>start.gg</h1>
                    load tournament: <input value={tournamentUrl} onChange={e => setTournamentUrl(e.target.value)} /><br />
                    <button onClick={() => loadInit()}>reload start.gg stuff</button><br />
                    <br />
                    active set: {player1Name
                        ? `${player1Name} v. ${player2Name} - ${match}`
                        : "none"
                    } <br />
                    win log: {player1Wins.map(p1 => p1 ? "p1 " : "p2 ")}
                    <button onClick={() => undoMarkWin()}>undo</button>
                    <br />
                    {!reportSetConfirm
                        ? <button onClick={reportSet}>report set</button>
                        : <>
                            report {player1.score} {player1.name} - {player2.name} {player2.score}?{" "}
                            <button onClick={() => reportSet()}>yes</button> /{" "}
                            <button onClick={() => setReportSetConfirm(false)}>no</button>
                        </>
                    }<br />
                    load set:<br />
                    <input type="checkbox" checked={showCompleted} onChange={e => setShowCompleted(e.target.checked)} />{" "}
                    show completed<br/>
                    <div key={sggKey}>{getSetList()}</div>
                    <br />
                    preloaded players:<br />
                    {(() => { console.log(sggPlayers); return "" })()}
                    {sggPlayers.map(p => <span style={{fontSize: 12}}>- {p.player.name} ({p.entrantId})<br /></span>)}
                </div>
                <div style={{ float: "right", width: "50%" }}>
                    <h1>realtime</h1>
                    { slippiConnected 
                        ? <>connected <button onClick={disconnectSlippi}>disconnect</button></>
                        : <>
                            disconnected. port:{" "}
                            <input 
                                type="number" 
                                value={slippiPort} 
                                onChange={e => setSlippiPort(e.target.valueAsNumber)}
                            />{" "}
                            <button onClick={connectSlippi}>connect</button>
                        </>
                    }<br />
                    { 
                        slippi && slippiConnected ?
                            (slippi.player1IsPort1 === undefined
                                ? <CharacterMatcher
                                    character1={slippi.character1}
                                    character2={slippi.character2}
                                    color1={slippi.characterColor1}
                                    color2={slippi.characterColor2}
                                    player1={player1}
                                    player2={player2}
                                    onMatch={onCharacterMatch}
                                />
                                : <button
                                    onClick={() => setSlippi({ ...slippi, player1IsPort1: undefined })}>
                                        unbind characters
                                </button>)
                            : ""
                    }
                    <h1>commentators</h1>
                    <button onClick={addCommentator}>add</button>
                    {commentators.map(comm =>
                        comm === null ? '' : 
                        <CommentatorInfo 
                            key={comm.id} 
                            value={comm} 
                            onChange={updateCommentator} 
                            onRemove={() => removeCommentator(comm.id)}
                            sggPlayers={sggPlayers}
                        />
                    )}
                </div>
            </div>
        </div>
    </div>
    </div>
}
