import { OBSConfig } from "boofstream-common";
import SubConfigModal from "./SubConfigModal";
import OutsideLink from "../utils/OutsideLink";
import BigButton from "../forms/BigButton";
import { useState } from "react";

export default function OBSSubConfigModal(
    { isOpen, value, connected, onBack, onChange, onSave, onConnect, onDisconnect }:
    {
        isOpen: boolean,
        value: OBSConfig,
        connected: boolean,
        onBack: () => void,
        onChange: (config: OBSConfig) => void,
        onSave: (config: OBSConfig) => void,
        onConnect: () => void,
        onDisconnect: () => void,
    }
) {
    const [lastValue, setLastValue] = useState(value);

    function save(config: OBSConfig) {
        onSave(config);
        setLastValue(config);
    }

    function isDirty(): boolean {
        return value.doSwitch !== lastValue.doSwitch ||
            value.host !== lastValue.host ||
            value.password !== lastValue.password ||
            value.gameScene !== lastValue.gameScene ||
            value.noGameScene !== lastValue.noGameScene;
    }

    return <SubConfigModal 
        isOpen={isOpen}
        title="obs settings"
        onSave={() => save(value)}
        onBack={onBack}
    >
        automatically switch between scenes when game starts/ends: <input
            type="checkbox"
            checked={value.doSwitch}
            onChange={e => onChange({ ...value, doSwitch: e.target.checked })}
        /><br />
        host: <input
            value={value.host}
            onChange={e => onChange({ ...value, host: e.target.value })}
        /><br />
        password: <input
            type="password"
            value={value.password}
            onChange={e => onChange({ ...value, password: e.target.value })}
        /><br />
        ingame scene name: <input
            value={value.gameScene}
            onChange={e => onChange({ ...value, gameScene: e.target.value })}
        /><br />
        no game / crowd cam scene name: <input
            value={value.noGameScene}
            onChange={e => onChange({ ...value, noGameScene: e.target.value })}
        /><br />
        <OutsideLink href="https://obsproject.com/kb/remote-control-guide">more info</OutsideLink><br />
        <BigButton onClick={connected ? onDisconnect : onConnect} disabled={!connected && isDirty()}>
            { connected ? "disconnect from" : "connect to" } OBS
        </BigButton><br />
        <small style={{ color: "red" }}>{ !connected && isDirty() ? "you must save before connecting" : "" }</small>
    </SubConfigModal>
}
