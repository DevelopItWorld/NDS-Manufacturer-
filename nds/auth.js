// ============ AUTHENTICATION SYSTEM (PHP + MySQL Backend) ============

// API configuration
const API_BASE = './';

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Check if session exists (verify.php)
    checkSessionStatus().then(isLoggedIn => {
        // If not logged in and not on auth page, redirect to auth
        if (!isLoggedIn && currentPage !== 'auth.html' && currentPage !== '') {
            window.location.href = 'auth.html';
        }

        // Auth page functionality
        if (currentPage === 'auth.html') {
            setupAuthPage();
        }

        // Add logout button to header if user is logged in
        if (isLoggedIn) {
            addLogoutButton();
        }
    });
});

// Check session status with backend
async function checkSessionStatus() {
    try {
        const response = await fetch(API_BASE + 'verify.php', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        return data.success && data.loggedIn;
    } catch (error) {
        console.log('Session check failed:', error);
        return false;
    }
}

// Get current user data
async function getCurrentUser() {
    try {
        const response = await fetch(API_BASE + 'verify.php', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        if (data.success && data.loggedIn) {
            return data.user;
        }
        return null;
    } catch (error) {
        console.log('Error fetching user:', error);
        return null;
    }
}

// Setup authentication page
function setupAuthPage() {
    const loginForm = document.getElementById('loginFormElement');
    const signupForm = document.getElementById('signupFormElement');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
        const response = await fetch(API_BASE + 'login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password,
                rememberMe: rememberMe
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showToast(data.message || 'Login failed. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Connection error. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();

    const firstName = document.getElementById('signupFirstName').value.trim();
    const lastName = document.getElementById('signupLastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const company = document.getElementById('signupCompany').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validate
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    if (!agreeTerms) {
        showToast('Please agree to Terms of Service and Privacy Policy', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    try {
        const response = await fetch(API_BASE + 'register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                company: company,
                password: password,
                confirmPassword: confirmPassword
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showToast(data.message || 'Signup failed. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    } catch (error) {
        console.error('Signup error:', error);
        showToast('Connection error. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Toggle between Login and Signup forms
function toggleForms(e) {
    e.preventDefault();

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');

    // Clear forms
    if (document.getElementById('loginFormElement')) {
        document.getElementById('loginFormElement').reset();
    }
    if (document.getElementById('signupFormElement')) {
        document.getElementById('signupFormElement').reset();
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = event.currentTarget;
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add logout button to header
async function addLogoutButton() {
    const currentUser = await getCurrentUser();
    const headerButtons = document.querySelector('.header-buttons');

    if (headerButtons && currentUser) {
        // Remove old sign in button
        const signInBtn = headerButtons.querySelector('.btn-outline');
        if (signInBtn) {
            signInBtn.remove();
        }

        // Add user profile and logout
        const userMenuHTML = `
            <div class="user-menu">
                <button class="user-btn">
                    <i class="fas fa-user-circle"></i>
                    <span>${currentUser.name.split(' ')[0]}</span>
                </button>
                <div class="dropdown-menu">
                    <div class="user-info">
                        <p class="user-name">${currentUser.name}</p>
                        <p class="user-email">${currentUser.email}</p>
                    </div>
                    <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid rgba(255,255,255,0.1);">
                    <a href="#" onclick="handleLogout(event)" class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            </div>
        `;

        headerButtons.innerHTML += userMenuHTML;

        // Add dropdown toggle functionality
        const userBtn = document.querySelector('.user-btn');
        if (userBtn) {
            userBtn.addEventListener('click', function() {
                const menu = document.querySelector('.dropdown-menu');
                menu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                const menu = document.querySelector('.dropdown-menu');
                if (!event.target.closest('.user-menu')) {
                    menu.classList.remove('show');
                }
            });
        }
    }
}

// Handle Logout
async function handleLogout(e) {
    e.preventDefault();

    try {
        const response = await fetch(API_BASE + 'logout.php', {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
            showToast('Logged out successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 1000);
        }
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = 'auth.html';
    }
}
