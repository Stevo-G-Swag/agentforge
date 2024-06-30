const socket = io();

const codeEditor = document.getElementById('codeEditor');
const saveCode = document.getElementById('saveCode');

socket.on('codeUpdated', (data) => {
  codeEditor.value = data.code;
});

codeEditor.addEventListener('input', () => {
  socket.emit('modifyCode', { code: codeEditor.value });
});

saveCode.addEventListener('click', () => {
  // Implement saving logic or further processing
  alert('Code changes saved!');
});