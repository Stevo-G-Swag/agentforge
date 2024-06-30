import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { updateTaskStatus } from '../features/tasksSlice';

const KanbanBoard = () => {
  const tasks = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    if (!result.destination) return;
    dispatch(updateTaskStatus({
      id: result.draggableId,
      newStatus: result.destination.droppableId
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {['pending', 'inProgress', 'completed'].map(status => (
        <Droppable droppableId={status} key={status}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <h2>{status}</h2>
              {tasks[status].map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {task.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default KanbanBoard;