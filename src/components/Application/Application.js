import React, { useEffect, useState } from 'react';
import TaskLists from '../../pages/TaskLists/TaskLists';
import AsanaContext from '../../context';

import Preloader from '../Preloader/Preloader';
import { isLiveToken, getWorkSpaces } from '../../utils/asanaRequests';

const setAsanaUsers = async (setState) => {
  const user = await isLiveToken();
  const workspaces = await getWorkSpaces();

  setState({ user, workspaces });
};

const Application = () => {
  const [state, setState] = useState({});
  useEffect(() => {
    setAsanaUsers(setState);
  }, []);

  if (!state.user) return <Preloader />;

  return (
    <AsanaContext.Provider
      value={{
        user: state.user,
        workspaces: state.workspaces,
      }}
    >
      <TaskLists changeUsersAndWorkSpace={setState} />
    </AsanaContext.Provider>
  );
};

export default Application;
