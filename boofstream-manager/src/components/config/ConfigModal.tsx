import { BoofConfig } from "boofstream-common";
import { useState } from "react";
import Modals from "./modals";
import SelectSubConfigModal from "./SelectSubConfigModal";
import SlippiSubConfigModal from "./SlippiSubConfigModal";
import OBSSubConfigModal from "./OBSSubConfigModal";
import StartGGSubConfigModal from "./StartGGSubConfigModal";
import CustomizationSubConfigModal from "./CustomizationSubConfigModal";

export default function ConfigModal(
    { 
        show, 
        value, 
        obsConnected,
        startggPlayerCount,
        onClose, 
        onChange, 
        onSave, 
        onOBSConnect, 
        onOBSDisconnect, 
        onStartggLoad
    }:
    {
        show: boolean,
        value: BoofConfig,
        obsConnected: boolean,
        startggPlayerCount: number,
        onClose: () => void,
        onChange: (config: BoofConfig) => void,
        onSave: (config: BoofConfig) => void,
        onOBSConnect: () => void,
        onOBSDisconnect: () => void,
        onStartggLoad: () => void,
    }
) {
    const [activeModal, setActiveModal] = useState(Modals.SELECT);

    const onBack = () => setActiveModal(Modals.SELECT);

    return <>
        <SelectSubConfigModal 
            isOpen={show && activeModal === Modals.SELECT}
            onClose={onClose}
            onSelect={setActiveModal}
        />
        <SlippiSubConfigModal
            isOpen={show && activeModal === Modals.SLIPPI}
            value={value.slippi}
            onChange={slippi => onChange({ ...value, slippi })}
            onSave={slippi => onSave({ ...value, slippi })}
            onBack={onBack}
        />
        <OBSSubConfigModal
            isOpen={show && activeModal === Modals.OBS}
            value={value.obs}
            connected={obsConnected}
            onChange={obs => onChange({ ...value, obs })}
            onSave={obs => onSave({ ...value, obs })}
            onBack={onBack}
            onConnect={onOBSConnect}
            onDisconnect={onOBSDisconnect}
        />
        <StartGGSubConfigModal
            isOpen={show && activeModal === Modals.STARTGG}
            value={value.startgg}
            playerCount={startggPlayerCount}
            onChange={startgg => onChange({ ...value, startgg })}
            onSave={startgg => onSave({ ...value, startgg })}
            onBack={onBack}
            onLoadTournament={onStartggLoad}
        />
        <CustomizationSubConfigModal
            isOpen={show && activeModal === Modals.CUSTOMIZATION}
            value={value.customization}
            onChange={customization => onChange({ ...value, customization })}
            onSave={customization => onSave({ ...value, customization })}
            onBack={onBack}
        />
    </>;
}
