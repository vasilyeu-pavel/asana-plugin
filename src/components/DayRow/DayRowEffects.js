import { formatDate } from '../../utils/formatDate';

export const sortTask = ({ groupedTasks, day }) => {
  if (groupedTasks[formatDate(day)]) {
    return groupedTasks[formatDate(day)].map((task) => {
      if (localStorage.getItem(`${task.id}`)) {
        return {
          ...task,
          index: localStorage.getItem(`${task.id}`),
        };
      }
      return task;
    });
  }
};
