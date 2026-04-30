
const API = "http://localhost:8080/api";

const btn             = document.getElementById("savePassword");
const newPasswordEl   = document.getElementById("newPassword");
const confirmPasswordEl = document.getElementById("confirmPassword");
const msg             = document.getElementById("msg");

function setMsg(texto, color = "red") {
  msg.style.color   = color;
  msg.textContent   = texto;
}

btn.addEventListener("click", async function () {

  const params          = new URLSearchParams(window.location.search);
  const email           = params.get("email");
  const nuevaPassword   = newPasswordEl.value;
  const confirmarPassword = confirmPasswordEl.value;

  // ── Validaciones en el front ────────────────────────────
  if (!email) {
    setMsg("Enlace inválido. No se encontró el correo.");
    return;
  }
  if (!nuevaPassword || !confirmarPassword) {
    setMsg("Completa todos los campos.");
    return;
  }
  if (nuevaPassword.length < 6) {
    setMsg("La contraseña debe tener mínimo 6 caracteres.");
    return;
  }
  if (nuevaPassword !== confirmarPassword) {
    setMsg("Las contraseñas no coinciden.");
    return;
  }

  setMsg("Actualizando...", "#999");

  try {
    // ── Paso 1: buscar el usuario por email ──────────────
    // GET /api/users → filtramos por email en el front
    const listRes  = await fetch(`${API}/users`);
    const listJson = await listRes.json();

    if (!listRes.ok || !listJson.success) {
      setMsg("Error al conectar con el servidor.");
      return;
    }

    const usuario = listJson.data.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!usuario) {
      setMsg("No se encontró ningún usuario con ese correo.");
      return;
    }

    // ── Paso 2: actualizar contraseña ─────────────────────
    // PUT /api/users/{id}  body: { password }
    const updateRes  = await fetch(`${API}/users/${usuario.id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ password: nuevaPassword })
    });

    const updateJson = await updateRes.json();

    if (!updateRes.ok || !updateJson.success) {
      setMsg(updateJson.message || "Error al actualizar la contraseña.");
      return;
    }

    // ── Éxito ─────────────────────────────────────────────
    setMsg("✅ Contraseña actualizada correctamente.", "green");

    setTimeout(() => {
      window.location.href = "/ProyectoFront/index.html";
    }, 2000);

  } catch (err) {
    console.error("Error de red:", err);
    setMsg("No se pudo conectar con el servidor. ¿Está corriendo el back?");
  }

});