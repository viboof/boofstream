// Store this logic in another file in case we ever want to update it

function shouldUpdateFile(path, osarch) {
    let updaterFileName = "boofstream";
    if (osarch.startsWith("win")) updaterFileName += ".exe";

    if (
        path.startsWith("layouts") || 
        path.startsWith("out") || 
        path.startsWith("backup") || 
        path === updaterFileName
    ) {
        return false;
    }

    return true;
}
