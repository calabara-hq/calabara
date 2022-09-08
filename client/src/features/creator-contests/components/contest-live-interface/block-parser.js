import edjsHTML from 'editorjs-html'
const ReactDOMServer = require('react-dom/server');
const HtmlToReactParser = require('html-to-react').Parser;


const edjsParser = edjsHTML();
const htmlToReactParser = new HtmlToReactParser();



export const ParseBlocks = ({ data }) => {
    

    if (data.blocks.length > 0) {
        let html = edjsParser.parse(data)
        
        let reactElement = htmlToReactParser.parse(html[0])
        
        if (Array.isArray(reactElement)) {
            reactElement = reactElement.filter(el => el != ',')
        }
        return reactElement
    }

    return null

}