import { GameResult, Character, CharacterColor, Player, STAGE_NAMES } from "boofstream-common";
import CharacterAsset from "../CharacterAsset";
import { useState } from "react";

export default function GameResultInfo(
    { result, player1, player2, onDelete }:
    {
        result: GameResult,
        player1: Player,
        player2: Player,
        onDelete: () => void,
    },
) {
    const [isDelete, setIsDelete] = useState(false);

    const seconds = result.durationSeconds % 60;
    const minutes = (result.durationSeconds - seconds) / 60;

    console.log(result.player1IsWinner);

    // p1winner, p1 -> winner
    // p1winner, !p1 -> loser
    // !p1winner, p1 -> loser
    // !p1winner, !p1 -> winner
    const isWinner = (p1: boolean) => result.player1IsWinner === p1;
    const color = (p1: boolean) => isWinner(p1) ? "green" : "red";
    const symbol = (p1: boolean) => isWinner(p1) ? "✓" : "✖";
    const stocks = (p1: boolean) => isWinner(p1) ? result.stocksRemaining : 0;

    return <div>
        {/* <button style={{ width: 16 }}>↑</button>
        {" "}
        <button style={{ width: 16 }}>↓</button>
        {" "} */}
        {isDelete
            ? <>
                <button onClick={() => onDelete()}>confirm</button>
                /
                <button onClick={() => setIsDelete(false)}>cancel</button>
            </>
            : <button onClick={() => setIsDelete(true)}>delete</button>
        }
        {/* {" "}
        <button>edit</button> */}
        <span> {minutes}m{seconds}s </span>
        <CharacterAsset character={result.player1Character} color={CharacterColor.DEFAULT} />
        <strong> {player1.name} </strong>
        <strong style={{ color: color(true) }}>{stocks(true)} {symbol(true)}</strong>
        <span> v. </span>
        <strong style={{ color: color(false) }}>{symbol(false)} {stocks(false)}</strong>
        <strong> {player2.name} </strong>
        <CharacterAsset character={result.player2Character} color={CharacterColor.GREEN} />
        <i> ({STAGE_NAMES[result.stage]})</i>
    </div>
}
