import edjsHTML from 'editorjs-html'
const ReactDOMServer = require('react-dom/server');
const HtmlToReactParser = require('html-to-react').Parser;


const edjsParser = edjsHTML();
const htmlToReactParser = new HtmlToReactParser();



export const ParseBlocks = ({ data }) => {
    let elements = []

    if (data.blocks.length > 0) {
        let htmls = edjsParser.parse(data)

        htmls.map(html => {
            let reactElement = htmlToReactParser.parse(html)

            if (Array.isArray(reactElement)) {
                reactElement = reactElement.filter(el => el != ',')
            }
            elements.push(reactElement)
        })

        return elements
    }

    return null

}