document.getElementById('deployBtn').addEventListener('click', async function(event) {
  event.preventDefault(); // Prevent default form submission behavior
  const token = document.querySelector('input[name="_csrf"]').value;
  const response = await fetch('/deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': token
    },
    body: JSON.stringify({ codePath: 'path/to/code' })
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('Deployment error:', data);
    document.getElementById('deploymentStatus').innerText = `Error: ${data.message}`;
  } else {
    document.getElementById('deploymentStatus').innerText = `Deployment Status: ${data.status}`;
  }
});