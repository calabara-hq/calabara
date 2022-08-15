importScripts("comlink.min.js");

async function pullLogo(endpoint) {
  const response = await fetch('/' + endpoint)
  const fileBlob = await response.blob();
  return fileBlob;
}

async function pullIpfs(endpoint){
  const response = await fetch(endpoint);
  const fileBlob = await response.blob();
  return fileBlob
}

Comlink.expose(pullLogo);
Comlink.expose(pullIpfs);
