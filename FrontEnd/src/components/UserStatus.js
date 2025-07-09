import React from 'react';

function UserStatus({ activeUsers, updatedAt }) {
  return (
    <div className="user-status">
      <span>{activeUsers} active collaborator{activeUsers !== 1 ? 's' : ''}</span>
      <span>Last updated: {updatedAt}</span>
    </div>
  );
}

export default UserStatus;