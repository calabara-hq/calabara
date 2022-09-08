
export default class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => { };
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
}
global.expect = expect;
global.Worker = Worker

export const withMarkup = function (query) {
  return function (text) {
    return query(function (content, node) {
      var hasText = function (node) { return node.textContent === text; };
      var childrenDontHaveText = Array.from(node.children).every(function (child) { return !hasText(child); });
      return hasText(node) && childrenDontHaveText;
    });
  };
};
