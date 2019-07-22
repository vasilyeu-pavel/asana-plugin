import React from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';
import { ListGroupItem } from 'shards-react';

const collect = (monitor) => {
  const task = monitor.getItem();

  return {
    id: task && task.taskId,
    name: task && task.name,
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
};

const getItemStyles = (currentOffset) => {
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }
  const x = currentOffset.x;
  const y = currentOffset.y;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    pointerEvents: 'none',
    transform,
    WebkitTransform: transform,
  };
};

const DragItemPreview = ({ id, name, isDragging, currentOffset }) => {
  if (!isDragging) {
    return null;
  }

  return (
    <ListGroupItem
      className="task-item item preview"
      style={getItemStyles(currentOffset)}
    >
      <span className="drag-indicator">
        <i className="material-icons drag-item">
            drag_indicator
        </i>
      </span>
      <span
        className="d-flex task-info"
        style={{ width: '100%' }}
      >
        <div className="mr-1">
          <strong>{name}</strong>
        </div>
      </span>
    </ListGroupItem>
  );
};

DragItemPreview.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  isDragging: PropTypes.bool,
};

DragItemPreview.defaultProps = {
  id: 1,
  name: '',
  isDragging: false,
  currentOffset: {},
};

export default DragLayer(collect)(DragItemPreview);
