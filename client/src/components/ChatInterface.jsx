import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { updateProjectRequirements } from '../features/projectRequirementsSlice';
import styled from 'styled-components';
import { handleNLU } from '../../services/nluService';

const ChatInterfaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatInputArea = styled.input`
  flex: 1;
  margin: 10px;
  padding: 8px;
  font-size: 16px;
`;

const ChatMessages = styled.div`
  flex: 9;
  overflow-y: auto;
  padding: 10px;
`;

const Message = styled.div`
  padding: 5px;
  margin: 5px;
  border-radius: 10px;
  background-color: #f1f1f1;
`;

function ChatInterface() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const projectRequirements = useSelector(state => state.projectRequirements);

  useEffect(() => {
    // Initialize chat with a welcome message
    setMessages([{ text: 'Hello! How can I assist you with your project today?', isUser: false }]);
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMessage = { text: inputText, isUser: true };
    setMessages([...messages, userMessage]);
    setInputText('');

    try {
      const nluResponse = await handleNLU(inputText);
      const aiMessage = { text: nluResponse, isUser: false };
      setMessages(messages => [...messages, aiMessage]);
      dispatch(updateProjectRequirements({ requirement: nluResponse }));
    } catch (error) {
      console.error('Error in sending message:', error);
      console.error(error.stack);
    }
  };

  return (
    <ChatInterfaceContainer>
      <ChatMessages>
        {messages.map((message, index) => (
          <Message key={index} style={{ alignSelf: message.isUser ? 'flex-end' : 'flex-start' }}>
            {message.text}
          </Message>
        ))}
      </ChatMessages>
      <ChatInputArea
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSend();
          }
        }}
        placeholder="Type your message here..."
      />
    </ChatInterfaceContainer>
  );
}

export default ChatInterface;