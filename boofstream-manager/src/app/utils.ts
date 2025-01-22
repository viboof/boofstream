import { Character, CHARACTER_COLORS, CharacterColor } from "boofstream-common";

export function getBackendHost() {
    return "http://" + location.hostname + ":1337/";
}

export function getSocketHost() {
    return "http://" + location.hostname + ":1338/";
}

export function getCharacterAssetName(character: Character, color: CharacterColor) {
    //console.log("getCharacterAssetName", character, color);
    
    const colorNum = color === CharacterColor.DEFAULT
        ? 0
        : CHARACTER_COLORS[character].indexOf(color) + 1

    const number = colorNum < 10 ? "0" + colorNum : "" + colorNum;

    return `characters/chara_2_${Character[character].toLowerCase()}_${number}.png`;
}
