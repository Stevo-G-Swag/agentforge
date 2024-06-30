import React from 'react';
import styled from 'styled-components';
import ChatInterface from '../components/ChatInterface';
import RequirementsSidebar from '../components/RequirementsSidebar';

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

function MainPage() {
  return (
    <MainPageContainer>
      <ChatSection>
        <ChatInterface />
      </ChatSection>
      <SidebarSection>
        <RequirementsSidebar />
      </SidebarSection>
    </MainPageContainer>
  );
}

export default MainPage;