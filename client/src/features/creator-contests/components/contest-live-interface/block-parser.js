import edjsHTML from 'editorjs-html'
const ReactDOMServer = require('react-dom/server');
const HtmlToReactParser = require('html-to-react').Parser;


const edjsParser = edjsHTML();
const htmlToReactParser = new HtmlToReactParser();



export const ParseBlocks = ({ data }) => {
    console.log(data)

    if (data.blocks.length > 0) {
        let html = edjsParser.parse(data)
        console.log(html)
        let reactElement = htmlToReactParser.parse(html[0])
        console.log(reactElement)
        if (Array.isArray(reactElement)) {
            reactElement = reactElement.filter(el => el != ',')
        }
        return reactElement
    }

    return null

}