"use client";

import { Character, CharacterColor } from "boofstream-common";
import { getCharacterAssetName } from "@/utils";
import Asset from "./Asset";
import { CSSProperties } from "react";

export default function CharacterAsset(props: { 
    character: Character, 
    color: CharacterColor,
    heightPx?: number,
    style?: CSSProperties
}) {
    return <>
        <Asset 
            path={getCharacterAssetName(props.character, props.color)} 
            heightPx={props.heightPx}
            style={props.style} 
        />
    </>
}
