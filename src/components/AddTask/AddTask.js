import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem } from 'shards-react';
import './AddTask.scss';

const AddTask = ({ taskName, setTaskName }) =>
  (
    <ListGroupItem className="task-item">
      <div
        className="d-flex task-info"
        style={{ width: '100%' }}
      >
        <input
          size="sm"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder={taskName || 'Add task...'}
          className="add-task-input"
          autoFocus
        />
      </div>
    </ListGroupItem>
  );

AddTask.propTypes = {
  taskName: PropTypes.string,
  setTaskName: PropTypes.func.isRequired,
};

AddTask.defaultProps = {
  taskName: '',
};

export default AddTask;
