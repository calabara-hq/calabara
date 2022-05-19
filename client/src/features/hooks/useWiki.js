import React from "react";
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { selectWikiList, setEns, setWikiList } from "../wiki/wiki-reducer";


export default function useWiki() {

    const wikiList = useSelector(selectWikiList)
    const dispatch = useDispatch();

    const deleteWiki = (grouping, index) => {

        let listCopy = JSON.parse(JSON.stringify(wikiList));
        listCopy[grouping].list.splice(index, 1);
        dispatch(setWikiList(listCopy))

    }

    const populateInitialWikiList = async (ens) => {
        
        const result = await axios.get('/wiki/fetchWikis/' + ens)
        dispatch(setEns(ens))
        dispatch(setWikiList(result.data))

    }

    const removeFromWikiList = (groupID) => {

        let listCopy = JSON.parse(JSON.stringify(wikiList))
        delete listCopy[groupID]
        dispatch(setWikiList(listCopy))

    }

    const renameWikiList = (newList) => {
      
        let listCopy = JSON.parse(JSON.stringify(wikiList))
        listCopy[newList.group_id] = newList.value;
        dispatch(setWikiList(listCopy))
      
      }

      return {
          deleteWiki: (grouping, index) => {
              deleteWiki(grouping, index)
          },
          populateInitialWikiList: (ens) => {
              populateInitialWikiList(ens)
          },
          removeFromWikiList: (groupID) => {
              removeFromWikiList(groupID)
          },
          renameWikiList: (newList) => {
              renameWikiList(newList)
          }
      }
}