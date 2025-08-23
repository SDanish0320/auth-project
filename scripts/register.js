document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Button animation aur loading state
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
      // Success animation
      submitBtn.textContent = '✅ Account Created!';
      submitBtn.style.background = '#38ef7d';
      
      // Success message aur redirect
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    } else {
      throw new Error(data.message || data.error || 'Registration failed');
    }
  } catch (error) {
    // Error animation
    submitBtn.textContent = '❌ Failed';
    submitBtn.style.background = '#ff4757';
    
    alert('❌ Registration Failed: ' + error.message);
    
    // Button reset after error
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 2000);
  }
});

// Enter key support for form submission
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const form = document.getElementById('registerForm');
    if (form) {
      form.dispatchEvent(new Event('submit'));
    }
  }
});

// Input field visual feedback - Username
document.getElementById('username').addEventListener('input', function() {
  this.style.borderColor = this.value.length > 0 ? '#38ef7d' : '#e1e5e9';
});

// Input field visual feedback - Email
document.getElementById('email').addEventListener('input', function() {
  // Email validation ke liye simple regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(this.value);
  
  if (this.value.length > 0) {
    this.style.borderColor = isValidEmail ? '#38ef7d' : '#ff6b6b';
  } else {
    this.style.borderColor = '#e1e5e9';
  }
});

// Input field visual feedback - Password
document.getElementById('password').addEventListener('input', function() {
  const isStrongPassword = this.value.length >= 6;
  
  if (this.value.length > 0) {
    this.style.borderColor = isStrongPassword ? '#38ef7d' : '#ff6b6b';
  } else {
    this.style.borderColor = '#e1e5e9';
  }
});