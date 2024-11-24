import { Character, CharacterColor, Player, Slippi } from "@/app/types/boof";
import CharacterAsset from "./CharacterAsset";

export default function PortMatcher(props: {
    player1: Player,
    slippi: Slippi,
    onChange: (player1IsPort1?: boolean) => void,
}) {
    function getOnClick(port1: boolean) {
        return (e: any) => {
            e.preventDefault();
            props.onChange(port1);
        };
    }

    function getOutline(port1: boolean): string {
        if (props.slippi.player1IsPort1 === undefined || props.slippi.player1IsPort1 === null) return "";

        if (port1 && props.slippi.player1IsPort1) return "solid";
        if (!port1 && !props.slippi.player1IsPort1) return "solid";

        return "";
    }

    return <div style={{ marginTop: "16px" }}>
        <center>
        <span>
            which character is{" "}
            {props.player1.sponsor 
                ? <span style={{ color: "red" }}>{props.player1.sponsor} </span>
                : ""
            } {props.player1.name}?
        </span><br />
        <a href="#" onClick={getOnClick(true)}><CharacterAsset 
            character={props.slippi.character1} 
            color={props.slippi.characterColor1} 
            heightPx={64}
            style={{ outline: getOutline(true), marginRight: 16 }}
        /></a>
        <a href="#" onClick={getOnClick(false)}><CharacterAsset 
            character={props.slippi.character2} 
            color={props.slippi.characterColor2}
            heightPx={64} 
            style={{ outline: getOutline(false) }}
        /></a><br />
        { props.slippi.player1IsPort1 !== undefined && props.slippi.player1IsPort1 !== null
            ? <button onClick={() => props.onChange(undefined)}>
                don't automatically update characters
            </button>
            : ""
        }
        </center>
    </div>
}