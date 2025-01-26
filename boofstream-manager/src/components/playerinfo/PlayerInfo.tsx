import { CharacterColor, Player, StartggPlayer } from "boofstream-common";
import BigInput from "@/components/forms/BigInput";
import CharacterColorSelector from "./CharacterColorSelector";
import CharacterSelector from "./CharacterSelector";
import CountrySelector from "./CountrySelector";
import PlayerSelector from "./PlayerSelector";
import Score from "./Score";
import { StateSelector } from "./StateSelector";
import { KeyboardEvent } from "react";

export default function PlayerInfo({ player, isPlayer1, sggPlayers, onChange, onSave }: { 
    player: Player, 
    isPlayer1: boolean,
    sggPlayers: StartggPlayer[],
    onChange: (value: Player) => void,
    onSave: (value: Player) => void,
}) {
    const color = isPlayer1 ? "red" : "blue";

    function onChangeAndSave(newValue: Player) {
        onChange(newValue);
        onSave(newValue);
    }

    function saveIfEnter(e: KeyboardEvent<HTMLInputElement>) {
        console.log(e.key);
        if (e.key === "Enter") {
            onSave(player);
        }
    }

    return <>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
        <div>
            <center>
                <BigInput 
                    value={player.sponsor} 
                    onChange={e => onChange({ ...player, sponsor: e.target.value })}
                    style={{ maxWidth: "128px", color }} 
                    onKeyDown={saveIfEnter}
                    onBlur={() => onSave(player)}
                />
                <PlayerSelector 
                    value={player.name} 
                    sggPlayers={sggPlayers}
                    onChange={name => onChange({ ...player, name })}
                    onKeyDown={saveIfEnter}
                    onBlur={() => onSave(player)}
                    onPlayerSelect={onChangeAndSave}
                /> <input 
                    type="checkbox" 
                    checked={player.losers} 
                    onChange={e => onChangeAndSave({ ...player, losers: e.target.checked })}
                /> [L]
            </center>
        </div>
        <div>
            <center>
                <Score value={player.score} onChange={score => onChangeAndSave({ ...player, score })} />
            </center>
        </div>
        <div style={{ display: "block" }}>
            pronouns:<br /><BigInput 
                style={{ width: "100%" }}
                value={player.pronouns} 
                onChange={e => onChange({ ...player, pronouns: e.target.value })}
                onKeyDown={saveIfEnter}
                onBlur={() => onSave(player)}
            /><br />
            twitter:<br /><BigInput 
                style={{ width: "100%" }}
                value={player.twitter} 
                onChange={e => onChange({ ...player, twitter: e.target.value })}
                onKeyDown={saveIfEnter}
                onBlur={() => onSave(player)}
            /><br />
            seed:<br /><BigInput
                type="number"
                style={{ width: "100%" }}
                value={player.seed}
                onChange={e => onChange({ ...player, seed: e.target.valueAsNumber })}
                onKeyDown={saveIfEnter}
                onBlur={() => onSave(player)}
            /><br />
            character: <CharacterSelector
                value={player.character} 
                onChange={c => onChangeAndSave({ 
                    ...player, 
                    character: c, 
                    characterColor: c === undefined ? undefined : CharacterColor.DEFAULT 
                })} 
            />
            color: <CharacterColorSelector
                character={player.character}
                value={player.characterColor}
                onChange={c => onChangeAndSave({...player, characterColor: c })}
            />
            country: <CountrySelector
                value={player.country}
                onChange={country => onChangeAndSave({ ...player, country, state: "" })}
            />
            state: <StateSelector
                value={player.state}
                country={player.country}
                onChange={state => onChangeAndSave({ ...player, state })}
            />
        </div>
        </div>
        <br />
    </>
}
