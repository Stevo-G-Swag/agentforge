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
  } else if (response.status === 403) {
    console.error('CSRF token validation error: invalid CSRF token.');
    console.error(`CSRF token error: CSRF token validation failed. Request ID: ${response.headers.get('X-Request-ID')}`);
    window.location.href = '/login'; // Redirect to login page due to CSRF token error
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

async function fetchCsrfToken() {
  const response = await fetch('/api/csrf-token');
  if (!response.ok) {
    throw new Error('Failed to fetch CSRF token');
  }
  const data = await response.json();
  return data.csrfToken;
}

async function postComponent(name, description, codeSnippet) {
  const csrfToken = await fetchCsrfToken();
  const headers = {
    'Content-Type': 'application/json',
    'CSRF-Token': csrfToken
  };
  const body = JSON.stringify({ name, description, codeSnippet });

  const response = await fetch('/api/components', {
    method: 'POST',
    headers: headers,
    body: body
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to post component: ${error}`);
  }

  return response.json();
}