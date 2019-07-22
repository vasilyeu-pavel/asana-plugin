import { formatDate } from '../../utils/formatDate';

export const showAddTaskForm = (id, handleEditTask, dispatchCalendar) => {
  dispatchCalendar({
    type: 'OPEN_DAY',
    payload: id,
  });
  handleEditTask(true);
};

export const scrollTo = (inputEl) => {
  if (inputEl.current.getAttribute('name') === formatDate(new Date())) {
    inputEl.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};
