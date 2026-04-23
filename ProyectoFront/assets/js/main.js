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

  const forgotLink = document.getElementById("forgotPasswordLink");

  const accountIcon = document.getElementById("accountIcon");
  const accountPopup = document.getElementById("accountPopup");
  const userEmail = document.getElementById("userEmail");
  const userRole = document.getElementById("userRole");
  const profilePassword = document.getElementById("profilePassword");

  const logoutBtn = document.getElementById("logoutBtn");
  const adminBtn = document.getElementById("adminBtn");

  const togglePassword = document.getElementById("togglePassword");

  if (localStorage.getItem("isAdmin") === "true") {

    if (adminBtn) {
      adminBtn.style.display = "inline-block";
      adminBtn.href = "/ProyectoFront/pages/registroVenta.html";
    }

  }

  if (localStorage.getItem("loggedInUser")) {

    if (loginBtn) {
      loginBtn.style.display = "none";
    }

    if (accountIcon) {
      accountIcon.style.display = "inline-block";
    }

  }

  function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  }

  function getUser(email) {

    if (!email) return null;

    const stored = localStorage.getItem(
      `user_${email.toLowerCase()}`
    );

    return stored ? JSON.parse(stored) : null;

  }

  function saveUser(email, password) {

    localStorage.setItem(
      `user_${email.toLowerCase()}`,
      JSON.stringify({
        email: email.toLowerCase(),
        password: password
      })
    );

  }

  function mostrarLogin() {

    if (loginForm) {
      loginForm.style.display = "block";
    }

    if (forgotView) {
      forgotView.style.display = "none";
    }

    if (loginMsg) {
      loginMsg.textContent = "";
    }

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

  if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

      e.preventDefault();

      const email = loginEmailInput.value.trim();
      const password = loginPasswordInput.value;

      if (!email || !password) {

        loginMsg.textContent =
          "Completa correo y contraseña.";

        return;

      }

      let user = null;
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

      /* USUARIO NORMAL */

      else {

        user = getUser(email);

        if (!user) {

          loginMsg.textContent =
            "Usuario no registrado.";

          return;

        }

        if (user.password !== password) {

          loginMsg.textContent =
            "Contraseña incorrecta.";

          return;

        }

      }

      localStorage.setItem(
        "loggedInUser",
        email
      );

      if (email === ADMIN_EMAIL) {

        localStorage.setItem(
          "isAdmin",
          "true"
        );

        if (adminBtn) {

          adminBtn.style.display =
            "inline-block";

          adminBtn.href =
            "/ProyectoFront/pages/registroVenta.html";

        }

      }

      else {

        localStorage.removeItem(
          "isAdmin"
        );

      }

      loginMsg.style.color = "green";

      loginMsg.textContent =
        "Bienvenido...";

      loginForm.reset();

      setTimeout(() => {

        loginPopup.style.display =
          "none";

      }, 1000);

      if (loginBtn) {
        loginBtn.style.display = "none";
      }

      if (accountIcon) {
        accountIcon.style.display =
          "inline-block";
      }

    });

  }


  if (registerForm) {

    registerForm.addEventListener(
      "submit",
      function (e) {

        e.preventDefault();

        const email =
          registerEmailInput.value.trim();

        const password =
          registerPasswordInput.value;

        if (!email || !password) {

          registerMsg.textContent =
            "Completa todos los campos.";

          return;

        }

        if (!validEmail(email)) {

          registerMsg.textContent =
            "Correo inválido.";

          return;

        }

        if (getUser(email)) {

          registerMsg.textContent =
            "Ese correo ya existe.";

          return;

        }

        saveUser(email, password);

        registerMsg.style.color =
          "green";

        registerMsg.textContent =
          "Usuario registrado.";

        registerForm.reset();

      }
    );

  }

  if (forgotLink) {

    forgotLink.addEventListener(
      "click",
      function (e) {

        e.preventDefault();

        loginForm.style.display =
          "none";

        forgotView.style.display =
          "block";

      }
    );

  }

  if (accountIcon) {

    accountIcon.addEventListener(
      "click",
      function (e) {

        e.preventDefault();

        const loggedEmail =
          localStorage.getItem(
            "loggedInUser"
          );

        if (!loggedEmail) return;

        let user = null;

        if (
          loggedEmail === ADMIN_EMAIL
        ) {

          user = {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
          };

        }


        else {

          user =
            getUser(loggedEmail);

        }

        if (userEmail) {

          userEmail.textContent =
            loggedEmail;

        }

        if (
          profilePassword &&
          user
        ) {

          profilePassword.value =
            user.password;

        }

        if (userRole) {

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

        }

        accountPopup.style.display =
          "flex";

      }
    );

  }


  if (accountPopup) {

    accountPopup.addEventListener(
      "click",
      function (e) {

        if (
          e.target === accountPopup
        ) {

          accountPopup.style.display =
            "none";

        }

      }
    );

  }

  if (logoutBtn) {

    logoutBtn.addEventListener(
      "click",
      function () {

        localStorage.removeItem(
          "loggedInUser"
        );

        localStorage.removeItem(
          "isAdmin"
        );

        if (loginBtn) {
          loginBtn.style.display =
            "inline-block";
        }

        if (accountIcon) {
          accountIcon.style.display =
            "none";
        }

        if (adminBtn) {
          adminBtn.style.display =
            "none";
        }

        if (accountPopup) {
          accountPopup.style.display =
            "none";
        }

      }
    );

  }


  if (togglePassword) {

    togglePassword.addEventListener(
      "click",
      function () {

        if (
          profilePassword.type ===
          "password"
        ) {

          profilePassword.type =
            "text";

        }

        else {

          profilePassword.type =
            "password";

        }

      }
    );

  }

  const cartLink = document.getElementById("cartLink");
  const checkoutPopup = document.getElementById("checkoutPopup");
  const goLoginBtn = document.getElementById("goLoginBtn");

  if (cartLink) {

    cartLink.addEventListener("click", function (e) {

      e.preventDefault();

      const usuarioLogueado =
        localStorage.getItem("loggedInUser");

      if (!usuarioLogueado) {

        if (checkoutPopup) {

          checkoutPopup.style.display =
            "flex";

        }

        return;

      }

      window.location.href =
        "/ProyectoFront/pages/checkout.html";

    });

  }


  if (goLoginBtn) {

    goLoginBtn.addEventListener(
      "click",
      function () {

        if (checkoutPopup) {

          checkoutPopup.style.display =
            "none";

        }

        if (loginPopup) {

          loginPopup.style.display =
            "flex";

        }

        mostrarLogin();

      }
    );
  }

  if (checkoutPopup) {

    checkoutPopup.addEventListener(
      "click",
      function (e) {

        if (e.target === checkoutPopup) {

          checkoutPopup.style.display =
            "none";

        }

      }
    );

  }

});