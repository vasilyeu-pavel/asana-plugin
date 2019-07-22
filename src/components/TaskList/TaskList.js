import React, {
  useReducer, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import Preloader from '../Preloader/Preloader';
import { groupTasks } from '../../utils/groupTasks';
import DayRow from '../DayRow/DayRow';
import { initialStateCalendar, reducer } from '../../reducers';
import onDrop from './onDrop';
import { sortTask } from '../DayRow/DayRowEffects';

const TaskList = ({ tasks, ...props }) => {
  const [calendar, dispatchCalendar] = useReducer(reducer, initialStateCalendar);
  const [groupedTasks, setGroupedTasks] = useState({});

  useEffect(() => {
    setGroupedTasks(groupTasks(tasks));
  }, [tasks]);

  if (!Object.keys(groupedTasks).length) return <Preloader />;

  return calendar.dates.map(({ day, id, open }) => (
    <DayRow
      key={id}
      allTasks={tasks}
      tasks={sortTask({ groupedTasks, day })}
      day={day}
      id={id}
      dispatchCalendar={dispatchCalendar}
      dayIsOpen={open}
      setGroupedTasks={setGroupedTasks}
      updateTasks={({ updatedTasks, currentDay }) => setGroupedTasks({
        ...groupedTasks,
        [currentDay]: updatedTasks,
      })}
      onDrop={onDrop.bind(null, tasks, groupedTasks, setGroupedTasks, props.dispatchTask)}
      {...props}
    />
  ));
};

TaskList.propTypes = {
  tasks: PropTypes.array,
  dispatchTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  tasks: [],
};

export default TaskList;
