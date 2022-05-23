import { expect } from 'chai';

export default class Worker {
    constructor(stringUrl) {
      this.url = stringUrl;
      this.onmessage = () => {};
    }
  
    postMessage(msg) {
      this.onmessage(msg);
    }
  }
global.expect = expect;
global.Worker = Worker
