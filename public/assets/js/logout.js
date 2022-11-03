const logout = async () => {
  const response = await fetch('/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/homepage');
  } else {
    alert(response.statusText);
  }
};
const home = () => document.location.replace('/homepage');

const dashboard = () => document.location.replace('/dashboard');

document.querySelector('#home').addEventListener('click', home);
document.querySelector('#dashboard').addEventListener('click', dashboard);
document.querySelector('#logout').addEventListener('click', logout);
