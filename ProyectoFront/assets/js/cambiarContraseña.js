
    const btn =
    document.getElementById("savePassword");

    btn.addEventListener("click", function(){

      const params =
      new URLSearchParams(window.location.search);

      const email =
      params.get("email");

      const nuevaPassword =
      document.getElementById("newPassword").value;

      const confirmarPassword =
      document.getElementById("confirmPassword").value;

      const msg =
      document.getElementById("msg");

      if(
        !nuevaPassword ||
        !confirmarPassword
      ){

        msg.style.color = "red";

        msg.textContent =
        "Completa todos los campos.";

        return;

      }

      if(
        nuevaPassword.length < 6
      ){

        msg.style.color = "red";

        msg.textContent =
        "La contraseña debe tener mínimo 6 caracteres.";

        return;

      }

      if(
        nuevaPassword !== confirmarPassword
      ){

        msg.style.color = "red";

        msg.textContent =
        "Las contraseñas no coinciden.";

        return;

      }

      const user =
      JSON.parse(
        localStorage.getItem(
          `user_${email.toLowerCase()}`
        )
      );

      if(!user){

        msg.style.color = "red";

        msg.textContent =
        "Usuario no encontrado.";

        return;

      }

      user.password =
      nuevaPassword;

      localStorage.setItem(

        `user_${email.toLowerCase()}`,

        JSON.stringify(user)

      );

      msg.style.color = "green";

      msg.textContent =
      "✅ Contraseña actualizada correctamente.";

      setTimeout(() => {

        window.location.href =
        "/ProyectoFront/index.html";

      }, 2000);

    });
