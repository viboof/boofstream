import { CustomizationConfig } from "boofstream-common";
import SubConfigModal from "./SubConfigModal";

export default function CustomizationSubConfigModal(
    { isOpen, value, onBack, onChange, onSave }:
    {
        isOpen: boolean,
        value: CustomizationConfig,
        onBack: () => void,
        onChange: (config: CustomizationConfig) => void,
        onSave: (config: CustomizationConfig) => void,
    }
) {
    return <SubConfigModal 
        isOpen={isOpen}
        title="customization settings"
        onSave={() => onSave(value)}
        onBack={onBack}
    >
        append [L] to the names of losers: <input
            type="checkbox"
            checked={value.appendLToLosers}
            onChange={e => onChange({ ...value, appendLToLosers: e.target.checked })}
        /><br />
        <small>this is helpful for layouts that don't do this automatically</small><br />
        player 1 team color: <input
            type="color"
            value={value.player1Color}
            onChange={e => onChange({ ...value, player1Color: e.target.value })}
        /><br />
        player 2 team color: <input
            type="color"
            value={value.player2Color}
            onChange={e => onChange({ ...value, player2Color: e.target.value })}
        /><br />
    </SubConfigModal>
}
