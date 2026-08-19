import { Character, CHARACTER_COLORS, CharacterColor } from "boofstream-common";

export function getBackendHost() {
    if (location.port === "3000") {
        return "http://localhost:1337/";
    }
    return `http://${location.hostname}:${location.port}/`;
}

export function getSocketHost() {
    if (location.port === "3000") {
        return "http://localhost:1338/";
    }
    return `http://${location.hostname}:${Number(location.port) + 1}/`
}

export function getCharacterAssetName(character: Character, color: CharacterColor) {
    //console.log("getCharacterAssetName", character, color);
    
    const colorNum = color === CharacterColor.DEFAULT
        ? 0
        : CHARACTER_COLORS[character].indexOf(color) + 1

    const number = colorNum < 10 ? "0" + colorNum : "" + colorNum;

    return `characters/chara_2_${Character[character].toLowerCase()}_${number}.png`;
}
