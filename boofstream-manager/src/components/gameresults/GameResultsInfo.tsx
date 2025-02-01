import { GameResult, Player } from "boofstream-common";
import GameResultInfo from "./GameResultInfo";

export default function GameResultsInfo(
    { value, player1, player2, onChange }:
    {
        value: GameResult[],
        player1: Player,
        player2: Player,
        onChange: (results: GameResult[], removedResult?: GameResult) => void,
    }
) {
    return <>
        { value.length ? <>
            <h2>games</h2>
            <p>games before "start set" was clicked will not be shown</p>
        </> : "" }
        { value.map(result => <GameResultInfo
            key={result.index}
            result={result}
            player1={player1}
            player2={player2}
            onDelete={() => onChange(value.filter(r => r.index !== result.index), result)}
        />) }
    </>
}
