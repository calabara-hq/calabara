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
import axios from 'axios'
import { showNotification } from '../../../notifications/notifications'




export const EDITOR_JS_TOOLS = {
    // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
    // paragraph: Paragraph,

    list: List,
    code: Code,
    image: {
        class: Image,
        config: {
            // disable the default notifier
            uploader: {
                uploadByFile(file) {

                    const reader = new FileReader();

                    reader.readAsDataURL(file);
                    /*
                    reader.onload = (e) => {
                        onPreview(e.target.result);
                    };
                    */

                    const formData = new FormData();
                    formData.append("image", file);


                    return axios({
                        method: 'post',
                        url: '/creator_contests/upload_img',
                        data: formData
                    }).then(response => {
                        return response.data
                    }).catch(error => {
                        showNotification('error', 'error', 'File type not allowed. Accepted image types: png, jpg, jpeg, svg, gif')
                    });



                }
            },
            
      }
    },
    header: Header,
    quote: Quote,
    marker: Marker,
    inlineCode: InlineCode,
}
