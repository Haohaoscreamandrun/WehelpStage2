// Get the current domain
let currentDomain = window.location.hostname;
// Get the current port
let currentPort = window.location.port;
// Combine domain and port
export let server = `https://${currentDomain}:${currentPort}`