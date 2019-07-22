import React from 'react';
import PropTypes from 'prop-types';
import { Container, Navbar, Badge } from 'shards-react';
import { getMonthName } from '../../../utils/createCalendar';

import AssignedForm from '../../AssignedForm/AssignedForm';
import ProjectsForm from '../../ProjectsForm/ProjectsForm';
import WorkspaceForm from '../../WorkspaceForm/WorkspaceForm';

const MainNavbar = ({
  assigned, handleAssigned, projects, currentProject, setCurrentProject, handleWorkspace, workspaces,
}) => (
  <div className="main-navbar bg-white sticky-top">
    <Container fluid className="px-4">
      <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
        <div className="assigned-form col d-flex mb-sm-0 col-sm-8">
          <div className="d-table">
            <AssignedForm
              assigned={assigned}
              handleAssigned={handleAssigned}
            />
          </div>
          <div className="projects-form col d-flex mb-sm-0 col-sm-8">
            <ProjectsForm
              projects={projects}
              currentProject={currentProject}
              setCurrentProject={setCurrentProject}
            />
          </div>
        </div>
        <div
          className="input-group-append"
          style={{
            alignItems: 'center',
          }}
        >
          <Badge pill theme="info">
            {getMonthName()}
          </Badge>
          <WorkspaceForm
            workspaces={workspaces}
            handleWorkspace={handleWorkspace}
          />
        </div>
      </Navbar>
    </Container>
  </div>
);

MainNavbar.propTypes = {
  assigned: PropTypes.object,
  currentProject: PropTypes.object,
  projects: PropTypes.array,
  workspaces: PropTypes.array,
  handleAssigned: PropTypes.func.isRequired,
  setCurrentProject: PropTypes.func.isRequired,
  handleWorkspace: PropTypes.func.isRequired,
};

MainNavbar.defaultProps = {
  assigned: {},
  currentProject: {},
  projects: [],
  workspaces: [],
};

export default MainNavbar;
