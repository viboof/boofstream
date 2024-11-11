import { useEffect, useState } from "react";
import { StartggPlayer } from "../types/boof";

export default function StartggPlayerName(
    { value, sggPlayers, onChange, onAutofillChoice }: {
        value: string,
        sggPlayers: StartggPlayer[],
        onChange: (name: string) => void,
        onAutofillChoice: (player: StartggPlayer) => void,
    }
) {
    const [name, setName] = useState(value || "");

    useEffect(() => onChange(name), [name]);

    return <>
        name: <input value={name} onChange={e => setName(e.target.value)} />
        {!name ? '' : <>
            {sggPlayers.filter(p => p.player.name.toLowerCase().startsWith(name.toLowerCase())).map(p => <><br /><a href="#" onClick={e => {
                e.preventDefault();
                setName(p.player.name);
                onAutofillChoice(p);
            }}>- {p.player.name} ({p.entrantId})</a></>)}
        </>}
    </>
}
