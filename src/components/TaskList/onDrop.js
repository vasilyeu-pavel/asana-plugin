import update from 'react-addons-update';
import { formatDate } from '../../utils/formatDate';
import { updateTask } from '../../utils/asanaRequests';

const onDrop = async (tasks, groupedTasks, setGroupedTasks, dispatchTask, target, source) => {
  const currentTask = tasks.find(task => task.id === source.taskId);
  const sourceElement = groupedTasks[formatDate(source.dayRow)][source.taskIndex];
  const currentSourcePosition = groupedTasks[formatDate(source.dayRow)].indexOf(sourceElement);

  if (!groupedTasks[formatDate(target.day)]) {
    groupedTasks[formatDate(target.day)] = [];
  }

  let result = null;

  if (!target.tasks) {
    // add task in clear row
    result = update(groupedTasks, {
      [formatDate(source.dueOn)]: {
        $splice:
          [
            [currentSourcePosition, 1],
          ],
      },
      [formatDate(target.day)]:
        {
          $push: [{
            ...currentTask,
            due_on: formatDate(target.day),
          }],
        },
    });
  } else {
    // remove task in row after drop
    result = update(groupedTasks, {
      [formatDate(source.dueOn)]: {
        $splice:
          [
            [currentSourcePosition, 1],
          ],
      },
    });
  }
  setGroupedTasks(result);
  dispatchTask({
    type: 'CHANGE_DUE_ON',
    payload: {
      ...currentTask,
      due_on: formatDate(target.day),
    },
  });
  // request for update task in asana db
  await updateTask({ taskGid: `${currentTask.id}`, due_on: formatDate(target.day) });
};

export default onDrop;
