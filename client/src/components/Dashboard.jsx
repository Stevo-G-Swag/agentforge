import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const Dashboard = () => {
  const tasks = useSelector(state => state.tasks);
  const [codeSuggestions, setCodeSuggestions] = useState([]);

  const data = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      label: 'Task Status',
      data: [tasks.completed.length, tasks.inProgress.length, tasks.pending.length],
      backgroundColor: ['#63ed7a', '#ffa426', '#fc544b'],
      hoverOffset: 4
    }]
  };

  const handleCodeSuggestions = async () => {
    try {
      const response = await axios.post('/deploy/code-suggestions', { codeContent: 'Your code here' });
      setCodeSuggestions(response.data);
      console.log('Code suggestions received:', response.data);
    } catch (error) {
      console.error('Error fetching code suggestions:', error);
      console.error(error.stack);
    }
  };

  return (
    <div>
      <h1>Project Management Dashboard</h1>
      <Doughnut data={data} />
      <button onClick={handleCodeSuggestions}>Get Code Suggestions</button>
      <div>
        {codeSuggestions.length > 0 && (
          <ul>
            {codeSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion.description}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;