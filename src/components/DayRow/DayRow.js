import React, {
  memo, useState, useEffect, useContext, useRef,
} from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { ListGroup } from 'shards-react';
import { DropTarget } from 'react-dnd';

// components
import AddTask from '../AddTask/AddTask';
import CalendarItem from '../CalendarItem/CalendarItem';
import SwipeTask from '../SwipeTask/SwipeTask';
import Error from '../../pages/Error/Error';

// context
import AsanaContext from '../../context';

// utils
import { formatDate } from '../../utils/formatDate';
import { showAddTaskForm, scrollTo } from './DayRowUtils';
import { onDrop, collectTarget, specTarget } from './DayRowDnDUtils';
import { getId } from '../../utils/createCalendar';
import { createTask } from '../../utils/asanaRequests';

const DayRow = ({
  tasks,
  day,
  id,
  currentProject,
  assigned,
  projects,
  dispatchCalendar,
  dispatchTask,
  connectDropTarget,
  hovered,
  updateTasks,
  dayIsOpen,
  setGroupedTasks,
  allTasks,
}) => {
  const calendarDayEl = useRef(null);
  const { user } = useContext(AsanaContext);

  const [isEditTask, handleEditTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [error, setError] = useState({});

  useEffect(() => {
    scrollTo(calendarDayEl);
    connectDropTarget(findDOMNode(calendarDayEl.current));
    if (!dayIsOpen) {
      handleEditTask(false);
    }
  }, [dayIsOpen]);

  // submit create task
  const onSubmit = async (event) => {
    event.preventDefault();
    handleEditTask(false);

    if (!taskName || !taskName.length) return;

    try {
      const generatedId = getId();

      dispatchTask({
        type: 'CREATE_TASK',
        payload: {
          assignee: assigned,
          due_on: formatDate(day),
          name: taskName,
          id: +generatedId,
          projects: [currentProject],
          completed: false,
        },
      });

      setTaskName('');
      const createdTask = await createTask({
        taskName, assigned, currentProject, day, user, projects,
      });

      dispatchTask({
        type: 'SYNCHRONIZE_CREATED_TASK',
        payload: {
          createdTask,
          synchronizedTaskId: generatedId,
        },
      });
    } catch (err) {
      setError(err);
    }
  };

  if (Object.keys(error).length) return (<Error error={error.message} />);

  const taskDropTargetStyle = {
    background: hovered ? '#F5F5F5' : '#f5f6f8',
  };

  return (
    <div
      className="d-flex border-bottom day-row"
      style={taskDropTargetStyle}
      key={id}
      ref={calendarDayEl}
      name={formatDate(day)}
    >
      <CalendarItem
        day={day}
        showAddTaskForm={(e) => {
          if (!e.target.className.includes('drag')) {
            showAddTaskForm(id, handleEditTask, dispatchCalendar);
          }
        }}
      />
      <ListGroup
        className="task-list-group"
        small
        key={id}
        onClick={() => {
          if (!tasks || !tasks.length) {
            showAddTaskForm(id, handleEditTask, dispatchCalendar);
          }
        }}
      >
        {tasks && tasks
          .filter(({ projects: assignedProjects }) => assignedProjects[0].id === currentProject.id)
          .filter(({ assignee }) => assigned && assignee && assignee.id === assigned.id)
          .sort((a, b) => a.index - b.index)
          .map((props, index) => {
            const i = localStorage.getItem(`${props.id}`);
            if (!i) {
              localStorage.setItem(`${props.id}`, index);
            }
            return (
              <SwipeTask
                {...props}
                key={props.id}
                index={index}
                dayRow={day}
                onDrop={onDrop.bind(null, tasks, formatDate(day), updateTasks, allTasks, dispatchTask, setGroupedTasks)}
                clouseRow={() => handleEditTask(false)}
                dispatchTask={dispatchTask}
                currentProject={currentProject}
                assigned={assigned}
                day={day}
                setError={setError}
              />
            )
          })
        }
        <form onSubmit={onSubmit}>
          {isEditTask && (
            <AddTask
              taskName={taskName}
              setTaskName={setTaskName}
            />
          )}
        </form>
      </ListGroup>
    </div>
  );
};

DayRow.propTypes = {
  projects: PropTypes.array,
  allTasks: PropTypes.array,
  tasks: PropTypes.array,
  day: PropTypes.object,
  id: PropTypes.string,
  assigned: PropTypes.object,
  currentProject: PropTypes.object,
  dispatchCalendar: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  updateTasks: PropTypes.func.isRequired,
  dispatchTask: PropTypes.func.isRequired,
  dayIsOpen: PropTypes.bool.isRequired,
  hovered: PropTypes.bool.isRequired,
  setGroupedTasks: PropTypes.func.isRequired,
};

DayRow.defaultProps = {
  groupedTasks: {},
  day: {},
  id: '1',
  projects: [],
  allTasks: [],
  tasks: [],
  assigned: {},
  currentProject: {},
  open: false,
};

export default DropTarget(['tasks'], specTarget, collectTarget)(memo(
  DayRow,
  (prevProps, nextProps) => {
    if (prevProps.dayIsOpen === nextProps.dayIsOpen && nextProps.tasks === prevProps.tasks) return true;
    return false;
  },
));
