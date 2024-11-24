import { Player, StartggPlayer } from "@/app/types/boof";
import BigInput from "./BigInput";
import { KeyboardEvent } from "react";

export default function PlayerSelector({ value, onChange, sggPlayers, onPlayerSelect, onBlur, onKeyDown }: {
    value: string,
    sggPlayers: StartggPlayer[],
    onChange: (name: string) => void,
    onPlayerSelect: (player: Player) => void,
    onBlur: () => void,
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void,
}) {
    let suggestions = sggPlayers
        .filter(player => player.player.name.toLowerCase().startsWith(value.toLowerCase()));

    if (!value.trim()) {
        suggestions = [];
    }

    return <>
        <BigInput 
            style={{ maxWidth: "256px" }} 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            onBlur={onBlur}
            onKeyDown={onKeyDown}
        />
        {suggestions.map(p => <>
            <br />
            <a href="#" onClick={e => {
                e.preventDefault();
                onPlayerSelect(p.player);
            }} style={{ textDecoration: "underline" }}>
                {p.player.name} ({p.entrantId})
            </a>
        </>)}
    </>
}
