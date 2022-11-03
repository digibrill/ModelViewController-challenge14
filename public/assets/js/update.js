const updateNote = async () => {
  const response = await fetch('/api/users/devnotes/', {
    method: 'PUT',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }
};

const deleteNote = async () => {
    const id = location.href.substring(31);
    console.log(id);
    const response = await fetch('/api/users/devnotes/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
};
document.querySelector('.updateBtn').addEventListener('click', updateNote);
document.querySelector('.deleteBtn').addEventListener('click', deleteNote);
