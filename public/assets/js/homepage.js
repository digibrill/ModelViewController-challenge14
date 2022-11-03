const newFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#project-name').value.trim();
  const devnote_body = document.querySelector('#project-funding').value.trim();
  const user_id = document.querySelector('#project-desc').value.trim();

  if (email && devnote_body && user_id) {
    const response = await fetch(`/devnotes`, {
      method: 'POST',
      body: JSON.stringify({ email, devnote_body, user_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to create project');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete project');
    }
  }
};

const logout = async () => {
  console.log('logged out profile.js!')
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
};

document.querySelector('#logout_btn').addEventListener('click', logout);

document
  .querySelector('.new-project-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.project-list')
  .addEventListener('click', delButtonHandler);
