import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeRequirement, updateRequirement } from '../features/projectRequirementsSlice';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 300px;
  background-color: #f4f4f4;
  height: 100vh;
  overflow-y: auto;
`;

const RequirementCard = styled.div`
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: grab;
`;

function RequirementsSidebar() {
  const requirements = useSelector(state => state.projectRequirements.requirements);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(removeRequirement({ id }));
  };

  const handleEdit = (id, newRequirement) => {
    dispatch(updateRequirement({ id, requirement: newRequirement }));
  };

  const [, drop] = useDrop(() => ({
    accept: 'requirement',
    drop: (item) => handleEdit(item.id, item.requirement),
  }));

  return (
    <SidebarContainer ref={drop}>
      {requirements.map((req, index) => (
        <RequirementCard key={req.id}>
          <div>
            <strong>Requirement:</strong> {req.requirement}
          </div>
          <button onClick={() => handleDelete(req.id)}>Delete</button>
          <button onClick={() => handleEdit(req.id, prompt('Edit requirement:', req.requirement))}>Edit</button>
        </RequirementCard>
      ))}
    </SidebarContainer>
  );
}

export default RequirementsSidebar;