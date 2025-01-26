import { BoofConfig, BoofState } from "boofstream-common";
import { getBackendHost, getSocketHost } from "@/utils";
import { useEffect, useState } from "react";
import MainView from "../components/MainView";
import { io } from "socket.io-client";

const clientId = Math.random();

export default function CommentatorPage() {
    const [state, setState] = useState(undefined as BoofState | undefined);
    const [config, setConfig] = useState(undefined as BoofConfig | undefined);

    useEffect(() => {
        fetch(getBackendHost() + "state?_=" + Math.random())
            .then(res => res.json())
            .then(setState)
            .catch(() => location.reload());

        fetch(getBackendHost() + "config?_=" + Math.random())
            .then(res => res.json())
            .then(setConfig)
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

    function saveConfig(config: BoofConfig) {
        fetch(
            getBackendHost() + "config?clientId=" + clientId, {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(config)
            }
        ).then();
    }

    if (!state || !config) {
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

    socket.on("update_config", (cid) => {
        console.log("update config", cid, clientId);
        if (cid === clientId.toString()) {
            console.log("ignoring - it us");
            return;
        }
        fetch(getBackendHost() + "config?_=" + Math.random())
            .then(res => res.json())
            .then(setConfig)
            .catch(() => location.reload());
    });

    return <MainView 
        state={state} 
        config={config}
        onChange={setState}
        onSave={save} 
        onConfigChange={setConfig}
        onConfigSave={saveConfig}
    />
}
