importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

if (workbox) {
  console.log('Yay! Workbox is loaded 🎉');
} else {
  console.log('Boo! Workbox didn\'t load 😬');
}

const filesToCache = [
  'index.html',
  'favicon.ico',
];

const expectedCaches = ['asana-cache-v3-all', 'asana-cache-v3-tasks', 'asana-cache-v3-other-data'];

self.addEventListener('install', (event) => {
  console.log(`Installing ${expectedCaches[0]}`);
  event.waitUntil(
    caches.open(expectedCaches[0])
      .then(cache => cache.addAll(filesToCache))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  // delete any caches that aren't in expectedCaches
  // which will get rid of static-v1
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map((key) => {
          if (!expectedCaches.includes(key)) {
            return caches.delete(key);
          }
        }),
      )),
  );
});

workbox.routing.registerRoute(/\.(?:html|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: expectedCaches[0],
  }),
);

workbox.routing.registerRoute(/\.(?:png|gif|jpg)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: expectedCaches[0],
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  new RegExp('^https://app.asana.com/api/1.0/users/me'),
  new workbox.strategies.NetworkOnly(),
  'GET',
);

const updateTasksInCache = async (request, cacheIndex) => {
  const parsedUrl = request.url.split('/');
  const taskId = parsedUrl[parsedUrl.length - 1];

  const response = await fetch(request);

  const cache = await caches.open(expectedCaches[cacheIndex]);

  const [tasksKeyInCache] = await cache.keys();

  const copiedResponse = response.clone();

  // write to cache if not exists
  if (!tasksKeyInCache) {
    cache.put(request.url, copiedResponse);
    return response;
  }

  const tasksResponseFromCache = await cache.match(tasksKeyInCache);

  const { data: tasksFromCache, ...args } = await tasksResponseFromCache.json();

  const { data: taskFromServer } = await copiedResponse.json();

  if (!tasksFromCache.length) {
    return response;
  }

  const filteredTasks = tasksFromCache.filter(({ id }) => id !== +taskId);

  const updateResponse = new Response(JSON.stringify({
    data: [...filteredTasks, taskFromServer],
    ...args,
  }));

  cache.put(tasksKeyInCache, updateResponse);

  return response;
};

const getTasksFromCache = async (request, cacheIndex) => {
  const cache = await caches.open(expectedCaches[cacheIndex]);
  const [tasksKeyInCache] = await cache.keys();

  const tasksResponseFromCache = await cache.match(tasksKeyInCache);

  if (!tasksResponseFromCache) {
    const response = await fetch(request);

    const copiedResponse = response.clone();
    cache.put(request.url, copiedResponse);
    console.log(`Tasks unincludes in cache, return tasks list from request ${request.url}`);
    return response;
  }
  console.log(`Tasks includes in cache, return tasks list from cache ${request.url}`);
  return tasksResponseFromCache;
};

const compareTasks = (tasksFromCache, tasksFromServer) => {
  let compare = false;
  tasksFromCache.forEach((taskFromCache) => {
    const taskFromServer = tasksFromServer.find(({ id: idTaskFromServer }) => taskFromCache.id === idTaskFromServer);
    if (!taskFromServer) compare = true;

    const { assignee: assigneeS, completed: completedS, due_on: due_onS, name: nameS } = taskFromServer;
    const { assignee: assigneeC, completed: completedC, due_on: due_onC, name: nameC } = taskFromCache;

    if (completedS !== completedC || due_onS !== due_onC || nameS !== nameC || assigneeS.id !== assigneeC.id) {
      compare = true;
    }
  });

  return compare;
};

const createUpdateTasksEvent = async (request, cacheIndex) => {
  const cache = await caches.open(expectedCaches[cacheIndex]);
  const [tasksKeyInCache] = await cache.keys();

  const tasksResponseFromCache = await cache.match(tasksKeyInCache);
  const response = await fetch(request);
  const copiedResponse = response.clone();

  if (!tasksResponseFromCache) return;

  const { data: tasksFromCache, ...args } = await tasksResponseFromCache.json();

  const { data: taskFromServer } = await copiedResponse.json();

  if (tasksFromCache.length !== taskFromServer.length
    || compareTasks(tasksFromCache, taskFromServer)
  ) {
    cache.put(request.url, response);
    const channel = new BroadcastChannel('updatedTasks');
    console.log('Message to client -> WAS UPDATED TASKS');
    channel.postMessage(taskFromServer);
  }
};

const getResponseFromCache = async (request, cacheIndex) => {
  const cache = await caches.open(expectedCaches[cacheIndex]);
  const tasksKeyInCache = await cache.keys();

  if (tasksKeyInCache && tasksKeyInCache.length) {
    const requestFromCache = tasksKeyInCache.find(({ url }) => url === request.url);
    if (requestFromCache) {
      console.log(`Return data from cache ${request.url}`);
     return await cache.match(requestFromCache);
    }
  }

  const response = await fetch(request);
  const copiedResponse = response.clone();

  cache.put(request.url, copiedResponse);
  console.log(`Return data from server and put to cache ${request.url}`);

  return response;
};

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'PUT' || event.request.method === 'POST') {
    event.respondWith(updateTasksInCache(event.request, 1));

  } else if (event.request.method === 'GET' && event.request.url.includes('tasks')) {
    event.respondWith(getTasksFromCache(event.request, 1));
    createUpdateTasksEvent(event.request, 1);

  } else if ((event.request.method === 'GET' && event.request.url.includes('users'))
    || (event.request.method === 'GET' && event.request.url.includes('workspaces'))
    || (event.request.method === 'GET' && event.request.url.includes('projects'))
  ) {
    event.respondWith(getResponseFromCache(event.request, 2));
  }
});

const buildSearchParams = (params = {}) => {
  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    searchParams.append(key, val);
  }

  return `?${searchParams}`;
};

const sendRequest = async ({ url, headers, token, ...fetchOpts } = {}) => {
  const cache = await caches.open(expectedCaches[2]);

  const opts = {
    ...fetchOpts,
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      ...headers,
    }),
  };

  const response = await fetch(url, opts);
  const copiedResponse = response.clone();

  cache.put(url, copiedResponse);

  return await response.json();
};

const sendRequestGet = (url, body = {}, headers = {}, options = {}, token = '') => sendRequest({
  method: 'GET',
  url: `${url}${buildSearchParams(body)}`,
  headers,
  ...options,
  token,
});

const synchronizeChannel = new BroadcastChannel('synchronizeData');

synchronizeChannel.onmessage = async ({ data }) => {
  const { token, workspace } = data;
  const { data: workspaces } = await sendRequestGet(
    'https://app.asana.com/api/1.0/workspaces',
    {},
    {},
    {},
    token,
  );

  const { data: user } = await sendRequestGet(
    'https://app.asana.com/api/1.0/users/me',
    {},
    {},
    {},
    token,
  );

  const { data: users } = await sendRequestGet(
    'https://app.asana.com/api/1.0/users',
    { workspace, opt_fields: 'email,gid,id,name,photo,workspaces' },
    {},
    {},
    token,
  );

  const { data: projects } = await sendRequestGet(
    'https://app.asana.com/api/1.0/projects',
    { workspace },
    {},
    {},
    token,
  );

  const updateChannel = new BroadcastChannel('updateOptionsDataEvent');
  updateChannel.postMessage({ workspaces, users, projects, user });
};
