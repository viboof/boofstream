import { BoofSet, StartggPlayer } from "boofstream-common";
import SetInfo from "./SetInfo";

export default function SetSelector(props: { 
    sets: BoofSet[], 
    onSelect: (set: BoofSet) => void,
    playerMap: Map<number, StartggPlayer>,
    showCompleted: boolean,
    onChangeShowCompleted: (showCompleted: boolean) => void,
}) {
    return <div>
        <span>
            <center>show completed sets?{" "}
            <input 
                type="checkbox"
                checked={props.showCompleted} 
                onChange={e => props.onChangeShowCompleted(e.target.checked)}
            /></center>
            <table>
                <thead>
                    <tr>
                    <th>player 1</th>
                    <th>player 2</th>
                    <th>match</th>
                    </tr>
                </thead>
                <tbody>
                {
                props.sets
                    .filter(set => props.showCompleted || !set.completed)
                    .map(set => <SetInfo 
                        set={set} 
                        playerMap={props.playerMap} 
                        onClick={() => props.onSelect(set)} 
                    />)
                }
                </tbody>
            </table>
        </span>
    </div>;
}
