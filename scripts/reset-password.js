const API_BASE_URL = 'https://os-project-server.vercel.app';

let userEmail = null;

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }
    
    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetSubmit);
    }
    
    setupInputValidation();
}

async function handleEmailSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        showError('Please enter your email address.');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }
    
    const submitBtn = document.querySelector('#emailForm .auth-btn');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            userEmail = email;
            showSuccess('Reset code sent successfully! Check your email.');
            moveToStep2();
        } else {
            if (response.status === 404) {
                throw new Error('User not found. Please check your email address.');
            } else if (response.status === 500) {
                throw new Error('Error sending OTP. Please try again later.');
            } else {
                throw new Error(data.message || data.error || 'Failed to send reset code.');
            }
        }
        
    } catch (error) {
        console.error('Send OTP error:', error);
        showError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showLoading(false);
    }
}

async function handleResetSubmit(e) {
    e.preventDefault();
    
    const otp = document.getElementById('otp').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!otp) {
        showError('Please enter the verification code.');
        return;
    }
    
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        showError('Please enter a valid 6-digit code.');
        return;
    }
    
    if (!newPassword || newPassword.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showError('Passwords do not match.');
        return;
    }
    
    const submitBtn = document.querySelector('#resetForm .auth-btn[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.textContent = 'Updating...';
        submitBtn.disabled = true;
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                otp: otp,
                newPassword: newPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('Password reset successfully! Redirecting to login...');
            userEmail = null;
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            if (response.status === 400) {
                throw new Error('Invalid OTP. Please check your code and try again.');
            } else if (response.status === 404) {
                throw new Error('User not found. Please start over.');
            } else if (response.status === 500) {
                throw new Error('Internal server error. Please try again later.');
            } else {
                throw new Error(data.message || data.error || 'Failed to reset password.');
            }
        }
        
    } catch (error) {
        console.error('Password reset error:', error);
        showError(error.message || 'Failed to reset password. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showLoading(false);
    }
}

async function resendOTP() {
    if (!userEmail) {
        showError('Please start over from step 1.');
        return;
    }
    
    const resendBtn = document.querySelector('.auth-btn.secondary');
    const originalText = resendBtn.textContent;
    
    try {
        resendBtn.textContent = 'Sending...';
        resendBtn.disabled = true;
        
        const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: userEmail
            })
        });
        
        if (response.ok) {
            showSuccess('New code sent to your email!');
        } else {
            const data = await response.json();
            throw new Error(data.message || data.error || 'Failed to resend code');
        }
        
    } catch (error) {
        console.error('Resend error:', error);
        showError(error.message || 'Failed to resend code. Please try again.');
    } finally {
        resendBtn.textContent = originalText;
        resendBtn.disabled = false;
    }
}

function moveToStep2() {
    document.getElementById('emailStep').style.display = 'none';
    document.getElementById('otpStep').style.display = 'block';
    
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const line1 = document.getElementById('line1');
    
    if (step1 && step2 && line1) {
        step1.classList.add('completed');
        step1.classList.remove('active');
        step2.classList.add('active');
        line1.classList.add('active');
    }
    
    setTimeout(() => {
        const otpInput = document.getElementById('otp');
        if (otpInput) {
            otpInput.focus();
        }
    }, 100);
}

function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.style.display = show ? 'block' : 'none';
    }
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            animation: slideIn 0.3s ease-out;
        ">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>${type === 'success' ? '✅' : '❌'}</span>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="
                        background: none;
                        border: none;
                        color: white;
                        position: absolute;
                        top: 8px;
                        right: 12px;
                        cursor: pointer;
                        font-size: 20px;
                        opacity: 0.8;
                        line-height: 1;
                    ">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function setupInputValidation() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (isValidEmail(this.value)) {
                this.style.borderColor = '#28a745';
            } else if (this.value.length > 0) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#dee2e6';
            }
        });
        
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showError('Please enter a valid email address.');
            }
        });
    }
    
    const otpInput = document.getElementById('otp');
    if (otpInput) {
        otpInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length === 6) {
                this.style.borderColor = '#28a745';
            } else if (this.value.length > 0) {
                this.style.borderColor = '#007bff';
            } else {
                this.style.borderColor = '#dee2e6';
            }
        });
        
        otpInput.addEventListener('input', function() {
            if (this.value.length === 6) {
                const newPasswordInput = document.getElementById('newPassword');
                if (newPasswordInput) {
                    newPasswordInput.focus();
                }
            }
        });
    }
    
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            if (this.value.length >= 6) {
                this.style.borderColor = '#28a745';
            } else if (this.value.length > 0) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#dee2e6';
            }
            
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validatePasswordMatch();
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    
    function validatePasswordMatch() {
        const newPass = newPasswordInput.value;
        const confirmPass = confirmPasswordInput.value;
        
        if (confirmPass && newPass === confirmPass) {
            confirmPasswordInput.style.borderColor = '#28a745';
        } else if (confirmPass) {
            confirmPasswordInput.style.borderColor = '#dc3545';
        } else {
            confirmPasswordInput.style.borderColor = '#dee2e6';
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
    
    .notification button:hover {
        opacity: 1 !important;
        background: rgba(255,255,255,0.2) !important;
        border-radius: 50% !important;
    }
    
    .loading::after {
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

window.resendOTP = resendOTP;

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('emailStep').style.display !== 'none') {
        const emailForm = document.getElementById('emailForm');
        if (emailForm) {
            emailForm.dispatchEvent(new Event('submit'));
        }
    }
    
    if (e.key === 'Enter' && document.getElementById('otpStep').style.display !== 'none') {
        const resetForm = document.getElementById('resetForm');
        if (resetForm) {
            resetForm.dispatchEvent(new Event('submit'));
        }
    }
    
    if (e.key === 'Escape' && document.getElementById('otpStep').style.display !== 'none') {
        const confirmed = confirm('Go back to email step? Your progress will be lost.');
        if (confirmed) {
            location.reload();
        }
    }
});
