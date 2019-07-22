import { findDOMNode } from 'react-dom';

let position = '';

export const specSource = {
  beginDrag({ id, index, due_on, dayRow, clouseRow, name }) {
    clouseRow();
    return {
      taskId: id,
      taskIndex: index,
      dueOn: due_on,
      dayRow,
      name,
    };
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    props.clouseRow();
  },
};

export const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
});

export const specTarget = {
  hover(props, monitor, component) {
    if (!monitor.canDrop()) {
      return;
    }

    const { y } = monitor.getClientOffset();
    const task = findDOMNode(component);

    const { top, height } = task.getBoundingClientRect();

    if (y < top + (height / 2)) {
      position = 'top';
      task.classList.remove('task-target-bottom');
      task.classList.add('task-target-top');
    } else {
      position = 'bottom';
      task.classList.remove('task-target-top');
      task.classList.add('task-target-bottom');
    }
  },
  drop(props, monitor) {
    const sourceTask = {
      dueOn: monitor.getItem().dueOn,
      index: monitor.getItem().taskIndex,
      id: monitor.getItem().taskId,
      name: monitor.getItem().name,
    };

    const targetTask = {
      dueOn: props.due_on,
      index: props.index,
      id: props.id,
      name: props.name,
    };

    props.onDrop(sourceTask, targetTask, position);
  },
};

export const collectTarget = (connect, monitor) => {

  return ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    hovered: monitor.isOver(),
    droppedElement: monitor.getItem(),
  });
};
