import { SlippiConfig } from "boofstream-common";
import SubConfigModal from "./SubConfigModal";

export default function SlippiSubConfigModal(
    { isOpen, value, onBack, onChange, onSave }:
    {
        isOpen: boolean,
        value: SlippiConfig,
        onBack: () => void,
        onChange: (config: SlippiConfig) => void,
        onSave: (config: SlippiConfig) => void,
    }
) {
    return <SubConfigModal 
        isOpen={isOpen}
        title="slippi settings"
        onSave={() => onSave(value)}
        onBack={onBack}
    >
        slippi port: <input 
            type="number"
            value={value.port} 
            onChange={e => onChange({ ...value, port: e.target.valueAsNumber })} 
        />
    </SubConfigModal>
}
