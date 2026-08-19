import Image from "next/image";
import Boof from "@/assets/boof.png";

export default function BoofTitle(props: React.PropsWithChildren<{ sizePx: number }>) {
    return <>
        <Image style={{ verticalAlign: "middle", height: props.sizePx, width: props.sizePx }} src={Boof} alt="boof logo" />{" "}
        <h1 style={{ display: "inline", fontSize: props.sizePx, verticalAlign: "middle" }}>{ props.children }</h1>
    </>
}
