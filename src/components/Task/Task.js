import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

import { onSubmit } from './TaskUtils';
import AddTask from '../AddTask/AddTask';
import { specTarget, collectTarget, collectSource, specSource } from './TaskDnDUtils';

const Task = ({
  name: prevName,
  id,
  connectDragSource,
  isDragging,
  connectDropTarget,
  dispatchTask,
  currentProject,
  assigned,
  day,
  setError,
  completed,
  hovered,
  isFake,
}) => {
  const inputEl = useRef(null);
  const taskItemEl = useRef(null);
  const taskSwipeItem = useRef(null);
  const [isOpen, handleOpen] = useState(false);
  const [taskName, setTaskName] = useState(prevName);

  let lastTap = 0;

  // callback after double touch on task
  const editTaskAfterDoubleTouch = () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
      handleOpen(true);
    }
    lastTap = currentTime;
  };

  const dragStart = () => {
    taskItemEl.current.style['box-shadow'] = '4px 7px 18px -5px rgba(173,173,173,1)';
    taskItemEl.current.style.transition = 'box-shadow 0.3s ease-in-out';
  };
  const dragEnd = () => { taskItemEl.current.style['box-shadow'] = null; };

  useEffect(() => {
    taskSwipeItem.current.classList.remove('task-target-bottom');
    taskSwipeItem.current.classList.remove('task-target-top');

    if (!isFake) {
      connectDropTarget(findDOMNode(inputEl.current));
      connectDragSource(findDOMNode(inputEl.current));
    }

    if (taskItemEl.current && inputEl.current) {
      // double touch listener for edit task
      taskItemEl.current.addEventListener('touchend', editTaskAfterDoubleTouch);
      // handle styles for start and end drag
      inputEl.current.addEventListener('touchstart', dragStart);
      inputEl.current.addEventListener('touchend', dragEnd);
    }

    // remove listener after unmount component
    return () => {
      if (taskItemEl.current && inputEl.current) {
        taskItemEl.current.removeEventListener('touchend', editTaskAfterDoubleTouch);
        inputEl.current.removeEventListener('touchstart', dragStart);
        inputEl.current.removeEventListener('touchend', dragEnd);
      }
    };
  }, [prevName, completed, isOpen, hovered, isFake]);

  const onCompletedStyle = completed ? 'completed task-swipe-item' : 'task-swipe-item';

  const isFakeStyle = isFake ? '#f5f6f8' : 'white';

  return (
    <div
      ref={taskSwipeItem}
      className="task-swipe-item"
      style={{
        visibility: isDragging ? 'hidden' : 'visible',
        width: '100%',
      }}
    >
      {!isOpen ?
        <div
          ref={taskItemEl}
          key={id}
          className="task-item list-group-item task-swipe-item"
          onDoubleClick={() => handleOpen(true)}
          style={{
            visibility: isDragging ? 'hidden' : 'visible',
            background: isFakeStyle,
          }}
        >
          <span
            ref={inputEl}
            className="drag-indicator task-swipe-item"
          >
            <i className="material-icons drag-item task-swipe-item">
              drag_indicator
            </i>
          </span>
          <span
            className="d-flex task-info task-swipe-item"
            style={{ width: '100%' }}
          >
            <div className="mr-1 task-swipe-item">
              <strong className={onCompletedStyle}>{prevName}</strong>
            </div>
          </span>
        </div>
        :
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            handleOpen(false);
            try {
              if (taskName !== prevName || taskName.length) {
                await onSubmit({ taskName, taskId: id, dispatchTask, assigned, day, currentProject });
              }
            } catch (e) {
              setError(e);
            }
          }}
        >
          <AddTask setTaskName={setTaskName} taskName={taskName} />
        </form>
      }
    </div>
  );
};

Task.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  connectDragSource: PropTypes.func.isRequired,
  // from dnd
  connectDropTarget: PropTypes.func.isRequired,
  dispatchTask: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  completed: PropTypes.bool.isRequired,
  currentProject: PropTypes.object.isRequired,
  assigned: PropTypes.object.isRequired,
  day: PropTypes.object.isRequired,
  hovered: PropTypes.bool.isRequired,
  isFake: PropTypes.bool.isRequired,
};

Task.defaultProps = {
  name: '',
  id: null,
  droppedElement: null,
  isFake: false,
};

export default DropTarget('tasks', specTarget, collectTarget)(DragSource('tasks', specSource, collectSource)(memo(
  Task,
  (prevProps, nextProps) => {
    // todo Pavel: check rerender after drag (props.index not working)
    // if (prevProps.name === nextProps.name
    //   && prevProps.completed === nextProps.completed
    //   && prevProps.hovered === nextProps.hovered
    //   && prevProps.index === nextProps.index
    // ) {
    //   return true;
    // }
    // return false;
  })));
