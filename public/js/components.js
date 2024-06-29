async function searchComponents() {
  const searchQuery = document.getElementById('searchBox').value;
  const csrfToken = document.querySelector('input[name="_csrf"]').value;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'CSRF-Token': csrfToken
  };

  const response = await fetch(`/api/components?search=${encodeURIComponent(searchQuery)}`, { headers });

  if (response.status === 401) {
    console.error('Authentication error: User is not authenticated.');
    console.error(`Authentication error: User session not found. Request ID: ${response.headers.get('X-Request-ID')}`);
    window.location.href = '/login'; // Redirect to login page
    return;
  }

  try {
    const data = await response.json();
    const componentsList = document.getElementById('componentsList');
    componentsList.innerHTML = data.docs.map(comp => `<div><h3>${comp.name}</h3><p>${comp.description}</p></div>`).join('');
  } catch (error) {
    console.error('Error processing JSON:', error);
    console.error(error.stack);
  }
}