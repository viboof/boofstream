import { BoofSet, StartggPlayer } from "boofstream-common";

export default function SetInfo(props: { 
    set: BoofSet, 
    onClick: () => void, 
    playerMap: Map<number, StartggPlayer>,
}) {
    function name(entrantId: number, p1: boolean) {
        const player = props.playerMap.get(entrantId)!!.player;
        return <>
            {player.sponsor ?
                <span style={{ color: p1 ? "red" : "blue" }}>{player.sponsor} </span>
                : ""
            }{player.name}
        </>;
    }

    const tdStyle = { outline: "solid", padding: 2 };

    return <>
        <tr 
            onClick={e => { e.preventDefault(); props.onClick() }} 
            style={{ cursor: "pointer", outline: "solid" }}
        >
            <td style={tdStyle}>{name(props.set.player1Id, true)}</td>
            <td style={tdStyle}>{name(props.set.player2Id, false)}</td>
            <td style={tdStyle}>{props.set.round}</td>
        </tr>
    </>
}
