import '../../css/wiki-editor/default.css'
import '../../css/wiki-editor/custom-style.css'
import '../../css/wiki-editor/medium-editor.css'
import Editor from 'react-medium-editor';
import { useParams, useHistory } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

import { useSelector, useDispatch } from 'react-redux';

import {
  selectDashboardInfo,
} from '../dashboard/dashboard-info-reducer'

import useCommon from '../hooks/useCommon';
import { useWalletContext } from '../../app/WalletContext';


export default function WikiEditor() {
  const history = useHistory();
  const { ens, file, grouping } = useParams();
  const info = useSelector(selectDashboardInfo);
  const [isLoaded, setIsLoaded] = useState(false)
  const [filedata, setFileData] = useState([]);
  const [redirect, setRedirect] = useState(true);


  useEffect(() => {
    if (info.name == "") {
      // don't allow direct url access. direct the user to the wiki-display screen first.
      history.push('/' + ens + '/docs')
    }

    else {
      setRedirect(false)
      if (file == 'new') {
        // render blank wiki
        setFileData({ filedata: { content: "", title: "" }, metadata: { grouping: grouping } })
        setIsLoaded(true)
      }
      else {
        // load data from server
        axios.get('/wiki/readWiki/' + file)
          .then(res => {
            setFileData(res.data);
            setIsLoaded(true);
          })

      }
    }
  }, [])

  // fetch the file if it's new, otherwise open up a blank one


  return (
    <>
      {!redirect &&
        <div className="edit-container">
          {!isLoaded &&
            <div className="editor-display">
              <div style={{ backgroundColor: 'white' }} className="editor-title">
                <div className="loading" disabled style={{ backgroundColor: 'lightgrey', borderRadius: '16px', marginBottom: '10px' }}></div>
              </div>
            </div>
          }
          {isLoaded && <ReactEditor data={filedata} />}
        </div>
      }
    </>
  )

}


function ReactEditor({ data }) {
  var content = data.filedata.content;
  const [title, setTitle] = useState(data.filedata.title)
  const { ens, file, grouping } = useParams();
  const history = useHistory();
  const [pending, setPending] = useState(false)
  const contentRef = useRef(null);
  const textAreaRef = useRef(null);
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  const [parentHeight, setParentHeight] = useState("auto")
  const dispatch = useDispatch();
  const { authenticated_post } = useWalletContext();

  async function publishDocument() {


    data.filedata.title = title;
    data.filedata.content = content;
    let res;
    if (file == 'new') {
      res = await authenticated_post('/wiki/writeWikiInitial', { ens: ens, data: data })
    }
    else {
      res = await authenticated_post('/wiki/updateWiki', { ens: ens, file_id: file, data: JSON.stringify({ title: title, content: content }) })
    }
    if (res) {
      setPending(true)
      setTimeout(() => {
        setPending(false);
        history.push('/' + ens + '/docs')
      }, 1000)
    }

  }


  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  function updateContent(newContent) {
    content = newContent;
  }


  useEffect(() => {
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
  }, [title]);

  const onTitleChangeHandler = (e) => {
    setTextAreaHeight("auto");
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setTitle(e.target.value);
  };



  return (
    <>
      <div className="wiki-publish-container">
        <button onClick={publishDocument} className={"editorPublishBtn " + (pending ? 'spinner' : undefined)}>Publish</button>

      </div>
      <div className="editor-title" style={{ minHeight: parentHeight }}>
        <textarea ref={textAreaRef} rows={1} style={{ height: textAreaHeight }} type="text" placeholder="Your title here" value={title} onChange={onTitleChangeHandler} />
      </div>

      <Editor
        ref={contentRef}
        text={content}
        className="react-editor"
        onKeyDown={handleKeyDown}
        onChange={newContent => updateContent(newContent)}
        options={{ targetBlank: true, anchor: { linkValidation: true } }}

      />

    </>
  )

}
