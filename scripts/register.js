document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
 
  const submitBtn = document.querySelector('.auth-btn.primary');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Creating Account...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch('https://os-project-server.vercel.app/auth/newuser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
   
      submitBtn.textContent = '✅ Account Created!';
      submitBtn.style.background = '#38ef7d';
      
      
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    } else {
      throw new Error(data.message || data.error || 'Registration failed');
    }
  } catch (error) {

    submitBtn.textContent = '❌ Failed';
    submitBtn.style.background = '#ff4757';
    
    alert('❌ Registration Failed: ' + error.message);
    
    
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 2000);
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const form = document.getElementById('registerForm');
    if (form) {
      form.dispatchEvent(new Event('submit'));
    }
  }
});


document.getElementById('username').addEventListener('input', function() {
  this.style.borderColor = this.value.length > 0 ? '#38ef7d' : '#e1e5e9';
});


document.getElementById('email').addEventListener('input', function() {
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(this.value);
  
  if (this.value.length > 0) {
    this.style.borderColor = isValidEmail ? '#38ef7d' : '#ff6b6b';
  } else {
    this.style.borderColor = '#e1e5e9';
  }
});


document.getElementById('password').addEventListener('input', function() {
  const isStrongPassword = this.value.length >= 6;
  
  if (this.value.length > 0) {
    this.style.borderColor = isStrongPassword ? '#38ef7d' : '#ff6b6b';
  } else {
    this.style.borderColor = '#e1e5e9';
  }
});