import { useEffect, useState } from "react";
import { Commentator, StartggPlayer } from "../types/boof";
import StartggPlayerName from "./StartggPlayerName";

export default function CommentatorInfo(
    { value, sggPlayers, onChange, onRemove }: { 
        value: Commentator, 
        sggPlayers: StartggPlayer[],
        onChange: (c: Commentator) => void 
        onRemove: () => void,
    },
) {
    const id = value.id;
    const [sponsor, setSponsor] = useState(value.sponsor || "");
    const [name, setName] = useState(value.name || "");
    const [twitter, setTwitter] = useState(value.twitter || "");
    const [pronouns, setPronouns] = useState(value.pronouns || "");

    function onAutofillChoice(p: StartggPlayer) {
        setSponsor(p.player.sponsor);
        setName(p.player.name);
        setTwitter(p.player.twitter);
        setPronouns(p.player.pronouns);
    }

    useEffect(() => onChange({ id, sponsor, name, twitter, pronouns }), [id, sponsor, name, twitter, pronouns]);

    return <>
        <hr style={{ marginTop: 8, marginBottom: 8 }} />
        commentator {id}<br />
        sponsor: <input value={sponsor} onChange={e => setSponsor(e.target.value)} /><br />
        <StartggPlayerName value={name} onChange={setName} onAutofillChoice={onAutofillChoice} sggPlayers={sggPlayers} /><br />
        twitter: <input value={twitter} onChange={e => setTwitter(e.target.value)} /><br />
        pronouns: <input value={pronouns} onChange={e => setPronouns(e.target.value)} /><br />
        <button onClick={() => onRemove()}>remove</button>
    </>
}
