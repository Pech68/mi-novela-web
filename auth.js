document.addEventListener("DOMContentLoaded", function() {
  const authButtonsContainer = document.getElementById("auth-buttons");
  const identity = window.netlifyIdentity;

  function renderButtons() {
    const user = identity.currentUser();
    authButtons-container.innerHTML = ''; // Limpiar

    if (user) {
      // Si el usuario está logueado, muestra el enlace a su biblioteca, su nombre y el botón de Logout
      authButtonsContainer.innerHTML = `
        <a href="/biblioteca/" class="auth-btn">Mi Biblioteca</a>
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
