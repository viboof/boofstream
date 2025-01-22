import { exec } from "child_process";
import fs from "fs";
import os from "os";
import { exit } from "process";
import semver from "semver";
import unzipper from "unzipper";
import yesno from "yesno";

const version = semver.clean(fs.readFileSync("version.txt").toString("utf-8"))!!;
const osarch = fs.readFileSync("osarch.txt").toString("utf-8");

async function main() {
    console.log(`Checking for updates... (Currently ${version} on ${osarch})`);

    let releases;

    try {
        const releasesRes = await fetch("https://api.github.com/repos/viboof/boofstream/releases");
        releases = await releasesRes.json();
    } catch {
        console.log("Could not check GitHub for updates. Starting boofstream...");
        startBoofstream();
        return;
    }

    let highestRelease = null;
    let highestVersion = version;

    for (const release of releases) {
        const releaseVersion = semver.clean(release.name)!!;

        if (semver.gt(releaseVersion, highestVersion)) {
            highestRelease = release;
            highestVersion = version;
        }
    }

    if (!highestRelease) return;

    console.log(`New release found: ${highestVersion}.`);
    console.log("Would you like to update now?");
    console.log("This process will take a few minutes and need up to 750MB of storage.");
    console.log("Your existing data will be preserved. Layouts are not updated.");

    const shouldUpdate = await yesno({ question: "Do you wish to update now?" });

    if (!shouldUpdate) {
        console.log("OK, starting boofstream without updating.");
        startBoofstream();
        return;
    }

    updateBoofstream(highestRelease);
}

let shouldUpdateFile = (_: string) => false;

async function updateBoofstream(release: any) {
    const sep = osarch.startsWith("win") ? "\\" : "/";
    const workdir = os.tmpdir() + sep + "boofstream-" + new Date().getTime();
    fs.mkdirSync(workdir);

    console.log("The workdir is", workdir, "if something goes wrong, you can delete this.");
    console.log("Backing everything up to the 'backup' directory.");
    console.log("If something goes wrong, your old setup will still be there.");

    fs.cpSync("*", "backup");

    const zipPath = await downloadReleaseZip(release, workdir, sep);

    const directory = await unzipper.Open.file(zipPath);

    // load new definition
    eval(fs.readFileSync("dist/shouldUpdateFile.js").toString("utf-8"));

    for (const file of directory.files) {
        if (shouldUpdateFile(file.path)) {
            console.log("Writing " + file.path + "...");
            file.stream().pipe(fs.createWriteStream(file.path));
        } else {
            console.log("Skipping " + file.path);
        }
    }

    console.log("Cleaning up work directory...");
    fs.rmSync(workdir);

    console.log("boofstream updated succesfully :) Starting now.");
}

async function downloadReleaseZip(release: any, workdir: string, sep: string) {
    let url = "";

    console.log("Searching for release artifact matching", release.version, osarch);

    for (const asset of release.assets) {
        if (asset.name.includes(osarch)) {
            url = asset.browser_download_url;
            break;
        }
    }

    if (!url) {
        console.log("Could not find a suitable release artifact.");
        console.log("Your OS may no longer be supported, or there may be an issue with the release.");
        console.log("Try again another time.");
        exit(1);
    }

    console.log("Downloading " + url + "...  This may take a little while");

    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const path = workdir + sep + "boofstream.zip";

    fs.writeFileSync(path, new Uint8Array(buffer));

    return path;
}

function startBoofstream() {
    exec(osarch.startsWith("win") ? ".\\dist\\boofstream.exe" : "./dist/boofstream");
}

main().then();
