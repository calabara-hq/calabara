importScripts("comlink.min.js");

async function pullLogo(endpoint) {
  const response = await fetch('/' + endpoint)
  const fileBlob = await response.blob();
  return fileBlob;
}

  async function pullSubmissions(endpoint) {

    let submission = await fetch(endpoint, {mode: 'cors'});
    let json = await submission.json();
    return json;
    //return [json.tldr_text, URL.createObjectURL]
    //let tldr_image = await fetch(json.tldr_image)
    //let blob = await tldr_image.blob();
    //return [json.tldr_text, URL.createObjectURL(blob)]

    /*
    return fetch(endpoint)
      .then(data => data.json())
    //.then(response => response.blob())
*/


    /*
      .then((response) => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          }
        })
      })
      
      .then((stream) => new Response(stream))
      .then(data => data.json())
      .then(data => data.tldr_image)
      .then(img_url => {
        fetch(img_url)
          .then(response => response.blob())
          .then(blob => URL.createObjectURL(blob))
          //.then(x => 
      })
      */
    // Create an object URL for the response

    /*
  .then(async result => {
    this.tldr_text = result.tldr_text;
    const img_response = await fetch(result.tldr_image)
    .then(async result => result.blob())
    .then(blob => this.tldr_image = URL.createObjectURL(blob))
    //.then(img_result => 
  })
  */

}


Comlink.expose({ pullLogo, pullSubmissions });
