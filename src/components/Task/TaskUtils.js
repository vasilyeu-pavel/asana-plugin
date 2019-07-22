import { formatDate } from '../../utils/formatDate';
import { updateTask } from '../../utils/asanaRequests';

export const onSubmit = ({ taskName, taskId, dispatchTask, assigned, day, currentProject }) => {
  dispatchTask({
    type: 'CHANGE_NAME',
    payload: {
      assignee: assigned,
      due_on: formatDate(day),
      name: taskName,
      id: taskId,
      projects: [currentProject],
      completed: false,
    },
  });

  return updateTask({ taskGid: `${taskId}`, name: taskName });
};

export const onComplete = ({ id, completed }) => updateTask({ taskGid: `${id}`, completed: !completed });
