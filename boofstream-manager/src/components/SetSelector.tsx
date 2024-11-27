import { BoofSet, StartggPlayer } from "@/app/types/boof";
import { useState } from "react";
import SetInfo from "./SetInfo";

export default function SetSelector(props: { 
    sets: BoofSet[], 
    onSelect: (set: BoofSet) => void, 
    playerMap: Map<number, StartggPlayer>,
}) {
    const [showCompleted, setShowCompleted] = useState(false);

    return <div>
        <span>
            <center>show completed sets?{" "}
            <input 
                type="checkbox"
                checked={showCompleted} 
                onChange={e => setShowCompleted(e.target.checked)}
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
                    .filter(set => showCompleted || !set.completed)
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
