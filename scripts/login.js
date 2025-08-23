document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
 
  const submitBtn = document.querySelector('.auth-btn.primary');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Signing In...';
  submitBtn.disabled = true;
  
  try {
    const res = await fetch('https://os-project-server.vercel.app/auth/existinguser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    
    if (res.ok && data.token) {
      localStorage.setItem('authToken', data.token);
      

      submitBtn.textContent = '✅ Success!';
      submitBtn.style.background = '#38ef7d';
      
   
      setTimeout(() => {
        window.location.href = 'welcome.html';
      }, 1000);
    } else {
      throw new Error(data.message || data.error || 'Login failed');
    }
  } catch (error) {

    submitBtn.textContent = '❌ Failed';
    submitBtn.style.background = '#ff4757';
    
    alert('❌ Login Failed: ' + error.message);
    

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 2000);
  }
});


document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const form = document.getElementById('loginForm');
    if (form) {
      form.dispatchEvent(new Event('submit'));
    }
  }
});


document.getElementById('username').addEventListener('input', function() {
  this.style.borderColor = this.value.length > 0 ? '#38ef7d' : '#e1e5e9';
});

document.getElementById('password').addEventListener('input', function() {
  this.style.borderColor = this.value.length > 0 ? '#38ef7d' : '#e1e5e9';
});