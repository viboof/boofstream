import { OBSConfig } from "boofstream-common";
import SubConfigModal from "./SubConfigModal";
import OutsideLink from "../OutsideLink";
import BigButton from "../BigButton";

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
    return <SubConfigModal 
        isOpen={isOpen}
        title="obs settings"
        onSave={() => onSave(value)}
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
        <BigButton onClick={connected ? onDisconnect : onConnect}>
            { connected ? "disconnect from" : "connect to" } OBS
        </BigButton>
    </SubConfigModal>
}
