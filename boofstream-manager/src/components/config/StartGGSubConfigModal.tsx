import { StartGGConfig } from "boofstream-common";
import SubConfigModal from "./SubConfigModal";
import OutsideLink from "../utils/OutsideLink";

export default function StartGGSubConfigModal(
    { isOpen, isRefreshingPlayers, value, playerCount, onBack, onChange, onSave, onLoadTournament, onRefreshPlayers }:
    {
        isOpen: boolean,
        isRefreshingPlayers: boolean,
        value: StartGGConfig,
        playerCount: number,
        onBack: () => void,
        onChange: (config: StartGGConfig) => void,
        onSave: (config: StartGGConfig) => void,
        onLoadTournament: () => void,
        onRefreshPlayers: () => void,
    }
) {
    return <SubConfigModal 
        isOpen={isOpen}
        title="start.gg settings"
        onSave={() => {
            onSave(value);
            onLoadTournament();
        }}
        onBack={onBack}
    >
        <OutsideLink href="https://start.gg/admin/profile/developer">personal access token</OutsideLink>
        : <input
            type="password"
            value={value.token}
            onChange={e => onChange({ ...value, token: e.target.value })}
        /><br />
        tournament URL: <input
            value={value.tournamentUrl}
            onChange={e => onChange({ ...value, tournamentUrl: e.target.value })}
        /><br />
        <small>(https://www.start.gg/tournament/.../events/melee-singles - do not include anything extra!)</small><br />
        <small>(parry.gg works too! just make sure you have a parry token!)</small><br />
        <strong>{ playerCount ? `${playerCount} players loaded!` : "" }</strong>{" "}
        <button disabled={isRefreshingPlayers} onClick={onRefreshPlayers}>
            {isRefreshingPlayers ? "refreshing players..." : "refresh players"}
        </button>
    </SubConfigModal>
}
