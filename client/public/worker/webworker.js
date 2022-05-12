importScripts("comlink.min.js");

async function pullLogo(endpoint){
  const response =  await fetch('/' + endpoint)
  console.log(response)
  const fileBlob = await response.blob();
  return fileBlob;

}

Comlink.expose(pullLogo);
