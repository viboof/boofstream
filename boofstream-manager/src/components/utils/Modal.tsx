import Boof from "@/assets/boof.png";
import Image from "next/image";
import ReactModal from "react-modal";
import BigButton from "../forms/BigButton";
import Hr from "./Hr";
import BoofTitle from "./BoofTitle";

export default function Modal(
    { isOpen, children, title, onClose, closeText = "close" }: React.PropsWithChildren<{ 
        isOpen: boolean,
        title: string,
        onClose: () => void,
        closeText?: string,
    }>) {
    const style = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            maxHeight: "75%",
            fontFamily: "sans-serif",
        }
    };

    return <ReactModal isOpen={isOpen} style={style}>
        <BoofTitle sizePx={32}>{title}</BoofTitle>{" "}
        <BigButton onClick={onClose}>{closeText}</BigButton>
        <Hr />
        {children}
        <Hr />
    </ReactModal>
}
