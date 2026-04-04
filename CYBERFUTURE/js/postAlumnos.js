document.addEventListener("DOMContentLoaded", () => {
  const btnRegistrar = document.getElementById("registrar");

  btnRegistrar.addEventListener("click", async () => {
    // Referencias a los campos del formulario
    const IdAlumno = document.getElementById("Id");
    const Nombre_Alumno = document.getElementById("Nombre");
    const Apellido_Alumno = document.getElementById("Apellido");
    const Edad_Alumno = document.getElementById("Edad");
    const Telefono_Alumno = document.getElementById("Telefono");
    const Correo_Alumno = document.getElementById("Correo");
    const IdPractica = document.getElementById("Practica");
   

    // Crear objeto con los datos del formulario
    const data = {
      IdAlumno: parseInt(IdAlumno.value),
      Nombre_Alumno: Nombre_Alumno.value.trim(),
      Apellido_Alumno: Apellido_Alumno.value.trim(),
      Edad_Alumno: parseInt(Edad_Alumno.value) || 0,
      Telefono_Alumno: Telefono_Alumno.value.trim(),
      Correo_Alumno: Correo_Alumno.value.trim(),
      IdPractica: parseInt(IdPractica.value) || 0,
  
    };

    // Validación básica
    if (!data.Nombre_Alumno || !data.Apellido_Alumno) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://corsproxy.io/?url=http://cybercenter.somee.com/api/Alumno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Usuario registrado correctamente.");
        window.location.href = "index.html";
      } else {
        const errorText = await response.text();
        console.error("Error en la solicitud:", errorText);
        alert("⚠️ No se pudo registrar el usuario. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("❌ Error de conexión con el servidor.");
    }
  });
});
