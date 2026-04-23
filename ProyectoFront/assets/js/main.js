document.addEventListener("DOMContentLoaded", function () {
const ADMIN_EMAIL = "sxmxel05@gmail.com";
const ADMIN_PASSWORD = "cesde2026";

  if (typeof emailjs !== "undefined") {
    emailjs.init({
  publicKey: "gykPIl-Z4OsO2QkFW",
});
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
const adminBtn = document.getElementById("adminBtn");

if (localStorage.getItem("isAdmin") === "true") {

  adminBtn.style.display = "inline-block";

}

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
      let user = getUser(email);

/* LOGIN ADMIN */

if (
  email === ADMIN_EMAIL &&
  password === ADMIN_PASSWORD
) {

  user = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin"
  };

}

/* LOGIN USUARIO NORMAL */

else {

  if (!user) {

    if (loginMsg) {

      loginMsg.style.color = "#d10000";
      loginMsg.textContent = "Usuario no registrado.";

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

}
      if (loginMsg) {
        loginMsg.style.color = "green";
        loginMsg.textContent = "Bienvenido de nuevo. Cargando...";
      }
      localStorage.setItem("loggedInUser", email);
      if (email === ADMIN_EMAIL) {

  localStorage.setItem(
    "isAdmin",
    "true"
  );

  document.getElementById(
    "adminBtn"
  ).style.display = "inline-block";

}

else {

  localStorage.removeItem(
    "isAdmin"
  );

}
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
            link:"http://127.0.0.1:5500/ProyectoFront/pages/cambiarContrase%C3%B1a.html?email=" + email,
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
    
    localStorage.removeItem("isAdmin");

if (adminBtn) {

  adminBtn.style.display = "none";

}
    accountIcon.style.display = "none";
    loginBtn.style.display = "inline-block";
    accountPopup.style.display = "none";
  });
  loginForm.reset();

document.getElementById("email").value = "";
document.getElementById("password").value = "";
}
if (accountIcon) {

  accountIcon.addEventListener("click", function(e) {

    e.preventDefault();

    const loggedEmail =
      localStorage.getItem("loggedInUser");

    if (!loggedEmail) return;

    const user =
      getUser(loggedEmail);

    const userEmailText =
      document.getElementById("userEmail");

    const profilePassword =
      document.getElementById("profilePassword");

    const userRole =
      document.getElementById("userRole");

    if (userEmailText) {
      userEmailText.textContent =
        loggedEmail;
    }

    if (profilePassword && user) {
      profilePassword.value =
        user.password;
    }

    if (
      loggedEmail === ADMIN_EMAIL
    ) {

      userRole.textContent =
        "Admin";

    }

    else {

      userRole.textContent =
        "Usuario Comercial";

    }

    accountPopup.style.display =
      "flex";

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

const togglePassword =
  document.getElementById("togglePassword");

if (togglePassword) {

  togglePassword.addEventListener(
    "click",
    function () {

      const input =
        document.getElementById(
          "profilePassword"
        );

      if (
        input.type === "password"
      ) {

        input.type = "text";

      }

      else {

        input.type = "password";

      }

    }
  );

}
});