import { BoofSet, StartggPlayer } from "@/app/types/boof";

export default function SetInfo(props: { 
    set: BoofSet, 
    onClick: () => void, 
    playerMap: Map<number, StartggPlayer>,
}) {
    function name(entrantId: number): string {
        return props.playerMap.get(entrantId)!!.player.name;
    }

    return <center>
        <a href="#" onClick={e => { e.preventDefault(); props.onClick() }} style={{ display: "block", textDecoration: "underline" }}>
            {name(props.set.player1Id)} v. {name(props.set.player2Id)} - {props.set.round}
        </a>
    </center>
}
