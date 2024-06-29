async function searchComponents() {
  const searchQuery = document.getElementById('searchBox').value;
  const response = await fetch(`/api/components?search=${encodeURIComponent(searchQuery)}`);
  const data = await response.json();
  const componentsList = document.getElementById('componentsList');
  componentsList.innerHTML = data.docs.map(comp => `<div><h3>${comp.name}</h3><p>${comp.description}</p></div>`).join('');
}