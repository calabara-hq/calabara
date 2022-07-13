import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'


const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const EDITOR_JS_TOOLS = {
    // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
    // paragraph: Paragraph,

    list: List,
    code: Code,
    image: {
        class: Image,
        config: {
            uploader: {
                async uploadByFile (file) {
                    let b64 = await toBase64(file)
                    return {
                        success: 1,
                        file: {
                            url: b64,
                        }
                    }
                }
            }
            /*
            endpoints: {
                byFile: 'https://localhost:3000/image/upload_img',
            }
            */
        }
    },
    header: Header,
    quote: Quote,
    marker: Marker,
    inlineCode: InlineCode,
}