import edjsHTML from 'editorjs-html'
const ReactDOMServer = require('react-dom/server');
const HtmlToReactParser = require('html-to-react').Parser;


const edjsParser = edjsHTML();
const htmlToReactParser = new HtmlToReactParser();



export const ParseBlocks = ({ blocks }) => {
    /*
    if (blocks) {
        let html = edjsParser.parse(blocks)
        console.log(html)
        let reactElement = htmlToReactParser.parse(html)
        console.log(reactElement)
        return reactElement
    }
    */
    return <p>hi</p>
    
}