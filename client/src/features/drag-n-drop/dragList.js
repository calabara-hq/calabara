import React from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableElement from "./draggableElement";
import { useParams, useHistory } from 'react-router-dom'


import { useSelector, useDispatch } from 'react-redux';

import {
  selectWikiList,
  setWikiList,
} from '../wiki/wiki-reducer';
import useCommon from "../hooks/useCommon";

const DragDropContextContainer = styled.div`
  padding: 20px;
  max-width: 100%;
  overflow-wrap: anywhere;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-rows;
  grid-gap: 8px;
  position: relative;
`;


// ok. we need to update the db to record when a wiki entry switches access levels, or when the default wiki is switched.
// removeFromList and addToList WILL catch these events, but they are too verbose. I.e. they will fire when an element is dragged out and brought back to the same place.
// we can write a helper function to check for more granular criteria.
// ultimately we need to know WHEN to move something, and WHAT to move ...

// take old list, new list, and the element involved in any change


const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};



function DragList({ setCurrentWikiId, editWikiGroupingClick, lists, setLists }) {
  const { ens } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const wikiList = useSelector(selectWikiList);
  const { authenticated_post } = useCommon()

  // watch elements and update db on change
  // since we use length, we only need to watch 1 of them


  const onDragEnd = async (result) => {

    if (!result.destination) {
      return;
    }
    let listCopy = JSON.parse(JSON.stringify(wikiList));
    let sourceList = listCopy[result.source.droppableId].list;
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId].list = newSourceList;
    const destinationList = listCopy[result.destination.droppableId].list;
    listCopy[result.destination.droppableId].list = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    let res = await authenticated_post('/wiki/updateWikiLists', { ens: ens, file_id: result.draggableId, new_grouping: result.destination.droppableId })
    if (res) dispatch(setWikiList(listCopy));

  };

  return (
    <DragDropContextContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <ListGrid>
          {Object.keys(wikiList).map((listKey) => (
            <DraggableElement
              editWikiGroupingClick={editWikiGroupingClick}
              setCurrentWikiId={setCurrentWikiId}
              elements={wikiList[listKey].list}
              key={listKey}
              prefix={listKey}
              group_name={wikiList[listKey].group_name}
              history={history}
            />
          ))}

        </ListGrid>
      </DragDropContext>

    </DragDropContextContainer>
  );
}

export default DragList;
