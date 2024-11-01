import React, { useState } from 'react';

interface RoleSelectorProps {
  roles: string[];
  onSelectRole: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ roles, onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value;
    setSelectedRole(role);
    onSelectRole(role);
  };

  const clearSelection = () => {
    setSelectedRole('');
    onSelectRole('');
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <label htmlFor="role" style={{ marginRight: '8px' }}>Assign Role: </label>
      <select id="role" value={selectedRole} onChange={handleChange}>
        <option value="" disabled>Select a role</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      {selectedRole && (
        <button onClick={clearSelection} style={{ marginLeft: '10px' }}>
          Clear
        </button>
      )}
    </div>
  );
};

export default RoleSelector;
