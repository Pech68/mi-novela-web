document.addEventListener("DOMContentLoaded", function() {
  const authButtonsContainer = document.getElementById("auth-buttons");
  const identity = window.netlifyIdentity;

  function renderButtons() {
    const user = identity.currentUser();
    const navElement = document.querySelector(".main-header nav");
    authButtonsContainer.innerHTML = ''; // Limpiar botones existentes

    if (user) {
      // Si el usuario está logueado, muestra su nombre y el botón de Logout
      authButtonsContainer.innerHTML = `
        <span class="user-email">${user.email.split('@')[0]}</span>
        <a href="#" onclick="event.preventDefault(); netlifyIdentity.logout();" class="auth-btn">Logout</a>
      `;
    } else {
      // Si no, muestra los botones de Login y Sign Up
      authButtonsContainer.innerHTML = `
        <a href="#" onclick="event.preventDefault(); netlifyIdentity.open('login');" class="auth-btn">Login</a>
        <a href="#" onclick="event.preventDefault(); netlifyIdentity.open('signup');" class="auth-btn primary">Sign Up</a>
      `;
    }
  }

  if (identity && authButtonsContainer) {
    renderButtons();
    identity.on('login', renderButtons);
    identity.on('logout', renderButtons);
  }
});
