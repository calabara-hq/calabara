import { Droppable } from "react-beautiful-dnd";
import ListItem from "./listItem";
import React from "react";
import styled from "styled-components";

const ColumnHeader = styled.div`
  margin-bottom: 20px;
  font-size: 17px;
`;

const DroppableStyles = styled.div`
  padding: 10px 10px 10px 10px;
  border-radius: 10px;
  background: #f4f5f7;
  &:hover{
    .new-document{
      background-color: white;
    }
    .new-document span{
      color: #42526e;
      font-size: 15px;
    }
    .draglist-header button{
      color: white;
      background-color: lightgrey;
    }
  }
`;



const DraggableElement = ({ prefix, elements, setCurrentWikiId, history, group_name, editWikiGroupingClick}) => (
  <DroppableStyles>
    
    <ColumnHeader>
    <div className="draglist-header">
      {group_name}
      <button onClick={()=> {editWikiGroupingClick(prefix)}}><span className="fas fa-cog"></span></button>
    </div>
    </ColumnHeader>
    <Droppable droppableId={`${prefix}`}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {elements.map((item, index) => (
            <ListItem key={item.id} item={item} index={index} setCurrentWikiId={setCurrentWikiId}/>
          ))}
          {provided.placeholder}
          <div className="new-document" onClick={()=> {history.push('docs-edit/' + prefix + '/new/');}}>
          <span className="fas fa-plus"></span>
          </div>
        </div>
      )}
    </Droppable>
  </DroppableStyles>
);

export default DraggableElement;
