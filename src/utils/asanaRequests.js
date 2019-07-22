import Cookies from 'universal-cookie';

import { formatDate } from './formatDate';
import config from '../config';

const cookies = new Cookies();

const redirectToAsana = () => {
  window.location.href = `https://app.asana.com/-/oauth_authorize?client_id=${config.CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(config.REDIRECT_URI)}&scope=default&state=asana_0.q0nl6wxqontjujn2r6w`;
};

const buildSearchParams = (params = {}) => {
  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    searchParams.append(key, val);
  }

  return `?${searchParams}`;
};

export const isLiveToken = () => {
  const opts = {
    headers: new Headers({
      Authorization: `Bearer ${cookies.get('access_token')}`,
    }),
  };

  return fetch('https://app.asana.com/api/1.0/users/me', opts)
    .then((response) => {
      if (response.status === 401) {
        redirectToAsana();
      } else {
        return response.json();
      }
    })
    .then(result => result.data)
    .catch(e => console.log(e));
};

const sendRequest = ({ url, headers, ...fetchOpts } = {}) => {
  const opts = {
    ...fetchOpts,
    headers: new Headers({
      Authorization: `Bearer ${cookies.get('access_token')}`,
      ...headers,
    }),
  };

  return fetch(url, opts)
    .then(response => response.json())
    .then(result => result.data)
    .catch(e => console.log(e));
};

const sendRequestGet = (url, body = {}, headers = {}, options = {}) => sendRequest({
  method: 'GET',
  url: `${url}${buildSearchParams(body)}`,
  headers,
  ...options,
});

const sendRequestUpdate = (url, body = {}, method = 'PUT') => sendRequest({
  method,
  url,
  body: JSON.stringify({ data: body }),
});

export const getUsers = () => sendRequestGet('https://app.asana.com/api/1.0/users', {
  workspace: window.localStorage.getItem('workspace'),
  opt_fields: 'email,gid,id,name,photo,workspaces',
});

export const getTasksForAllProjects = async ({ assigned, user, handleAssigned }) => {
  const userProjects = await sendRequestGet('https://app.asana.com/api/1.0/projects', {
    workspace: window.localStorage.getItem('workspace'),
  });
  const users = await getUsers();

  let userTasks = [];

  const getTasksRequest = async id => await sendRequestGet('https://app.asana.com/api/1.0/tasks', {
    workspace: window.localStorage.getItem('workspace'),
    assignee: id,
    limit: '100',
    opt_fields: 'id,name,assignee_status,completed,completed_at,start_on,due_on,assignee,projects,workspace,tags,created_at',
  });

  if (users.some(({ id }) => id === assigned.id)) {
    userTasks = await getTasksRequest(assigned.id);
  } else {
    userTasks = await getTasksRequest(user.id);
    handleAssigned(user);
  }

  return { userTasks, userProjects };
};

export const updateTask = ({ taskGid, due_on, name, completed }) => sendRequestUpdate(
  `https://app.asana.com/api/1.0/tasks/${taskGid}`,
  {
    due_on,
    name,
    completed,
  },
  'PUT',
);

export const createTask = ({
  taskName, assigned, currentProject, day, user,
}) => sendRequestUpdate(
  'https://app.asana.com/api/1.0/tasks',
  {
    workspace: window.localStorage.getItem('workspace'),
    name: taskName,
    assignee: Object.keys(assigned).length ? assigned : undefined,
    projects: currentProject ? [currentProject.id] : [],
    due_on: formatDate(day),
    opt_fields: 'id,name,assignee_status,completed,completed_at,start_on,due_on,assignee,projects,workspace,tags,created_at',
  },
  'POST',
);

export const getUser = () => sendRequestGet('https://app.asana.com/api/1.0/users/me');

export const getWorkSpaces = () => sendRequestGet('https://app.asana.com/api/1.0/workspaces');
