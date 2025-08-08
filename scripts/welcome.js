function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
const token = localStorage.getItem('authToken');
if (!token) {
  window.location.href = 'login.html';
} else {
  const user = parseJwt(token);
  if (user && user.username) {
    document.getElementById('userData').textContent = `Hello, ${user.username}`;
  } else {
    document.getElementById('userData').textContent = 'Hello, user';
  }
}
function logout() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
}