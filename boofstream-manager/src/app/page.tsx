"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import PlayerInfo from "./components/PlayerInfo";
import { BoofSet, BoofState, Commentator, Player, Slippi, StartggPlayer } from "./types/boof";
import CommentatorInfo from "./components/CommentatorInfo";
import { getBackendHost, getSocketHost } from "./utils";
import { CharacterMatcher } from "./components/CharacterMatcher";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

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
    const [csr, setCsr] = useState(false);

    useEffect(() => {
        setCsr(true);
    }, []);

    window.location.pathname = "/commentator";

    return <><a href="/commentator">go here</a></>
}
