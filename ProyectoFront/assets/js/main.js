// Esperamos que el DOM esté listo antes de hacer cualquier cosa
document.addEventListener("DOMContentLoaded", function () {

  const adminBtn = document.getElementById("adminBtn");
const adminPopup = document.getElementById("adminPopup");
const closeAdmin = document.getElementById("closeAdmin");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminMsg = document.getElementById("adminMsg");

const ADMIN_EMAIL = "sxmxel05@gmail.com";
const ADMIN_PASSWORD = "cesde2026";

adminBtn.addEventListener("click", function(e){

  e.preventDefault();

  adminPopup.style.display = "flex";

});

closeAdmin.addEventListener("click", function(){

  adminPopup.style.display = "none";

});

adminLoginBtn.addEventListener("click", function(){

  const email =
    document.getElementById("adminEmail").value.trim();

  const password =
    document.getElementById("adminPassword").value.trim();

  if(
    email === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD
  ){

    window.location.href =
      "/ProyectoFront/pages/registroVenta.html";

  } else {

    adminMsg.style.color = "red";

    adminMsg.textContent =
      "Credenciales incorrectas";

  }

});

  // Inicializar EmailJS de forma segura
  if (typeof emailjs !== "undefined") {
    emailjs.init("gykPIl-Z4OsO2QkFW");
  }

  const loginBtn = document.getElementById("loginBtn");
  const loginPopup = document.getElementById("loginPopup");
  const closeLogin = document.getElementById("closeLogin");
  const loginForm = document.getElementById("loginForm");
  const forgotView = document.getElementById("forgotView");
  const loginEmailInput = document.getElementById("loginEmail");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginMsg = document.getElementById("loginMsg");
  const registerForm = document.getElementById("registerForm");
  const registerEmailInput = document.getElementById("registerEmail");
  const registerPasswordInput = document.getElementById("registerPassword");
  const registerMsg = document.getElementById("registerMsg");
  const noRegistrado = document.querySelector(".links.Variante");
  const forgotLink = document.getElementById("forgotPasswordLink");
  const accountIcon = document.getElementById("accountIcon");
const accountPopup = document.getElementById("accountPopup");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

if (localStorage.getItem("loggedInUser")) {
  loginBtn.style.display = "none";
  accountIcon.style.display = "inline-block";
  if (userEmail) userEmail.textContent = "Correo: " + localStorage.getItem("loggedInUser");
}

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getUser(email) {
    if (!email) return null;
    const stored = localStorage.getItem(`user_${email.toLowerCase()}`);
    return stored ? JSON.parse(stored) : null;
  }

  function saveUser(email, password) {
    localStorage.setItem(
      `user_${email.toLowerCase()}`,
      JSON.stringify({ email: email.toLowerCase(), password })
    );
  }
  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loginPopup.style.display = "flex";
      mostrarLogin();
    });
  }
  if (closeLogin) {
    closeLogin.addEventListener("click", function () {
      loginPopup.style.display = "none";
    });
  }
  if (loginPopup) {
    loginPopup.addEventListener("click", function (e) {
      if (e.target === loginPopup) {
        loginPopup.style.display = "none";
      }
    });
  }
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = loginEmailInput?.value.trim() || "";
      const password = loginPasswordInput?.value || "";
      if (!email || !password) {
        if (loginMsg) {
          loginMsg.style.color = "#d10000";
          loginMsg.textContent = "Completa correo y contraseña.";
        }
        return;
      }
      if (!validEmail(email)) {
        if (loginMsg) {
          loginMsg.style.color = "#d10000";
          loginMsg.textContent = "Ingresa un correo válido.";
        }
        return;
      }
      const user = getUser(email);
      if (!user) {
        if (loginMsg) {
          loginMsg.style.color = "#d10000";
          loginMsg.textContent = "Usuario no registrado. Regístrate primero.";
        }
        return;
      }
      if (user.password !== password) {
        if (loginMsg) {
          loginMsg.style.color = "#d10000";
          loginMsg.textContent = "Contraseña incorrecta.";
        }
        return;
      }
      if (loginMsg) {
        loginMsg.style.color = "green";
        loginMsg.textContent = "Bienvenido de nuevo. Cargando...";
      }
      localStorage.setItem("loggedInUser", email);
      if (loginBtn) loginBtn.style.display = "none";
      accountIcon.style.display = "inline-block";
if (userEmail) userEmail.textContent = "Correo: " + email;
      setTimeout(() => {
        loginPopup.style.display = "none";
        loginForm.reset();
        mostrarLogin();
      }, 1000);
    });
  }
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = registerEmailInput?.value.trim() || "";
      const password = registerPasswordInput?.value || "";

      if (!email || !password) {
        if (registerMsg) {
          registerMsg.style.color = "#d10000";
          registerMsg.textContent = "Completa correo y contraseña para registrarte.";
        }
        return;
      }
      if (!validEmail(email)) {
        if (registerMsg) {
          registerMsg.style.color = "#d10000";
          registerMsg.textContent = "Ingresa un correo válido.";
        }
        return;
      }
      if (getUser(email)) {
        if (registerMsg) {
          registerMsg.style.color = "#d10000";
          registerMsg.textContent = "Ese correo ya está registrado.";
        }
        return;
      }
      saveUser(email, password);
      if (registerMsg) {
        registerMsg.style.color = "green";
        registerMsg.textContent = "Usuario registrado con éxito. Ahora inicia sesión.";
      }
      registerForm.style.display = "none";

document.querySelector(".form-header").style.display = "none";
document.querySelector(".form-subtext").style.display = "none";

document.getElementById("discountSuccess").style.display = "flex";
      setTimeout(() => {
        if (registerMsg) registerMsg.textContent = "";
      }, 5000);
    });
  }
  if (forgotLink) {
    forgotLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (loginForm) loginForm.style.display = "none";
      if (forgotView) forgotView.style.display = "block";
      const forgotMsg = document.getElementById("forgotMsg");
      if (forgotMsg) forgotMsg.textContent = "";
    });
  }
  const backToLoginBtn = document.getElementById("backToLogin");
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      mostrarLogin();
    });
  }

  // Enviar correo de recuperación
  const sendResetBtn = document.getElementById("sendResetBtn");
  if (sendResetBtn) {
    sendResetBtn.addEventListener("click", function () {
      const email = document.getElementById("forgotEmail").value.trim();
      const msg = document.getElementById("forgotMsg");

      if (!email) {
        if (msg) {
          msg.style.color = "#d10000";
          msg.textContent = "Por favor ingresa tu correo.";
        }
        return;
      }

      if (!validEmail(email)) {
        if (msg) {
          msg.style.color = "#d10000";
          msg.textContent = "Ingresa un correo válido.";
        }
        return;
      }

      const user = getUser(email);
      if (!user) {
        if (msg) {
          msg.style.color = "#d10000";
          msg.textContent = "Ese correo no está registrado.";
        }
        return;
      }

      this.textContent = "Enviando...";
      this.disabled = true;
      if (msg) msg.textContent = "";

      if (typeof emailjs !== "undefined") {
        emailjs
          .send("service_n9231ha", "template_qvvhqi7", {
            email: email,
            link: "https://tutienda.com/reset-password",
          })
          .then(() => {
            if (msg) {
              msg.style.color = "green";
              msg.textContent = "✅ Correo enviado. Revisa tu bandeja de entrada.";
            }
            document.getElementById("forgotEmail").value = "";
          })
          .catch(() => {
            if (msg) {
              msg.style.color = "#d10000";
              msg.textContent = "❌ Error al enviar. Intenta de nuevo.";
            }
          })
          .finally(() => {
            this.textContent = "Enviar correo";
            this.disabled = false;
          });
      } else {
        setTimeout(() => {
          if (msg) {
            msg.style.color = "green";
            msg.textContent = "✅ Correo enviado (modo demo).";
          }
          document.getElementById("forgotEmail").value = "";
          this.textContent = "Enviar correo";
          this.disabled = false;
        }, 1200);
      }
    });
  }
  if (noRegistrado) {
    noRegistrado.addEventListener("click", function (e) {
      e.preventDefault();
      loginPopup.style.display = "none";
      const registroEl = document.getElementById("registro");
      if (registroEl) {
        registroEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  function mostrarLogin() {
    if (loginForm) loginForm.style.display = "block";
    if (forgotView) forgotView.style.display = "none";
    if (loginMsg) loginMsg.textContent = "";
    const forgotMsg = document.getElementById("forgotMsg");
    if (forgotMsg) forgotMsg.textContent = "";
  }
if (accountIcon) {
  accountIcon.addEventListener("click", function(e) {
    e.preventDefault();
    const randomTexts = [
      "¡Funciona! Mensaje de prueba.",
    ];
    const randomText = randomTexts[Math.floor(Math.random() * randomTexts.length)];
    if (userEmail) userEmail.textContent = randomText;
    accountPopup.style.display = "flex";
  });
}
if (accountPopup) {
  accountPopup.addEventListener("click", function(e) {
    if (e.target === accountPopup) {
      accountPopup.style.display = "none";
    }
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("loggedInUser");
    accountIcon.style.display = "none";
    loginBtn.style.display = "inline-block";
    accountPopup.style.display = "none";
  });
}
if (accountIcon) {
  accountIcon.addEventListener("click", function(e) {
    e.preventDefault();
    accountPopup.style.display = "flex";
  });
}
if (accountPopup) {
  accountPopup.addEventListener("click", function(e) {
    if (e.target === accountPopup) {
      accountPopup.style.display = "none";
    }
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("loggedInUser");
    accountIcon.style.display = "none";
    loginBtn.style.display = "inline-block";
    accountPopup.style.display = "none";
  });
}

const cartLink = document.getElementById("cartLink");
const checkoutPopup = document.getElementById("checkoutPopup");
const goLoginBtn = document.getElementById("goLoginBtn");

if (cartLink) {
  cartLink.addEventListener("click", function (e) {

    const usuarioLogueado = localStorage.getItem("loggedInUser");

    if (!usuarioLogueado) {
      e.preventDefault();

      checkoutPopup.style.display = "flex";
    }

  });
}

if (goLoginBtn) {
  goLoginBtn.addEventListener("click", function () {

    checkoutPopup.style.display = "none";

    loginPopup.style.display = "flex";
    mostrarLogin();

  });
}

if (checkoutPopup) {
  checkoutPopup.addEventListener("click", function(e) {

    if (e.target === checkoutPopup) {
      checkoutPopup.style.display = "none";
    }

  });
}
});