import React from 'react';
import PropTypes from 'prop-types';
import { getDayName } from '../../utils/createCalendar';
import { formatDate } from '../../utils/formatDate';

const CalendarItem = ({ day, showAddTaskForm }) => {
  const currentDay = formatDate(day) === formatDate(new Date()) && 'current-day';

  return (
    <div className="task-day-name" onClick={showAddTaskForm}>
      <strong>
        {getDayName(day)}
      </strong>
      <div className={`task-day-number ${currentDay}`} >
        {day.getDate()}
      </div>
    </div>
  );
};

CalendarItem.propTypes = {
  day: PropTypes.object,
  showAddTaskForm: PropTypes.func.isRequired,
};

CalendarItem.defaultProps = {
  day: {},
};

export default CalendarItem;
