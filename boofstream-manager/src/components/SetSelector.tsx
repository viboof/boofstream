import { BoofSet, StartggPlayer } from "@/app/types/boof";
import { useState } from "react";
import SetInfo from "./SetInfo";

export default function SetSelector(props: { 
    sets: BoofSet[], 
    onSelect: (set: BoofSet) => void, 
    playerMap: Map<number, StartggPlayer>,
}) {
    const [showCompleted, setShowCompleted] = useState(false);

    return <div style={{ marginTop: 16 }}>
        <span>
            <h1>select set</h1>
            show completed sets?{" "}
            <input 
                type="checkbox"
                checked={showCompleted} 
                onChange={e => setShowCompleted(e.target.checked)}
            />
            <hr />
            {
                props.sets
                    .filter(set => showCompleted || !set.completed)
                    .map(set => <SetInfo 
                        set={set} 
                        playerMap={props.playerMap} 
                        onClick={() => props.onSelect(set)} 
                    />)
                }
        </span>
    </div>;
}

// function getSetList() {
//     if (!sggPlayers.length) return;

//     console.log("sets:", sets);

//     const playerMap = computePlayerMap();

//     console.log(playerMap);

//     let out = [];

//     for (const set of sets.filter(s => showCompleted || !s.completed)) {
//         console.log(set);

//         const p1 = playerMap.get(set.player1Id)!!.player.name;
//         const p2 = playerMap.get(set.player2Id)!!.player.name;
//         out.push(<><a href="#" key={set.id} style={{fontSize: 12}} onClick={e => {
//             e.preventDefault();
//             loadSet(set);
//         }}>- {p1} v. {p2} - {set.round}</a><br /></>)
//     }

//     return <div>{out}</div>;
// }