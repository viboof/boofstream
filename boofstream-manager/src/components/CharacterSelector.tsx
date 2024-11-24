"use client";

import { Character, CharacterColor } from "@/app/types/boof";
import { useState } from "react";
import BoofSelect, { ValueObj } from "./BoofSelect";
import CharacterAsset from "./CharacterAsset";

export default function CharacterSelector(props: { value?: Character, onChange?: (value?: Character) => void }) {
    function label(character: Character) {
        return <>
            <CharacterAsset character={character} color={CharacterColor.DEFAULT} />{" "}
            {Character[character]}
        </>
    }

    const options: ValueObj<Character>[] = Object.keys(Character)
        // fucking fuck typescript
        .filter(c => c.match(/[A-z]+/))
        // @ts-ignore killing myself
        .map(c => Character[c])
        .map(c => ({ value: c, label: label(c) }));

    function onChange(value?: Character) {
        if (props.onChange) props.onChange(value);
    }

    return <BoofSelect value={props.value} options={options} onChange={onChange} />;
}
