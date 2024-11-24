![screenshot of boofstream](https://github.com/user-attachments/assets/4c7da4ec-f7f5-4f72-9392-92a1a72b11cf)

# boofstream
boofstream is a simple streaming tool created by viboof originally for use in
the [Munchie Bar Melee Extravaganza](https://start.gg/mbme) (RIP) broadcasts,
and is now in use in various random viboof-produced tournaments.

## layouts
boofstream is (somewhat) compatible with TournamentStreamHelper layouts (tested
on `scoreboard_4by3/melee_cameras` and commentator views).  since TSH has no
license, i'm not comfortable providing those layouts here.  but, if you were to
copy a layout from TSH into the `layouts` folder and import it into OBS as
normal, it would probably maybe work.  make sure to also copy `main.css`,
`settings.json`, and the `include` directory if you do this.

## how to
boofstream is designed for advanced users.  if any of these instructions are
confusing to you, uh, sorry.

1. clone the repo
1. `npm i` in `boofstream` and `boofstream-manager`
1. copy `boofstream/config.example.json` to `boofstream/config.json` and
   replace `YOUR_TOKEN_HERE`. with 
   [your start.gg token](https://start.gg/admin/profile/developer)
1. `npx tsx index.ts` in `boofstream`
1. `npm run dev` (yes dev lol) in `boofstream-manager`

## why not TSH?
in my experience, TournamentStreamHelper is fairly unstable on macOS, which the
Munchie Bar stream is run on (i'm no Apple fangirl, but find me a better 
graphics power/battery life/build quality/portability mix for a bar stream).  i
love the software though, and take great inspiration from it.  i also intend on
have some cool functionality involving realtime stuff with Slippi console 
mirroring, so it's nice to have total control over and familiarity with the
codebase.

## why does it suck?
i am not a frontend developer and am generally implementing things in whichever
way is fastest for me.  i am designing this software to be used exclusively by
me in the tournaments i run, but open-sourcing it for any brave soul who might
find it useful.  i am building this in my free time for a broadcast i do not
get paid for because i just love this shit.

## thanks
- huge thanks to the talented 
[Vince Au](https://github.com/vinceau) for maintaining
[slippi-js](https://github.com/project-slippi/slippi-js) and
[slp-realtime](https://github.com/vinceau/slp-realtime), without either of
which this project would've been impossible, as well as providing me with
direct support for some 
[internals weirdness](https://github.com/viboof/boofstream/commit/1b33df4b47f5cf7fea0b5e2aa489ec60f77097ce).
- thank you to DOOB for giving me a chance running the Munchie Bar stream as a newcomer
- gracias to [João Ribeiro Bezerra](https://github.com/joaorb64) for creating
[TournamentStreamHelper](https://github.com/joaorb64/TournamentStreamHelper),
which i used extensively prior to developing boofstream, and whose layouts i
still use
- danke to everyone who watches the streams i produce :)
- oregon melee 🗣️
