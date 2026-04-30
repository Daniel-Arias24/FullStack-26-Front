// ============================================================
//  main.js  —  ESPRIT Front  ↔  Spring Boot Back
//
//  ENDPOINTS QUE CONSUME:
//  ┌─────────────────────────────────────────────────────────┐
//  │ POST /api/auth/register  → Registrar usuario (rol USER) │
//  │   Body: { name, email, password }                       │
//  │                                                         │
//  │ POST /api/auth/login     → Iniciar sesión               │
//  │   Body: { email, password }                             │
//  │   Respuesta data: { id, name, email, role, createdAt }  │
//  │   role = "USER" | "ADMIN"                               │
//  └─────────────────────────────────────────────────────────┘
//
//  CRUD de usuarios (para Postman o panel admin futuro):
//  GET    /api/users          → listar todos
//  GET    /api/users/{id}     → obtener uno
//  PUT    /api/users/{id}     → actualizar { name, email, password }
//  DELETE /api/users/{id}     → eliminar
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  // ── URL base del backend ─────────────────────────────────────
  // Si cambias el puerto del back, solo lo cambias aquí.
  const API = "http://localhost:8080/api";

  // ── Inicializar EmailJS (recuperación de contraseña) ─────────
  if (typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: "gykPIl-Z4OsO2QkFW" });
  }

  // ════════════════════════════════════════════════════════════
  //  REFERENCIAS AL DOM
  // ════════════════════════════════════════════════════════════

  // — Login popup —
  const loginBtn           = document.getElementById("loginBtn");
  const loginPopup         = document.getElementById("loginPopup");
  const closeLogin         = document.getElementById("closeLogin");
  const loginForm          = document.getElementById("loginForm");
  const forgotView         = document.getElementById("forgotView");
  const loginEmailInput    = document.getElementById("loginEmail");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginMsg           = document.getElementById("loginMsg");

  // — Registro —
  const registerForm          = document.getElementById("registerForm");
  const registerNameInput     = document.getElementById("registerName");     // campo nuevo
  const registerEmailInput    = document.getElementById("registerEmail");
  const registerPasswordInput = document.getElementById("registerPassword");
  const registerMsg           = document.getElementById("registerMsg");
  const discountSuccess       = document.getElementById("discountSuccess");  // banner de éxito

  // — Recuperar contraseña —
  const forgotLink    = document.getElementById("forgotPasswordLink");
  const backToLogin   = document.getElementById("backToLogin");
  const sendResetBtn  = document.getElementById("sendResetBtn");

  // — Perfil / sesión —
  const accountIcon     = document.getElementById("accountIcon");
  const accountPopup    = document.getElementById("accountPopup");
  const userEmailEl     = document.getElementById("userEmail");
  const userRoleEl      = document.getElementById("userRole");
  const profilePassword = document.getElementById("profilePassword");
  const togglePassword  = document.getElementById("togglePassword");
  const logoutBtn       = document.getElementById("logoutBtn");
  const adminBtn        = document.getElementById("adminBtn");

  // — Carrito / checkout —
  const cartLink      = document.getElementById("cartLink");
  const checkoutPopup = document.getElementById("checkoutPopup");
  const goLoginBtn    = document.getElementById("goLoginBtn");

  // ════════════════════════════════════════════════════════════
  //  HELPERS DE SESIÓN
  //  Guardamos en localStorage el objeto que devuelve el back:
  //  { id, name, email, role, createdAt }
  //  Nunca guardamos la contraseña.
  // ════════════════════════════════════════════════════════════

  function guardarSesion(userData) {
    localStorage.setItem("loggedInUser", userData.email);
    localStorage.setItem("userData", JSON.stringify(userData));
    if (userData.role === "ADMIN") {
      localStorage.setItem("isAdmin", "true");
    } else {
      localStorage.removeItem("isAdmin");
    }
  }

  function cerrarSesion() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userData");
    localStorage.removeItem("isAdmin");
  }

  function getUsuarioGuardado() {
    const raw = localStorage.getItem("userData");
    return raw ? JSON.parse(raw) : null;
  }

  // ════════════════════════════════════════════════════════════
  //  ACTUALIZAR UI SEGÚN ESTADO DE SESIÓN
  // ════════════════════════════════════════════════════════════

  function aplicarEstadoUI() {
    const usuario = getUsuarioGuardado();

    if (usuario) {
      // Hay sesión activa
      if (loginBtn)    loginBtn.style.display    = "none";
      if (accountIcon) accountIcon.style.display = "inline-block";

      if (usuario.role === "ADMIN" && adminBtn) {
        adminBtn.style.display = "inline-block";
        adminBtn.href = "/ProyectoFront/pages/registroVenta.html";
      }
    } else {
      // Sin sesión
      if (loginBtn)    loginBtn.style.display    = "inline-block";
      if (accountIcon) accountIcon.style.display = "none";
      if (adminBtn)    adminBtn.style.display    = "none";
    }
  }

  // Aplica el estado al cargar la página
  aplicarEstadoUI();

  // ════════════════════════════════════════════════════════════
  //  HELPERS DE UI
  // ════════════════════════════════════════════════════════════

  function mostrarLoginForm() {
    if (loginForm)  loginForm.style.display  = "block";
    if (forgotView) forgotView.style.display = "none";
    if (loginMsg)   loginMsg.textContent     = "";
  }

  function setMsg(el, texto, color = "red") {
    if (!el) return;
    el.style.color   = color;
    el.textContent   = texto;
  }

  // ════════════════════════════════════════════════════════════
  //  ABRIR / CERRAR POPUP DE LOGIN
  // ════════════════════════════════════════════════════════════

  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loginPopup.style.display = "flex";
      mostrarLoginForm();
    });
  }

  if (closeLogin) {
    closeLogin.addEventListener("click", function () {
      loginPopup.style.display = "none";
    });
  }

  // ════════════════════════════════════════════════════════════
  //  LOGIN  →  POST /api/auth/login
  //
  //  El back recibe:  { email, password }
  //  El back devuelve:
  //    { success: true, message: "Login exitoso",
  //      data: { id, name, email, role, createdAt } }
  //  Si falla devuelve:
  //    { success: false, message: "Email o contraseña incorrectos" }
  // ════════════════════════════════════════════════════════════

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email    = loginEmailInput.value.trim();
      const password = loginPasswordInput.value;

      if (!email || !password) {
        setMsg(loginMsg, "Completa correo y contraseña.");
        return;
      }

      setMsg(loginMsg, "Verificando...", "#999");

      try {
        const res  = await fetch(`${API}/auth/login`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ email, password })
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          // El back respondió con error (credenciales incorrectas, etc.)
          setMsg(loginMsg, json.message || "Correo o contraseña incorrectos.");
          return;
        }

        // ── Login exitoso ────────────────────────────────────
        const userData = json.data;   // { id, name, email, role, createdAt }
        guardarSesion(userData);
        aplicarEstadoUI();

        setMsg(loginMsg, `¡Bienvenido, ${userData.name}!`, "green");
        loginForm.reset();

        setTimeout(() => {
          loginPopup.style.display = "none";
          loginMsg.textContent     = "";

          // Si es ADMIN → redirigir al panel
          if (userData.role === "ADMIN") {
            window.location.href = "/ProyectoFront/pages/registroVenta.html";
          }
        }, 1000);

      } catch (err) {
        console.error("Error de red:", err);
        setMsg(loginMsg, "No se pudo conectar con el servidor. ¿Está corriendo el back?");
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  //  REGISTRO  →  POST /api/auth/register
  //
  //  El back recibe:  { name, email, password }
  //  El back devuelve (201):
  //    { success: true, message: "Usuario registrado exitosamente",
  //      data: { id, name, email, role: "USER", createdAt } }
  //  Si falla (400):
  //    { success: false, message: "Ya existe una cuenta con ese email" }
  //
  //  IMPORTANTE: el formulario del HTML tiene que tener el campo
  //  <input id="registerName"> para el nombre.
  //  (ver index.html actualizado que se entrega junto a este archivo)
  // ════════════════════════════════════════════════════════════

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name     = registerNameInput  ? registerNameInput.value.trim() : "";
      const email    = registerEmailInput.value.trim();
      const password = registerPasswordInput.value;

      // Validaciones en el front
      if (!name || !email || !password) {
        setMsg(registerMsg, "Completa todos los campos.");
        return;
      }
      if (password.length < 6) {
        setMsg(registerMsg, "La contraseña debe tener mínimo 6 caracteres.");
        return;
      }

      setMsg(registerMsg, "Registrando...", "#999");

      try {
        const res  = await fetch(`${API}/auth/register`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ name, email, password })
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          setMsg(registerMsg, json.message || "Error al registrar. Intenta de nuevo.");
          return;
        }

        // ── Registro exitoso ─────────────────────────────────
        setMsg(registerMsg, "");
        registerForm.style.display = "none";

        // Mostrar banner del cupón de descuento
        if (discountSuccess) {
          discountSuccess.style.display = "block";
        }

      } catch (err) {
        console.error("Error de red:", err);
        setMsg(registerMsg, "No se pudo conectar con el servidor. ¿Está corriendo el back?");
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  //  POPUP DE PERFIL (icono de cuenta)
  // ════════════════════════════════════════════════════════════

  if (accountIcon) {
    accountIcon.addEventListener("click", function (e) {
      e.preventDefault();

      const usuario = getUsuarioGuardado();
      if (!usuario) return;

      if (userEmailEl)  userEmailEl.textContent  = usuario.email;
      if (userRoleEl)   userRoleEl.textContent    = usuario.role === "ADMIN" ? "Admin" : "Usuario Comercial";

      // Nunca mostramos la contraseña real (el back nunca la devuelve)
      if (profilePassword) {
        profilePassword.value = "••••••";
        profilePassword.type  = "password";
      }

      accountPopup.style.display = "flex";
    });
  }

  // Cerrar popup de perfil al hacer click fuera
  if (accountPopup) {
    accountPopup.addEventListener("click", function (e) {
      if (e.target === accountPopup) accountPopup.style.display = "none";
    });
  }

  // Toggle mostrar/ocultar contraseña en el perfil
  if (togglePassword && profilePassword) {
    togglePassword.addEventListener("click", function () {
      profilePassword.type = profilePassword.type === "password" ? "text" : "password";
    });
  }

  // ════════════════════════════════════════════════════════════
  //  LOGOUT
  // ════════════════════════════════════════════════════════════

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      cerrarSesion();
      if (accountPopup) accountPopup.style.display = "none";
      aplicarEstadoUI();
    });
  }

  // ════════════════════════════════════════════════════════════
  //  VISTA "OLVIDÉ MI CONTRASEÑA"
  // ════════════════════════════════════════════════════════════

  if (forgotLink) {
    forgotLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (loginForm)  loginForm.style.display  = "none";
      if (forgotView) forgotView.style.display = "block";
    });
  }

  if (backToLogin) {
    backToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      mostrarLoginForm();
    });
  }

  // ── Envío de correo de recuperación (EmailJS) ─────────────
  if (sendResetBtn) {
    sendResetBtn.addEventListener("click", async function () {
      const forgotEmailInput = document.getElementById("forgotEmail");
      const forgotMsg        = document.getElementById("forgotMsg");
      const email            = forgotEmailInput ? forgotEmailInput.value.trim() : "";

      if (!email) {
        setMsg(forgotMsg, "Ingresa un correo.");
        return;
      }

      if (typeof emailjs === "undefined") {
        setMsg(forgotMsg, "El servicio de correo no está disponible.");
        return;
      }

      setMsg(forgotMsg, "Enviando...", "#999");

      try {
        await emailjs.send("service_n9231ha", "template_qvvhqi7", {
          email: email,
          link:  `http://127.0.0.1:5500/ProyectoFront/pages/cambiarContraseña.html?email=${email}`,
        });
        setMsg(forgotMsg, "Correo enviado correctamente. Revisa tu bandeja.", "green");
      } catch (err) {
        console.error("EmailJS error:", err);
        setMsg(forgotMsg, "Error al enviar el correo. Intenta de nuevo.");
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  //  PROTECCIÓN DEL CARRITO
  //  Si el usuario no tiene sesión, muestra el popup de aviso
  //  en lugar de ir al checkout.
  // ════════════════════════════════════════════════════════════

  if (cartLink) {
    cartLink.addEventListener("click", function (e) {
      e.preventDefault();

      if (!localStorage.getItem("loggedInUser")) {
        if (checkoutPopup) checkoutPopup.style.display = "flex";
        return;
      }
      window.location.href = "/ProyectoFront/pages/checkout.html";
    });
  }

  if (goLoginBtn) {
    goLoginBtn.addEventListener("click", function () {
      if (checkoutPopup) checkoutPopup.style.display = "none";
      if (loginPopup)    loginPopup.style.display    = "flex";
      mostrarLoginForm();
    });
  }

  if (checkoutPopup) {
    checkoutPopup.addEventListener("click", function (e) {
      if (e.target === checkoutPopup) checkoutPopup.style.display = "none";
    });
  }

});