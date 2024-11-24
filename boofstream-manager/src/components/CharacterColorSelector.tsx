import { Character, CHARACTER_COLORS, CharacterColor } from "@/app/types/boof";
import BoofSelect, { ValueObj } from "./BoofSelect";
import CharacterAsset from "./CharacterAsset";
import { useState } from "react";

export default function CharacterColorSelector(props: { 
    character?: Character, 
    value?: CharacterColor,
    onChange?: (value?: CharacterColor) => void,
}) {
    if (props.character === undefined) {
        return <BoofSelect value="" options={[]} />;
    }

    function label(color: CharacterColor) {
        return <>
            <CharacterAsset character={props.character!!} color={color} />{" "}
            {CharacterColor[color]}
        </>;
    }

    const options: ValueObj<CharacterColor>[] = 
        [CharacterColor.DEFAULT, ...CHARACTER_COLORS[props.character]]
            .map(c => ({ value: c, label: label(c) }));

    function onChange(newValue?: CharacterColor) {
        if (props.onChange) props.onChange(newValue);
    }

    return <BoofSelect value={props.value} options={options} onChange={onChange} />
}
