document.getElementById('deployBtn').addEventListener('click', async function() {
  const response = await fetch('/deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ codePath: 'path/to/code' })
  });

  const data = await response.json();
  document.getElementById('deploymentStatus').innerText = `Deployment Status: ${data.status}`;
});