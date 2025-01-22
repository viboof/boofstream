import { useState } from "react";
import BigButton from "../BigButton";
import Modal from "../Modal";

export default function SubConfigModal(
    { children, title, isOpen, onBack, onSave }:
    React.PropsWithChildren<{
        title: string,
        isOpen: boolean,
        onBack: () => void,
        onSave: () => void,
    }>
) {
    const [saved, setSaved] = useState(false);

    function save() {
        onSave();
        setSaved(true);
        setTimeout(() => setSaved(false), 500);
    }

    return <Modal 
        title={title} 
        isOpen={isOpen} 
        onClose={onBack}
        closeText="back"
    >
        {children}
        <br />
        <hr style={{ marginTop: 8, marginBottom: 8 }} />
        <BigButton onClick={save} disabled={saved}>{saved ? "saved!" : "save"}</BigButton>
    </Modal>
}
