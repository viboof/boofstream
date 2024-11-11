import { useEffect, useState } from "react";
import Select from "react-select";
import { Character, CHARACTER_COLORS, CharacterColor, Player, StartggPlayer } from "../types/boof";
import StartggPlayerName from "./StartggPlayerName";
import { getBackendHost, getCharacterAssetName } from "../utils";

const NOTHING_OPTION = { value: "", label: <></> };

function asset(name: string, path: string): JSX.Element {
    return <><img src={`${getBackendHost()}assets/${path}`} height={"12px"} /> {name}</>
};

function characterAsset(characterName: string, colorName: string): string {
    //console.log("characterAsset", characterName, colorName);
    if (!characterName || !colorName) return "";

    // @ts-ignore
    const character: Character = Character[characterName];
    // @ts-ignore
    const color: CharacterColor = CharacterColor[colorName];
    
    return getCharacterAssetName(character, color);
}

const mapCountry = (c: string) =>
    ({ value: c, label: asset(c.toUpperCase(), `country_flag/${c}.png`) });

const mapState = (c: string, s: string) => 
    ({ value: s, label: asset(s, `state_flag/${c.toUpperCase()}/${s}.png`) });

const mapCharacter = (c: string) => 
    ({ value: c, label: asset(c, characterAsset(c, "DEFAULT")) });

const mapCharacterColor = (character: string, c: string) => 
    ({ value: c, label: asset(c, characterAsset(character, c)) });

export default function PlayerInfo(props: { 
    player: number, 
    onChange: (player: Player) => void, 
    onWin: () => void,
    value: Player, 
    sggPlayers: StartggPlayer[],
}) {
    const [score, setScore] = useState(props.value.score);
    const [sponsor, setSponsor] = useState(props.value.sponsor);
    const [name, setName] = useState(props.value.name);
    const [losers, setLosers] = useState(props.value.losers);
    const [pronouns, setPronouns] = useState(props.value.pronouns);
    const [twitter, setTwitter] = useState(props.value.twitter);
    const [countries, setCountries] = useState([] as string[]);
    const [states, setStates] = useState([] as string[]);
    const [country, setCountry] = useState(
        props.value.country
            ? mapCountry(props.value.country)
            : NOTHING_OPTION,
    );
    const [state, setState] = useState(
        props.value.state
            ? mapState(props.value.country, props.value.state)
            : NOTHING_OPTION,
    );
    const [character, setCharacter] = useState(
        props.value.character || props.value.character === 0
            ? mapCharacter(Character[props.value.character])
            : NOTHING_OPTION
    );
    const [characterColor, setCharacterColor] = useState(
        !props.value.characterColor && props.value.characterColor !== 0
            ? NOTHING_OPTION
            : mapCharacterColor(
                Character[props.value.character!!], 
                CharacterColor[props.value.characterColor],
            ),
    );
    const [seed, setSeed] = useState(props.value.seed);
    const [firstRun, setFirstRun] = useState(true);
 
    useEffect(() => {
        if (firstRun) {
            setFirstRun(false);
            return;
        }
        console.log("onChange", name, character, characterColor);
        props.onChange({
            score, 
            sponsor, 
            name, 
            losers, 
            pronouns, 
            twitter, 
            country: country.value, 
            state: state.value, 
            // @ts-ignore
            character: character.value !== 0 && !character.value ? Character[character.value] : undefined, 
            // @ts-ignore
            characterColor: characterColor.value !== 0 && !characterColor.value ? CharacterColor[characterColor.value] : undefined,
            seed,
        });
    }, [score, sponsor, name, losers, pronouns, twitter, country, state, character, characterColor]);

    useEffect(() => {
        fetch("http://localhost:1337/countries")
            .then(res => res.json())
            .then(setCountries);
    }, []);

    useEffect(() => {
        if (country.value) {
            fetch(`http://localhost:1337/countries/${country.value}/states`)
                .then(res => res.json())
                .then(setStates);
        } else {
            setStates([]);
        }
    }, [country]);

    function updateCountry(country: { value: string, label: JSX.Element }) {
        setState(NOTHING_OPTION);
        setCountry(country);
    }

    function updateCharacter(character: { value: string, label: JSX.Element }) {
        if (character.value === 0 || character.value) {
            setCharacterColor({
                value: "DEFAULT",
                label: asset("DEFAULT", characterAsset(character.value, "DEFAULT"))
            });
        } else {
            setCharacterColor(NOTHING_OPTION);
        }

        setCharacter(character);
    }

    function onAutofillChoice(p: StartggPlayer) {
        setSponsor(p.player.sponsor);
        setName(p.player.name);
        setPronouns(p.player.pronouns);
        setTwitter(p.player.twitter);

        // reset to defaults
        setScore(0);
        setLosers(false);
        setCharacter(NOTHING_OPTION);
        setCharacterColor(NOTHING_OPTION);
        
        if (p.player.country) {
            setCountry(mapCountry(p.player.country));

            if (p.player.state) {
                setState(mapState(p.player.country, p.player.state));
            } else {
                setState(NOTHING_OPTION);
            }
        } else {
            setCountry(NOTHING_OPTION);
            setState(NOTHING_OPTION);
        }
    }

    return <div style={{ height: "100%" }}>
        <h1>player {props.player}</h1>
        <button 
            style={{fontSize: 24}} 
            onClick={props.onWin}
        >
                mark winner
            </button>
        <h2>score: <input type="number" value={score} onChange={e => setScore(e.target.valueAsNumber)} /></h2>
        sponsor: <input type="text" value={sponsor} onChange={e => setSponsor(e.target.value)} /><br />
        <StartggPlayerName 
            value={name} 
            onChange={setName} 
            onAutofillChoice={onAutofillChoice} 
            sggPlayers={props.sggPlayers} 
        /><br />
        losers: <input type="checkbox" checked={losers} onChange={e => setLosers(e.target.checked)} /><br />
        pronouns: <input type="text" value={pronouns} onChange={e => setPronouns(e.target.value)} /><br />
        twitter: <input type="text" value={twitter} onChange={e => setTwitter(e.target.value)} /><br />
        seed: <input type="number" value={seed} onChange={e => setSeed(e.target.valueAsNumber)} /><br />
        country: <Select value={country} className="select" onChange={c => updateCountry(c!!)} options={[
            NOTHING_OPTION,
            { value: "us", label: asset("US", "country_flag/us.png") },
            ...countries.map(mapCountry)
        ]}/>
        state: <Select value={state} className="select" onChange={s => setState(s!!)} options={[
            NOTHING_OPTION,
            ...states.map(s => mapState(country.value, s))
        ]} />
        <br />
        character: <Select value={character} onChange={c => updateCharacter(c!!)} options={[
            NOTHING_OPTION,
            ...Object
                .values(Character)
                .filter(c => typeof c === "string")
                .map(mapCharacter)
        ]} />
        character color: <Select value={characterColor} onChange={c => setCharacterColor(c!!)} options={
            !character.value 
                ? []
                : [
                    mapCharacterColor(character.value, "DEFAULT"),
                    // @ts-ignore
                    ...CHARACTER_COLORS[Character[character.value]]
                        // @ts-ignore
                        .map(c => CharacterColor[c])
                        // @ts-ignore
                        .map(c => mapCharacterColor(character.value, c))
                ]
        } />
        <br />
    </div>
}
