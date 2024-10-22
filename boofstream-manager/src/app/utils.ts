export function getBackendHost() {
    return "http://" + location.hostname + ":1337/";
}

export function getSocketHost() {
    return "http://" + location.hostname + ":1338/";
}
