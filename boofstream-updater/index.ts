import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import { exit } from "process";
import semver from "semver";
import unzipper from "unzipper";
import yesno from "yesno";

const version = semver.clean(fs.readFileSync("dist/version.txt").toString("utf-8"))!!.trim().split("-")[0];
const osarch = fs.readFileSync("dist/osarch.txt").toString("utf-8").trim();

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
    let highestDate: Date | null = null;

    for (const release of releases) {
        const releaseVersion = semver.clean(release.name)!!.split("-")[0];

        if (semver.gt(releaseVersion, highestVersion)) {
            console.log("Found higher version:", releaseVersion, ">", highestVersion);
            highestRelease = release;
            highestVersion = releaseVersion;
            highestDate = new Date(release.published_at);
        } else if (semver.eq(releaseVersion, highestVersion) && highestDate) {
            const date = new Date(release.published_at);

            if (date.getTime() > highestDate.getTime()) {
                highestRelease = release;
                highestVersion = releaseVersion;
                highestDate = date;
            }
        }
    }

    if (highestRelease === null) {
        console.log("You are up-to-date! Starting boofstream.");
        startBoofstream();
        return;
    };

    console.log(`New release found: ${highestRelease.name}.`);
    console.log("Would you like to update now?");
    console.log("This process will take a few minutes and may need up to 750MB of storage.");
    console.log("Your existing data will be preserved. Layouts are not updated.");
    console.log("This will delete your old backup folder (and create a new one).");

    const shouldUpdate = await yesno({ question: "Do you wish to update now? (y/n) " });

    if (!shouldUpdate) {
        console.log("OK, starting boofstream without updating.");
        startBoofstream();
        return;
    }

    updateBoofstream(highestRelease);
}

function shouldUpdateFile(path: string) {
    let updaterFileName = "boofstream";
    if (osarch.startsWith("win")) updaterFileName += ".exe";

    if (
        path.startsWith("layouts") || 
        path.startsWith("out") || 
        path.startsWith("backup") || 
        // directories
        path.endsWith("/") ||
        // this executable
        path === updaterFileName
    ) {
        return false;
    }

    return true;
}

function backup(sep: string, path = ".") {
    // don't backup the backup
    if (path.startsWith("." + sep + "backup")) {
        return;
    }

    console.log("Backing up directory", path);

    const files = fs.readdirSync(path);

    // even though cpSync claims it can do this, it doesn't work on dirs on
    // Windows in my testing
    for (const file of files) {
        const filepath = path + sep + file;

        console.log("Backing up " + filepath + "...");
        
        if (fs.lstatSync(filepath).isDirectory()) {
            fs.mkdirSync("backup" + sep + filepath);
            backup(sep, filepath);
        } else {
            fs.cpSync(filepath, "backup" + sep + filepath);
        }
    }
}

function deleteDirectory(sep: string, path: string) {
    console.log("Removing directory", path);

    const files = fs.readdirSync(path);

    // even though rmSync claims it can do this, it doesn't work on dirs on
    // Windows in my testing
    for (const file of files) {
        const filepath = path + sep + file;

        console.log("Removing " + filepath + "...");
        
        if (fs.lstatSync(filepath).isDirectory()) {
            deleteDirectory(sep, filepath);
        } else {
            fs.rmSync(filepath);
        }
    }

    fs.rmdirSync(path);
}

async function updateBoofstream(release: any) {
    const sep = osarch.startsWith("win") ? "\\" : "/";
    const workdir = os.tmpdir() + sep + "boofstream-" + new Date().getTime();
    fs.mkdirSync(workdir);

    console.log("The workdir is", workdir, "if something goes wrong, you can delete this.");
    console.log("Backing everything up to the 'backup' directory.");
    console.log("If something goes wrong, your old setup will still be there.");

    if (fs.existsSync("backup")) {
        deleteDirectory(sep, "backup");
    }

    fs.mkdirSync("backup");

    backup(sep);

    const zipPath = await downloadReleaseZip(release, workdir, sep);

    const directory = await unzipper.Open.file(zipPath);

    const paths: string[] = [];

    for (const file of directory.files) {
        if (shouldUpdateFile(file.path)) {
            const write = () => new Promise((resolve, reject) => {
                file.stream()
                    .pipe(fs.createWriteStream(file.path))
                    .on("error", reject)
                    .on("finish", resolve);
            })

            console.log("Writing " + file.path + "...");
            paths.push(file.path);
            await write();
        }
    }

    console.log("Deleting old files...");
    deleteOldFiles(sep, paths);

    console.log("Cleaning up work directory...");
    deleteDirectory(sep, workdir);

    console.log("boofstream updated succesfully :) Starting now.");
    startBoofstream();
}

async function deleteOldFiles(sep: string, newFiles: string[], path = ".") {
    let unixyPath = path
        .substring(2)
        .replace(/\\/g, "/");

    if (!shouldUpdateFile(unixyPath)) {
        console.log("Skipping directory", unixyPath);
        return;
    }

    const files = fs.readdirSync(path);

    for (const file of files) {
        const filepath = path + sep + file;
        let unixpath = unixyPath + "/" + file;

        if (fs.lstatSync(filepath).isDirectory()) {
            deleteOldFiles(sep, newFiles, filepath);
        } else {
            // i don't know why this happens on the root dir i am so fucking tired it
            // is 2:30am
            if (unixpath.startsWith("/")) unixpath = unixpath.substring(1);

            if (!shouldUpdateFile(unixpath) || newFiles.includes(unixpath)) continue;

            console.log("Deleting old file", filepath, "/", unixpath);
            fs.rmSync(filepath);
        }
    }

    if (fs.readdirSync(path).length === 0) {
        console.log("Removing empty directory", path);
        fs.rmdirSync(path);
    }
}

async function downloadReleaseZip(release: any, workdir: string, sep: string) {
    let url = "";

    console.log("Searching for release artifact matching", release.name, osarch);

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
    const child = spawn(osarch.startsWith("win") ? ".\\dist\\boofstream.exe" : "./dist/boofstream");

    child.stderr.setEncoding("utf-8");
    child.stdout.setEncoding("utf-8");

    child.stderr.on("data", data => console.error(data.toString("utf-8")));
    child.stdout.on("data", data => console.log(data.toString("utf-8")));
}

main().then();
