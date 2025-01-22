import { Tournament } from "boofstream-common";
import { KeyboardEvent } from "react";


export default function TournamentInfo({ value, onChange, onSave }: { 
    value: Tournament, 
    onChange: (value: Tournament) => void,
    onSave: (value: Tournament) => void,
}) {
    function saveIfEnter(e: KeyboardEvent<HTMLInputElement>) {
        console.log(e.key);
        if (e.key === "Enter") {
            onSave(value);
        }
    }

    return <div>
        <div>
            tournament name: <input 
                value={value.name} 
                onChange={e => onChange({ ...value, name: e.target.value })}
                onKeyDown={saveIfEnter}
                onBlur={() => onSave(value)}
            />
        </div>
        <div>
            match: <input 
                value={value.match} 
                onChange={e => onChange({ ...value, match: e.target.value })} 
                onKeyDown={saveIfEnter}
                onBlur={() => onSave(value)}
            />
        </div>
        <div>
            phase: <input 
                value={value.phase} 
                onChange={e => onChange({ ...value, phase: e.target.value })} 
                onKeyDown={saveIfEnter}
                onBlur={() => onSave(value)}
            />
        </div>
        <div>
            best of: <input 
                type="number"
                value={value.bestOf} 
                onChange={e => onChange({ ...value, bestOf: e.target.valueAsNumber })} 
                onKeyDown={saveIfEnter}
                onBlur={() => onSave(value)}
            />
        </div>
    </div>
}
