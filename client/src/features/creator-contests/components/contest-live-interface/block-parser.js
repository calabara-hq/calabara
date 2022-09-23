import edjsHTML from 'editorjs-html'
import ReactHtmlParse from 'react-html-parser'
import { LazyLoadImage } from 'react-lazy-load-image-component';
const edjsParser = edjsHTML();




export const ParseBlocks = ({ data }) => {


    let elements = []

    if (data.blocks.length > 0) {
        let htmls = edjsParser.parse(data)
        htmls.map(html => {

            let reactElement = ReactHtmlParse(html)
            if (reactElement[0].type === 'img') {
                return elements.push(<div style={{display: 'flex', justifyContent: 'center'}}><LazyLoadImage src={reactElement[0].props.src} effect="blur" style={{ maxWidth: '35em', borderRadius: '10px' }} /></div>)
            }
            elements.push(reactElement)
        })
        return elements
    }
    return null

}