document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    const res = await fetch('https://os-project-server.vercel.app/auth/existinguser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('authToken', data.token);
      window.location.href = 'welcome.html';
    } else {
      alert(data.message || data.error || 'Login failed');
    }
  } catch (error) {
    alert('❌ Login failed');
  }
});