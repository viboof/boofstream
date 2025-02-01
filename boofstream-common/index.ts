type BoofState = {
    // --- game state ---
    tournament: Tournament,
    player1: Player,
    player2: Player,
    commentators: Commentator[],
    activeSet?: BoofSet,
    lastPlayer1Score: number,
    lastPlayer2Score: number,
    started: boolean,
    // --- slippi ---
    slippi?: Slippi,
    slippiConnected: boolean,
    obsConnected: boolean,
}

type BoofConfig = {
    slippi: SlippiConfig,
    obs: OBSConfig,
    startgg: StartGGConfig,
    customization: CustomizationConfig,
};

type SlippiConfig = {
    port: number,
};

type OBSConfig = {
    doSwitch: boolean,
    host: string,
    password: string,
    noGameScene: string,
    gameScene: string,
};

type StartGGConfig = {
    token: string,
    tournamentUrl: string,
};

type CustomizationConfig = {
    appendLToLosers: boolean,
    player1Color: string,
    player2Color: string,
};

type Slippi = {
    port1: number,
    port2: number,
    character1: Character,
    character2: Character,
    characterColor1: CharacterColor,
    characterColor2: CharacterColor,
    stocksRemaining1: number,
    stocksRemaining2: number,
    player1IsPort1?: boolean,
    gameResults: GameResult[],
    gameStartTimeUnix?: number,
    stage?: MeleeStage,
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

enum MeleeStage {
    FOUNTAIN_OF_DREAMS = 2,
    POKEMON_STADIUM = 3,
    PEACHS_CASTLE = 4,
    KONGO_JUNGLE = 5,
    BRINSTAR = 6,
    CORNERIA = 7,
    YOSHIS_STORY = 8,
    ONETT = 9,
    MUTE_CITY = 10,
    RAINBOW_CRUISE = 11,
    JUNGLE_JAPES = 12,
    GREAT_BAY = 13,
    HYRULE_TEMPLE = 14,
    BRINSTAR_DEPTHS = 15,
    YOSHIS_ISLAND = 16,
    GREEN_GREENS = 17,
    FOURSIDE = 18,
    MUSHROOM_KINGDOM = 19,
    MUSHROOM_KINGDOM_2 = 20,
    VENOM = 22,
    POKE_FLOATS = 23,
    BIG_BLUE = 24,
    ICICLE_MOUNTAIN = 25,
    ICETOP = 26,
    FLAT_ZONE = 27,
    DREAMLAND = 28,
    YOSHIS_ISLAND_N64 = 29,
    KONGO_JUNGLE_N64 = 30,
    BATTLEFIELD = 31,
    FINAL_DESTINATION = 32,
    OTHER = -1,
}

const TOURNAMENT_LEGAL_STAGES = [
    MeleeStage.YOSHIS_STORY,
    MeleeStage.FOUNTAIN_OF_DREAMS,
    MeleeStage.BATTLEFIELD,
    MeleeStage.FINAL_DESTINATION,
    MeleeStage.DREAMLAND,
    MeleeStage.POKEMON_STADIUM
];

const STAGE_NAMES = {
    [MeleeStage.FOUNTAIN_OF_DREAMS]: "Fountain of Dreams",
    [MeleeStage.POKEMON_STADIUM]: "Pokémon Stadium",
    [MeleeStage.PEACHS_CASTLE]: "Princess Peach's Castle",
    [MeleeStage.KONGO_JUNGLE]: "Kongo Jungle",
    [MeleeStage.BRINSTAR]: "Brinstar",
    [MeleeStage.CORNERIA]: "Corneria",
    [MeleeStage.YOSHIS_STORY]: "Yoshi's Story",
    [MeleeStage.ONETT]: "Onett",
    [MeleeStage.MUTE_CITY]: "Mute City",
    [MeleeStage.RAINBOW_CRUISE]: "Rainbow Cruise",
    [MeleeStage.JUNGLE_JAPES]: "Jungle Japes",
    [MeleeStage.GREAT_BAY]: "Great Bay",
    [MeleeStage.HYRULE_TEMPLE]: "Hyrule Temple",
    [MeleeStage.BRINSTAR_DEPTHS]: "Brinstar Depths",
    [MeleeStage.YOSHIS_ISLAND]: "Yoshi's Island",
    [MeleeStage.GREEN_GREENS]: "Green Greens",
    [MeleeStage.FOURSIDE]: "Foourside",
    [MeleeStage.MUSHROOM_KINGDOM]: "Mushroom Kingdom I",
    [MeleeStage.MUSHROOM_KINGDOM_2]: "Mushroom Kingdom II",
    [MeleeStage.VENOM]: "Venom",
    [MeleeStage.POKE_FLOATS]: "Poké Floats",
    [MeleeStage.BIG_BLUE]: "Big Blue",
    [MeleeStage.ICICLE_MOUNTAIN]: "Icicle Mountain",
    [MeleeStage.ICETOP]: "Icetop",
    [MeleeStage.FLAT_ZONE]: "Flat Zone",
    [MeleeStage.DREAMLAND]: "Dream Land N64",
    [MeleeStage.YOSHIS_ISLAND_N64]: "Yoshi's Island N64",
    [MeleeStage.KONGO_JUNGLE_N64]: "Kongo Jungle N64",
    [MeleeStage.BATTLEFIELD]: "Battlefield",
    [MeleeStage.FINAL_DESTINATION]: "Final Destination",
    [MeleeStage.OTHER]: "Other",
}

type GameResult = {
    stage: MeleeStage,
    stocksRemaining: number,
    durationSeconds: number,
    player1IsWinner: boolean,
    player1Character: Character,
    player2Character: Character,
    index: number,
};

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

export type { 
    BoofConfig, 
    SlippiConfig, 
    StartGGConfig,
    OBSConfig, 
    CustomizationConfig, 
    BoofState, 
    Player, 
    Tournament, 
    Commentator, 
    StartggPlayer, 
    BoofSet, 
    Slippi,
    GameResult,
};
export { Character, CharacterColor, MeleeStage, CHARACTER_COLORS, STAGE_NAMES };
