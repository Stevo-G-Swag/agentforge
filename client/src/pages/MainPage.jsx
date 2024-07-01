import React from 'react';
import styled from 'styled-components';
import ChatInterface from '../components/ChatInterface';
import RequirementsSidebar from '../components/RequirementsSidebar';
import KanbanBoard from '../components/KanbanBoard';

const MainPageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ChatSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SidebarSection = styled.div`
  width: 300px;
`;

const KanbanSection = styled.div`
  width: 100%;
`;

function MainPage() {
  return (
    <MainPageContainer>
      <ChatSection>
        <ChatInterface />
      </ChatSection>
      <SidebarSection>
        <RequirementsSidebar />
      </SidebarSection>
      <KanbanSection>
        <KanbanBoard />
      </KanbanSection>
    </MainPageContainer>
  );
}

export default MainPage;