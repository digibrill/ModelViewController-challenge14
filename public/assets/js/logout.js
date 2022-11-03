const logout = async () => {
  document.logout_form.submit(); return false;
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

const login = () => document.location.replace('/login');

document.querySelector('#home').addEventListener('click', home);
document.querySelector('#dashboard').addEventListener('click', dashboard);
document.querySelector('#login').addEventListener('click', login);
document.querySelector('#logout').addEventListener('click', logout);
