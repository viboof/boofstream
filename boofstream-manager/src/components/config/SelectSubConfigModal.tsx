import BigButton from "../forms/BigButton";
import Modal from "../utils/Modal";
import Modals from "./modals";

export default function SelectSubConfigModal(
    { isOpen, onClose, onSelect }:
    {
        isOpen: boolean,
        onClose: () => void,
        onSelect: (modal: Modals) => void,
    }
) {
    return <Modal isOpen={isOpen} onClose={onClose} title="settings">
        {[Modals.SLIPPI, Modals.OBS, Modals.STARTGG, Modals.CUSTOMIZATION].map(
            modal => <>
                <BigButton onClick={() => onSelect(modal)}>{modal} settings</BigButton>
                <br />
            </>
        )}
    </Modal>
}
