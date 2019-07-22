import { formatDate } from '../../utils/formatDate';

export const onDrop = (tasks, day, updateTasks, allTasks, dispatchTask, setGroupedTasks, sourceTask, targetTask, position) => {
  const currentTask = allTasks.find(({ id }) => id === sourceTask.id);
  const copiedTasks = [...tasks].sort((a, b) => a.index - b.index);

  if (sourceTask.dueOn === targetTask.dueOn) {
    let sourceIndexInTasks = null;
    let targetIndexInTasks = null;

    copiedTasks.forEach(({ id: taskId }, i) => (taskId === sourceTask.id ? sourceIndexInTasks = i : null));
    copiedTasks.forEach(({ id: taskId }, i) => (taskId === targetTask.id ? targetIndexInTasks = i : null));

    copiedTasks.splice(sourceIndexInTasks, 1);
    copiedTasks.splice(targetIndexInTasks, 0, currentTask);

  } else if (sourceTask.dueOn !== targetTask.dueOn && position === 'top') {
    const insertedTask = allTasks.find(({ id }) => id === sourceTask.id);
    copiedTasks.splice(targetTask.index, 0, insertedTask);

  } else if (sourceTask.dueOn !== targetTask.dueOn && position === 'bottom') {
    const insertedTask = allTasks.find(({ id }) => id === sourceTask.id);
    copiedTasks.splice(targetTask.index + 1, 0, insertedTask);
  }

  // save task index in localstorage
  copiedTasks.forEach((task, index) => {
    localStorage.setItem(`${task.id}`, index);
  });

  // update state
  updateTasks({
    updatedTasks: copiedTasks.map((task, index) => ({ ...task, index })),
    currentDay: day,
  });
};

export const specTarget = {
  drop(props, monitor) {
    const targetDate = formatDate(props.day);
    const sourceDate = formatDate(monitor.getItem().dayRow);
    if (sourceDate !== targetDate) {
      props.onDrop(props, monitor.getItem());
    }
  },
};

export const collectTarget = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  hovered: monitor.isOver(),
});
