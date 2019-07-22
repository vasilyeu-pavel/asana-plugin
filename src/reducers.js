import { getMonth } from './utils/createCalendar';
import sortByDateWithNull from './utils/sortByDateWithNull';

export const initialStateCalendar = {
  dates: [
    ...getMonth(),
    ...getMonth(new Date().getFullYear(), new Date().getMonth() + 1),
  ]
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_DAY': {
      return {
        dates: state.dates.map(date => ({
          ...date,
          open: date.id === action.payload,
        })),
      };
    }
    default:
      return state;
  }
};

export const initialStateTasks = { tasks: [] };

export const tasksReducer = (state, action) => {
  switch (action.type) {
    case 'START_REQUEST': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'SET_TASKS': {
      return {
        tasks: [...sortByDateWithNull(action.payload)]
          .filter(task => task.projects && task.projects.length)
          .map(task => ({
            ...task,
            isFake: false,
            index: localStorage.getItem(`${task.id}`),
          })),
        loading: false,
      };
    }
    case 'CREATE_TASK': {
      const { tasks } = state;
      tasks.push({
        ...action.payload,
        isFake: true,
      });
      return {
        tasks: [...sortByDateWithNull(tasks)]
          .filter(task => task.projects && task.projects.length)
          .map((task) => {
            if (task.id === action.payload.id) {
              return ({
                ...task,
                index: tasks.length,
              });
            }
            return ({
              ...task,
              index: localStorage.getItem(`${task.id}`),
            });
          }),
        loading: false,
      };
    }
    case 'SYNCHRONIZE_CREATED_TASK': {
      const { tasks } = state;
      const { createdTask, synchronizedTaskId } = action.payload;
      const filteredTask = tasks.filter(({ id }) => id !== +synchronizedTaskId);
      filteredTask.push(createdTask);

      return {
        tasks: [...sortByDateWithNull(filteredTask)]
          .filter(task => task.projects && task.projects.length)
          .map((task) => {
            if (task.id === createdTask.id) {
              return ({
                ...task,
                isFake: false,
              });
            }
            return ({
              ...task,
              isFake: false,
              index: localStorage.getItem(`${task.id}`),
            });
          }),
        loading: false,
      };
    }
    case 'CHANGE_DUE_ON': {
      const currentTask = action.payload;
      const filteredTask = state.tasks.filter(({ id }) => id !== currentTask.id);
      return {
        tasks: [...filteredTask, currentTask].map(task => ({
          ...task,
          isFake: false,
          index: localStorage.getItem(`${task.id}`),
        })),
      };
    }
    case 'CHANGE_NAME': {
      const currentTask = action.payload;
      const filteredTask = state.tasks.filter(({ id }) => id !== currentTask.id);
      return {
        tasks: [...filteredTask, currentTask].map(task => ({
          ...task,
          isFake: false,
          index: localStorage.getItem(`${task.id}`),
        })),
      };
    }
    case 'CHANGE_STATUS': {
      const currentTask = action.payload;

      const filteredTask = state.tasks.filter(({ id }) => id !== currentTask.id);
      return {
        tasks: [...filteredTask, currentTask].map(task => ({
          ...task,
          isFake: false,
          index: localStorage.getItem(`${task.id}`),
        })),
      };
    }
    default:
      return state;
  }
};
