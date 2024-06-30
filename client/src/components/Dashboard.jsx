import React from 'react';
import { useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';

const Dashboard = () => {
  const tasks = useSelector(state => state.tasks);

  const data = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      label: 'Task Status',
      data: [tasks.completed.length, tasks.inProgress.length, tasks.pending.length],
      backgroundColor: ['#63ed7a', '#ffa426', '#fc544b'],
      hoverOffset: 4
    }]
  };

  return (
    <div>
      <h1>Project Management Dashboard</h1>
      <Doughnut data={data} />
    </div>
  );
};

export default Dashboard;