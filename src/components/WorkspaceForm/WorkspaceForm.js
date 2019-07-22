import React, { useState, memo } from 'react';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from 'shards-react';

const ProjectsForm = ({ workspaces, handleWorkspace }) => {
  const [open, handleOpen] = useState(false);

  const synchronizeDataEvent = () => {
    const cookies = new Cookies();
    const channel = new BroadcastChannel('synchronizeData');
    channel.postMessage({
      token: cookies.get('access_token'),
      workspace: window.localStorage.getItem('workspace')
    });
  };

  return (
    <Dropdown open={open} toggle={() => handleOpen(!open)}>
      <span className="workspace-toggle">
        <i className="material-icons" onClick={() => handleOpen(!open)}>
          menu
        </i>
      </span>
      <DropdownMenu right={true}>
        {
          workspaces.map(workspace => (
            <DropdownItem
              key={workspace.gid}
              onClick={() => {
                handleOpen(!open);
                window.localStorage.setItem('workspace', workspace.gid);
                handleWorkspace(workspace.gid);
              }}
            >
              <i className="material-icons">business</i>
              {workspace.name}
            </DropdownItem>
          ))
        }
        <DropdownItem
          onClick={() => {
            handleOpen(!open);
            synchronizeDataEvent();
          }}
        >
          <i className="material-icons">sync</i>
          Synchronize data
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

ProjectsForm.propTypes = {
  workspaces: PropTypes.array,
  handleWorkspace: PropTypes.func.isRequired,
};

ProjectsForm.defaultProps = {
  workspaces: [],
};

export default memo(
  ProjectsForm,
  (prevProps, nextProps) => {
    if (prevProps.workspaces.length === nextProps.workspaces.length) {
      return true;
    }
    return false;
  });
