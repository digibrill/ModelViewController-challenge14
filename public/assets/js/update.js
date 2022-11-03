const updateNote = async () => {
  const id = location.href.substring(31);
  const devnotetitle = document.getElementById('name').value.trim();
  const devnotebody = document.getElementById('devnote_body').value.trim();
  const response = await fetch('/api/users/devnotes/' + id, {
    method: 'PUT',
    body: JSON.stringify({ id, devnotetitle, devnotebody }),
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => {
    document.location.replace('/dashboard');
    console.log(response);
  });
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
