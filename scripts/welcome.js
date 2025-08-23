// JWT Parser function
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

// Initialize dashboard
function initializeDashboard() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const user = parseJwt(token);
  
  if (user && user.username) {
    // Update navigation user info
    const userAvatarElement = document.getElementById('userAvatar');
    const userNameElement = document.getElementById('userName');
    const welcomeTitleElement = document.getElementById('welcomeTitle');
    
    if (userAvatarElement) {
      userAvatarElement.textContent = user.username.charAt(0).toUpperCase();
    }
    
    if (userNameElement) {
      userNameElement.textContent = user.username;
    }
    
    if (welcomeTitleElement) {
      welcomeTitleElement.textContent = `Welcome back, ${user.username}!`;
    }
    
    // Update profile section
    const profileUsernameElement = document.getElementById('profileUsername');
    const profileEmailElement = document.getElementById('profileEmail');
    
    if (profileUsernameElement) {
      profileUsernameElement.textContent = user.username;
    }
    
    if (profileEmailElement) {
      profileEmailElement.textContent = user.email || 'Not available';
    }
    
    // Set member since date
    const memberSinceElement = document.getElementById('memberSince');
    const accountCreatedElement = document.getElementById('accountCreated');
    
    if (memberSinceElement || accountCreatedElement) {
      const memberSince = user.iat ? new Date(user.iat * 1000).toLocaleDateString() : new Date().toLocaleDateString();
      
      if (memberSinceElement) {
        memberSinceElement.textContent = memberSince;
      }
      
      if (accountCreatedElement) {
        accountCreatedElement.textContent = memberSince;
      }
    }
    
    // Set last login
    const lastLoginElement = document.getElementById('lastLogin');
    if (lastLoginElement) {
      lastLoginElement.textContent = new Date().toLocaleDateString();
    }
  } else {
    // Fallback for users without proper token
    const userNameElement = document.getElementById('userName');
    const welcomeTitleElement = document.getElementById('welcomeTitle');
    
    if (userNameElement) {
      userNameElement.textContent = 'Guest User';
    }
    
    if (welcomeTitleElement) {
      welcomeTitleElement.textContent = 'Welcome to your dashboard!';
    }
  }
}

// Navigation Functions
function showOverview() {
  hideAllSections();
  document.getElementById('overviewSection').style.display = 'block';
  updateActiveNav('Overview');
}

function showProfile() {
  hideAllSections();
  document.getElementById('profileSection').style.display = 'block';
  updateActiveNav('Profile');
}

function showSettings() {
  hideAllSections();
  document.getElementById('settingsSection').style.display = 'block';
  updateActiveNav('Settings');
}

function showSecurity() {
  hideAllSections();
  document.getElementById('securitySection').style.display = 'block';
  updateActiveNav('Security');
}

function showActivity() {
  hideAllSections();
  document.getElementById('activitySection').style.display = 'block';
  updateActiveNav('Activity');
}

function hideAllSections() {
  const sections = ['overviewSection', 'profileSection', 'settingsSection', 'securitySection', 'activitySection'];
  sections.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'none';
    }
  });
}

function updateActiveNav(activeSection) {
  // Remove active class from all nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.style.color = '#6c757d';
    link.style.background = 'transparent';
  });
  
  // Add active style to current section
  const activeLink = Array.from(navLinks).find(link => 
    link.textContent.trim() === activeSection
  );
  
  if (activeLink) {
    activeLink.style.color = '#007bff';
    activeLink.style.background = '#f8f9fa';
  }
}

// Modal Functions
function editProfile() {
  const modal = document.getElementById('profileModal');
  if (modal) {
    // Pre-fill form with current data
    const token = localStorage.getItem('authToken');
    const user = parseJwt(token);
    
    if (user) {
      const editEmailField = document.getElementById('editEmail');
      if (editEmailField && user.email) {
        editEmailField.value = user.email;
      }
    }
    
    modal.classList.add('show');
  }
}

function closeModal() {
  const modal = document.getElementById('profileModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// Action Functions
function refreshData() {
  const btn = event.target;
  const originalText = btn.textContent;
  
  btn.textContent = 'Refreshing...';
  btn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    btn.textContent = '✅ Refreshed';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  }, 1000);
}

function saveSettings() {
  const btn = event.target;
  const originalText = btn.textContent;
  
  btn.textContent = 'Saving...';
  btn.disabled = true;
  
  setTimeout(() => {
    btn.textContent = '✅ Saved';
    alert('✅ Settings saved successfully!');
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  }, 1000);
}

function changePassword() {
  const confirmed = confirm('🔒 Change Password\n\nThis will redirect you to the password reset page.\n\nContinue?');
  
  if (confirmed) {
    localStorage.removeItem('authToken');
    window.location.href = 'reset-password.html';
  }
}

function exportData() {
  const token = localStorage.getItem('authToken');
  const user = parseJwt(token);
  
  const exportData = {
    username: user?.username || 'Unknown',
    email: user?.email || 'Unknown',
    accountCreated: user?.iat ? new Date(user.iat * 1000).toISOString() : new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    dataExported: new Date().toISOString(),
    securityLevel: 'High',
    loginAttempts: 0,
    activeSessions: 1
  };
  
  // Create downloadable file
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `account-data-${user?.username || 'user'}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
  
  alert('📦 Data Export Complete!\n\nYour account data has been downloaded as a JSON file.');
}

function clearActivity() {
  const confirmed = confirm('🗑️ Clear Activity History\n\nThis will remove all activity logs. This action cannot be undone.\n\nContinue?');
  
  if (confirmed) {
    alert('✅ Activity history cleared successfully!');
    // Here you would typically make an API call to clear the history
  }
}

function logout() {
  const confirmed = confirm('👋 Are you sure you want to logout?');
  
  if (confirmed) {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    alert('✅ Successfully logged out!\n\nSee you again soon! 👋');
    window.location.href = 'login.html';
  }
}

// Enhanced error handling
function handleTokenExpiry() {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    const user = parseJwt(token);
    
    if (user && user.exp && user.exp < Date.now() / 1000) {
      alert('⚠️ Session Expired\n\nYour session has expired. Please login again.');
      localStorage.removeItem('authToken');
      window.location.href = 'login.html';
      return false;
    }
  }
  
  return true;
}

// Auto-refresh functionality
function startAutoRefresh() {
  setInterval(() => {
    if (!handleTokenExpiry()) {
      return;
    }
    
    // Update last activity time
    const lastLoginElement = document.getElementById('lastLogin');
    if (lastLoginElement) {
      lastLoginElement.textContent = new Date().toLocaleDateString();
    }
  }, 60000); // 1 minute
}

// Setup event listeners
function setupEventListeners() {
  // Modal close on outside click
  const profileModal = document.getElementById('profileModal');
  if (profileModal) {
    profileModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
  }
  
  // Profile form submission
  const profileForm = document.querySelector('#profileModal form');
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fullName = document.getElementById('editFullName').value;
      const email = document.getElementById('editEmail').value;
      const phone = document.getElementById('editPhone').value;
      const location = document.getElementById('editLocation').value;
      
      // Simulate API call
      const submitBtn = this.querySelector('.auth-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Saving...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert('✅ Profile updated successfully!');
        closeModal();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
      closeModal();
    }
    
    // Alt shortcuts for navigation
    if (e.altKey) {
      switch(e.key) {
        case '1':
          e.preventDefault();
          showOverview();
          break;
        case '2':
          e.preventDefault();
          showProfile();
          break;
        case '3':
          e.preventDefault();
          showSettings();
          break;
        case '4':
          e.preventDefault();
          showSecurity();
          break;
        case '5':
          e.preventDefault();
          showActivity();
          break;
        case 'l':
          e.preventDefault();
          logout();
          break;
      }
    }
  });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize dashboard
  initializeDashboard();
  handleTokenExpiry();
  startAutoRefresh();
  
  // Show overview by default
  showOverview();
  
  // Setup event listeners
  setupEventListeners();
  
  // Show helpful tooltip for first-time users
  setTimeout(() => {
    if (localStorage.getItem('dashboardTourComplete') !== 'true') {
      const helpMessage = `🎉 Welcome to your Dashboard!

💡 Navigation Tips:
• Use the top navigation to switch between sections
• Alt+1-5 for quick navigation
• Alt+L to logout quickly
• ESC to close modals

Click around and explore!`;
      
      alert(helpMessage);
      localStorage.setItem('dashboardTourComplete', 'true');
    }
  }, 1500);
});

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
  initializeDashboard();
}