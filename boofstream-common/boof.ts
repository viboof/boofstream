type BoofState = {
    tournament: Tournament,
    player1: Player,
    player2: Player,
    commentators: Commentator[],
    tournamentUrl: string,
    activeSet?: BoofSet,
    lastPlayer1Score: number,
    lastPlayer2Score: number,
    slippi?: Slippi,
    slippiConnected: boolean,
    doObsSwitch: boolean,
    started: boolean,
}

type Slippi = {
    port1: number,
    port2: number,
    character1: Character,
    character2: Character,
    characterColor1: CharacterColor,
    characterColor2: CharacterColor,
    player1IsPort1?: boolean,
};

type Tournament = {
    name: string,
    match: string,
    phase: string,
    bestOf: number,
}

type Player = {
    score: number,
    sponsor: string,
    name: string,
    losers: boolean,
    pronouns: string,
    twitter: string,
    country: string,
    state: string,
    character?: Character,
    characterColor?: CharacterColor,
    seed: number,
}

type StartggPlayer = {
    entrantId: number,
    player: Player,
}

type Commentator = {
    id: number,
    sponsor: string,
    name: string,
    pronouns: string,
    twitter: string,
}

type BoofSet = {
    id: string | number,
    player1Id: number,
    player2Id: number,
    round: string,
    phase: string,
    completed: boolean,
}

enum Character {
    CAPTAIN_FALCON = 0,
    DONKEY_KONG = 1,
    FOX = 2,
    MR_GAME_AND_WATCH = 3,
    KIRBY = 4,
    BOWSER = 5,
    LINK = 6,
    LUIGI = 7,
    MARIO = 8,
    MARTH = 9,
    MEWTWO = 10,
    NESS = 11,
    PEACH = 12,
    PIKACHU = 13,
    ICE_CLIMBERS = 14,
    JIGGLYPUFF = 15,
    SAMUS = 16,
    YOSHI = 17,
    ZELDA = 18,
    SHEIK = 19,
    FALCO = 20,
    YOUNG_LINK = 21,
    DR_MARIO = 22,
    ROY = 23,
    PICHU = 24,
    GANONDORF = 25,
}


enum CharacterColor {
    DEFAULT,
    BLACK,
    RED,
    WHITE,
    GREEN,
    BLUE,
    ORANGE,
    YELLOW,
    PINK,
    PURPLE,
    CYAN,
    PEACH_DAISY,
}

const CHARACTER_COLORS = {
    [Character.CAPTAIN_FALCON]: [
        CharacterColor.BLACK, 
        CharacterColor.RED, 
        CharacterColor.WHITE, 
        CharacterColor.GREEN,
        CharacterColor.BLUE
    ],
    [Character.DONKEY_KONG]: [CharacterColor.BLACK, CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.FOX]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.MR_GAME_AND_WATCH]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.KIRBY]: [
        CharacterColor.YELLOW,
        CharacterColor.BLUE,
        CharacterColor.RED,
        CharacterColor.GREEN,
        CharacterColor.WHITE
    ],
    [Character.BOWSER]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.BLACK],
    [Character.LINK]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.BLACK, CharacterColor.WHITE],
    [Character.LUIGI]: [CharacterColor.WHITE, CharacterColor.BLUE, CharacterColor.RED],
    [Character.MARIO]: [CharacterColor.YELLOW, CharacterColor.BLACK, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.MARTH]: [CharacterColor.RED, CharacterColor.GREEN, CharacterColor.BLACK, CharacterColor.WHITE],
    [Character.MEWTWO]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.NESS]: [CharacterColor.YELLOW, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.PEACH]: [CharacterColor.PEACH_DAISY, CharacterColor.WHITE, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.PIKACHU]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.ICE_CLIMBERS]: [CharacterColor.GREEN, CharacterColor.ORANGE, CharacterColor.RED],
    [Character.JIGGLYPUFF]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN, CharacterColor.YELLOW],
    [Character.SAMUS]: [CharacterColor.PINK, CharacterColor.BLACK, CharacterColor.GREEN, CharacterColor.PURPLE],
    [Character.YOSHI]: [
        CharacterColor.RED, 
        CharacterColor.BLUE, 
        CharacterColor.YELLOW, 
        CharacterColor.PINK, 
        CharacterColor.CYAN,
    ],
    [Character.ZELDA]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN, CharacterColor.WHITE],
    [Character.SHEIK]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN, CharacterColor.WHITE],
    [Character.FALCO]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.YOUNG_LINK]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.WHITE, CharacterColor.BLACK],
    [Character.DR_MARIO]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN, CharacterColor.BLACK],
    [Character.ROY]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN, CharacterColor.YELLOW],
    [Character.PICHU]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN],
    [Character.GANONDORF]: [CharacterColor.RED, CharacterColor.BLUE, CharacterColor.GREEN, CharacterColor.PURPLE],
}

export type { BoofState, Player, Tournament, Commentator, StartggPlayer, BoofSet, Slippi };
export { Character, CharacterColor, CHARACTER_COLORS };
