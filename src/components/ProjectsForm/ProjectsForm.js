import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'shards-react';

const ProjectsForm = ({ projects, setCurrentProject, currentProject }) => {
  const [open, handleOpen] = useState(false);

  return (
    <Dropdown open={open} toggle={() => handleOpen(!open)}>
      <DropdownToggle theme="success">
        {!currentProject ? 'Projects' : currentProject.name}
      </DropdownToggle>
      <DropdownMenu>
        {
          projects.map(project => (
            <DropdownItem
              key={project.id}
              onClick={() => {
                handleOpen(!open);
                setCurrentProject(project);
              }}
            >
              <i className="material-icons">
                folder_open
              </i>
              {project.name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  );
};

ProjectsForm.propTypes = {
  projects: PropTypes.array,
  currentProject: PropTypes.object,
  setCurrentProject: PropTypes.func.isRequired,
};

ProjectsForm.defaultProps = {
  assigned: [],
  projects: [],
  currentProject: {},
};

export default memo(ProjectsForm);
