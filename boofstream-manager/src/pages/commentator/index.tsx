import { BoofState } from "@/app/types/boof";
import { getBackendHost, getSocketHost } from "@/app/utils";
import { useEffect, useState } from "react";
import CommentatorView from "./CommentatorView";
import { io } from "socket.io-client";

const clientId = Math.random();

export default function CommentatorPage() {
    const [state, setState] = useState(undefined as BoofState | undefined);

    useEffect(() => {
        fetch(getBackendHost() + "state?_=" + Math.random())
            .then(res => res.json())
            .then(setState)
            .catch(() => location.reload());
    }, []);

    function save(state: BoofState) {
        fetch(
            getBackendHost() + "state?clientId=" + clientId, {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(state)
            }
        ).then();
    }

    if (!state) {
        return null;
    }

    const socket = io(getSocketHost());

    socket.on("disconnect", () => {
        location.reload();
    });

    socket.on("update_state", (cid) => {
        console.log("update", cid, clientId);
        if (cid === clientId.toString()) {
            console.log("ignoring - it us");
            return;
        }
        fetch(getBackendHost() + "state?_=" + Math.random())
            .then(res => res.json())
            .then(setState)
            .catch(() => location.reload());
    });

    return <CommentatorView state={state} onChange={setState} onSave={save} />
}
