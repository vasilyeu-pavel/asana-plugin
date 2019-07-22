import React, {
  useEffect, useState, useReducer, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'shards-react';
import TaskList from '../../components/TaskList/TaskList';
import MainNavBar from '../../components/layout/MainNavbar/MainNavbar';
import Preloader from '../../components/Preloader/Preloader';
import { getTasksForAllProjects } from '../../utils/asanaRequests';

import AsanaContext from '../../context';

import Error from '../Error/Error';
import { initialStateTasks, tasksReducer } from '../../reducers';

import './TaskList.scss';

const getWorkspaceFromLocalStore = (workspaces) => {
  let workspaceGid = window.localStorage.getItem('workspace');
  if (!workspaceGid) {
    window.localStorage.setItem('workspace', workspaces[0].gid);
    workspaceGid = workspaces[0].gid;
  }

  return workspaceGid;
};

const TaskLists = ({ changeUsersAndWorkSpace }) => {
  let _isMounted = true;
  // react hooks
  const { user, workspaces } = useContext(AsanaContext);
  const [assigned, handleAssigned] = useState(user);
  const [workspace, handleWorkspace] = useState(getWorkspaceFromLocalStore(workspaces));
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState({});
  const [currentProject, setCurrentProject] = useState(null);

  const [{ tasks, loading }, dispatch] = useReducer(tasksReducer, initialStateTasks);

  useEffect(() => {
    dispatch({ type: 'START_REQUEST' });
    const channel = new BroadcastChannel('updatedTasks');

    // update task in app, if was changed in server (from background request)
    channel.onmessage = ({ data: updatedTasksFromServer }) => {
      dispatch({
        type: 'SET_TASKS',
        payload: updatedTasksFromServer,
      });
    };

    const updateChannel = new BroadcastChannel('updateOptionsDataEvent');

    // update projects, users, workspaces in app, if was changed in server (from background request)
    updateChannel.onmessage = ({ data }) => {
      const { workspaces: updatedWorkspaces, projects: updatedProjects, user: updatedUser } = data;
      setProjects(updatedProjects);
      changeUsersAndWorkSpace({ user: updatedUser, workspaces: updatedWorkspaces });
    };
    (async () => {
      try {
        const { userTasks, userProjects } = await getTasksForAllProjects({ assigned, user, handleAssigned });

        if (_isMounted) {
          setProjects(userProjects);
          setCurrentProject(userProjects[0]);
          dispatch({
            type: 'SET_TASKS',
            payload: userTasks,
          });
        }
      } catch (e) {
        setError(e);
      }
    })();
    return () => {
      channel.close();
      updateChannel.close();
      _isMounted = false;
    };
  }, [assigned, workspace]);

  if (Object.keys(error).length) return (<Error error={error.message} />);

  if (loading || !projects.length) return <Preloader />;
  return (
    <>
      <MainNavBar
        assigned={assigned}
        handleAssigned={handleAssigned}
        projects={projects}
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
        workspaces={workspaces}
        handleWorkspace={handleWorkspace}
      />
      <Container fluid>
        <Row>
          <Col tag="main" className="main-content p-0" lg="12" md="12" sm="12">
            <Container fluid className="main-content-container px-4">
              <TaskList
                tasks={tasks}
                projects={projects}
                assigned={assigned}
                currentProject={currentProject}
                dispatchTask={dispatch}
              />
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

TaskLists.propTypes = {
  changeUsersAndWorkSpace: PropTypes.func.isRequired,
};

export default TaskLists;
