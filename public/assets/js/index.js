let devnoteTitle;
let devnoteText;
let saveDevnoteBtn;
let newDevnoteBtn;
let devnoteList;

if (window.location.pathname === '/dashboard') {
  devnoteTitle = document.querySelector('#name');
  devnoteText = document.querySelector('#devnote_body');
  saveDevnoteBtn = document.querySelector('.save-note');
}


const userLogin = () =>
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  
const saveDevnote = (devnote) => {
  const name = devnoteTitle.value;
  const devnote_body = devnoteText.value;
  fetch('/api/users/devnotes', {
    method: 'POST',
    body: JSON.stringify({name, devnote_body}),
    headers: { 'Content-Type': 'application/json' },
  });
}

const saveUser = (user) =>
  fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

const deleteDevnote = (id) =>
  fetch(`/devnotes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

if (window.location.pathname === '/dashboard') {
  saveDevnoteBtn.addEventListener('click', saveDevnote);
}
