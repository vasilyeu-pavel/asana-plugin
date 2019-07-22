export const groupTasks = (tasks) => {
  const groupedTasks = {
    all: [],
  };

  tasks.forEach((task) => {
    if (!groupedTasks[task.due_on]) groupedTasks[task.due_on] = [];
    groupedTasks[task.due_on || 'all'].push(task);
  });

  return groupedTasks;
};
