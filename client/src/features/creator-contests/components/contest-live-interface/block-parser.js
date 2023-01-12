import edjsHTML from 'editorjs-html';
import ReactHtmlParse from 'react-html-parser';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Zoom from 'react-medium-image-zoom';
import '../../../../css/image-zoom.css';
const edjsParser = edjsHTML();

function createTextLinks_(text) {
    return (text || '').replace(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi, function (match, space, url) {
        var hyperlink = url;
        if (!hyperlink.match('^https?://')) {
            hyperlink = 'http://' + hyperlink;
        }
        return space + '<a target="_blank" href="' + hyperlink + '">' + url + '</a>';
    });
}

export const ParseBlocks = ({ data, withZoom }) => {
    var blocks = JSON.parse(JSON.stringify(data.blocks))
    let elements = []
    if (blocks.length > 0) {

        blocks.map((block, idx) => {

            if (block.type === 'image') {
                let block_html = edjsParser.parseBlock(block)
                let reactElement = ReactHtmlParse(block_html)
                if (withZoom) return elements.push(<div key={idx} style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}><Zoom style={{ backgroundColor: 'black' }}><LazyLoadImage src={reactElement[0].props.src} effect="blur" style={{ maxWidth: '90%', borderRadius: '10px' }} /></Zoom></div>)
                return elements.push(<div key={idx} style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}><LazyLoadImage src={reactElement[0].props.src} effect="blur" style={{ maxWidth: '90%', borderRadius: '10px' }} /></div>)
            }


            else if (block.type === 'paragraph') {
                block.data.text = createTextLinks_(block.data.text)
                let block_html = edjsParser.parseBlock(block)
                block_html = block_html.replace(/href/g, "target='_blank' href")
                let reactElement = ReactHtmlParse(block_html)
                return elements.push(reactElement)
            }

            else {
                let block_html = edjsParser.parseBlock(block)
                let reactElement = ReactHtmlParse(block_html)
                return elements.push(reactElement)
            }
        })
        return elements
    }
    return null

}