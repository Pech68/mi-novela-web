document.addEventListener("DOMContentLoaded", function() {
  const authButtonsContainer = document.getElementById("auth-buttons");
  const identity = window.netlifyIdentity;

  function renderButtons() {
    const user = identity.currentUser();
    authButtonsContainer.innerHTML = ''; // Limpiar botones existentes

    if (user) {
      authButtonsContainer.innerHTML = `
        <span>${user.email.split('@')[0]}</span>
        <button onclick="netlifyIdentity.logout()" class="auth-btn">Logout</button>
      `;
    } else {
      authButtonsContainer.innerHTML = `
        <button onclick="netlifyIdentity.open('login')" class="auth-btn">Login</button>
        <button onclick="netlifyIdentity.open('signup')" class="auth-btn primary">Sign Up</button>
      `;
    }
  }

  if (authButtonsContainer) {
    renderButtons();
    identity.on('login', renderButtons);
    identity.on('logout', renderButtons);
  }
});
