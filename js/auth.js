const Auth = {
  getUsers() {
    return JSON.parse(localStorage.getItem('wander_users') || '{}');
  },
  saveUsers(users) {
    localStorage.setItem('wander_users', JSON.stringify(users));
  },
  getSession() {
    return localStorage.getItem('wander_session');
  },
  setSession(username) {
    localStorage.setItem('wander_session', username);
  },
  clearSession() {
    localStorage.removeItem('wander_session');
  },
  isLoggedIn() {
    return !!this.getSession();
  },
  signup(username, password) {
    if (!username || username.trim().length < 2)
      return { success: false, error: 'Username must be at least 2 characters.' };
    if (!password || password.length < 4)
      return { success: false, error: 'Password must be at least 4 characters.' };
    const users = this.getUsers();
    if (users[username])
      return { success: false, error: 'That username is already taken.' };
    users[username] = { password, bookings: [] };
    this.saveUsers(users);
    this.setSession(username);
    return { success: true };
  },
  signin(username, password) {
    const users = this.getUsers();
    if (!users[username])
      return { success: false, error: 'No account found with that username.' };
    if (users[username].password !== password)
      return { success: false, error: 'Incorrect password.' };
    this.setSession(username);
    return { success: true };
  },
  signout() {
    this.clearSession();
  }
};

function updateNav() {
  const authBtn     = document.getElementById('auth-btn');
  const bookingsLink = document.getElementById('bookings-link');
  const userLabel   = document.getElementById('user-label');
  if (!authBtn) return;
  if (Auth.isLoggedIn()) {
    const username = Auth.getSession();
    if (userLabel) {
      userLabel.textContent = username;
      userLabel.style.display = 'inline-block';
    }
    authBtn.textContent = 'Sign Out';
    authBtn.removeAttribute('href');
    authBtn.onclick = (e) => {
      e.preventDefault();
      Auth.signout();
      window.location.reload();
    };
    if (bookingsLink) bookingsLink.style.display = 'inline-block';
  } else {
    if (userLabel) userLabel.style.display = 'none';
    authBtn.textContent = 'Sign In';
    authBtn.href = 'auth.html';
    authBtn.onclick = null;
    if (bookingsLink) bookingsLink.style.display = 'none';
  }
}

// ===== DOM READY: NAV UPDATE + FORM INTERCEPTION =====
document.addEventListener('DOMContentLoaded', () => {
  updateNav();

  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const toggleToSignup = document.getElementById('toggle-to-signup');
  const toggleToSignin = document.getElementById('toggle-to-signin');
  const toggleSigninWrapper = document.getElementById('toggle-signin-wrapper');
  const toggleSignupWrapper = document.getElementById('toggle-signup-wrapper');

  // Toggle visibility between Sign In and Sign Up
  if (toggleToSignup && toggleSigninWrapper && toggleSignupWrapper) {
    toggleToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      signinForm.style.display = 'none';
      signupForm.style.display = 'block';
      toggleSigninWrapper.style.display = 'none';
      toggleSignupWrapper.style.display = 'block';
    });
  }

  if (toggleToSignin && toggleSigninWrapper && toggleSignupWrapper) {
    toggleToSignin.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.style.display = 'none';
      signinForm.style.display = 'block';
      toggleSignupWrapper.style.display = 'none';
      toggleSigninWrapper.style.display = 'block';
    });
  }

  // Intercept Sign In submission
  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('signin-username')?.value.trim();
      const password = document.getElementById('signin-password')?.value;
      const errorEl = document.getElementById('signin-error');
      if (errorEl) errorEl.textContent = '';

      const result = Auth.signin(username, password);
      if (result.success) {
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        window.location.href = redirect || 'index.html';
      } else if (errorEl) {
        errorEl.textContent = result.error;
      }
    });
  }

  // Intercept Sign Up submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('signup-username')?.value.trim();
      const password = document.getElementById('signup-password')?.value;
      const errorEl = document.getElementById('signup-error');
      if (errorEl) errorEl.textContent = '';

      const result = Auth.signup(username, password);
      if (result.success) {
        window.location.href = 'index.html';
      } else if (errorEl) {
        errorEl.textContent = result.error;
      }
    });
  }
});