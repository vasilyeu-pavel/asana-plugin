import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from 'shards-react';
import Ava from '../Ava/Ava';

import { getUsers } from '../../utils/asanaRequests';

const AssignedForm = ({ assigned, handleAssigned }) => {
  const [open, handleOpen] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const updateChannel = new BroadcastChannel('updateOptionsDataEvent');
    updateChannel.onmessage = ({ data }) => {
      const { users: updatedUsers } = data;
      setUsers(updatedUsers);
    };
    (async () => {
      const usersFromServer = await getUsers();
      setUsers(usersFromServer);
    })();
    return () => updateChannel.close();
  }, []);

  if (!assigned || !users || !users.length) return null;

  return (
    <Dropdown open={open} toggle={() => handleOpen(!open)} group>
      <span onClick={() => handleOpen(!open)}>
        {Object.keys(assigned).length
          ? <Ava {...assigned} />
          : (
            <i className="material-icons" style={{ fontSize: '20px' }}>
                    person_add
            </i>
          )}
      </span>
      <DropdownMenu>
        {
          users.map(user => (
            <DropdownItem key={user.id} onClick={() => handleAssigned(user)}>
              <Ava {...user} />
              {user.name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>

  );
};

AssignedForm.propTypes = {
  assigned: PropTypes.object,
  handleAssigned: PropTypes.func.isRequired,
};

AssignedForm.defaultProps = {
  assigned: {},
};

export default AssignedForm;
