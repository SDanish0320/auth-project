document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const response = await fetch('https://os-project-server.vercel.app/auth/newuser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something went wrong');
    alert('✅ Success: ' + data.message);
    window.location.href = 'login.html';
  } catch (error) {
    alert('❌ Registration Failed: ' + error.message);
  }
});