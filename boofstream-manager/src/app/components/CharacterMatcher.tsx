import { useState } from "react";
import { Character, CharacterColor, Player } from "../types/boof";
import { getBackendHost, getCharacterAssetName } from "../utils";

export function CharacterMatcher(
    props: {
        character1: Character,
        character2: Character,
        color1: CharacterColor,
        color2: CharacterColor,
        player1: Player,
        player2: Player,
        onMatch: (player1IsPort1: boolean) => void,
    }
) {
    const [character1Player, setCharacter1Player] = useState(1);
    const [character2Player, setCharacter2Player] = useState(2);

    function onChange(p1: boolean, number: string) {
        const p1IsPlayer1 = (p1 && number === "1") || (!p1 && number === "2");

        setCharacter1Player(p1IsPlayer1 ? 1 : 2);
        setCharacter2Player(p1IsPlayer1 ? 2 : 1);
    }

    function getSelect(p1: boolean) {
        return <>
            <img 
                src={
                    getBackendHost() + 
                        "assets/" + 
                        getCharacterAssetName(
                            p1 ? props.character1 : props.character2, 
                            p1 ? props.color1 : props.color2,
                        )
                    } 
                width={24}
            />{" "}
            <select 
                value={p1 ? character1Player : character2Player} 
                onChange={e => onChange(p1, e.target.value)}
            >
                <option value="1">{props.player1.name}</option>
                <option value="2">{props.player2.name}</option>
            </select>
        </>
    }

    return <>
    who is who?<br />
    <br />
    {getSelect(true)}<br />
    {getSelect(false)}<br />
    <button onClick={() => props.onMatch(character1Player === 1)}>submit</button>
    </>
}