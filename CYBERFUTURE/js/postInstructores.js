document.addEventListener("DOMContentLoaded", () => {
  const btnRegistrar = document.getElementById("registrar");

  btnRegistrar.addEventListener("click", async () => {
    // Referencias a los campos del formulario
    const IdInstructor = document.getElementById("Id");
    const Nombre_Instructor = document.getElementById("Nombre");
    const Apellido_Instructor = document.getElementById("Apellido");
    const Edad_Instructor = document.getElementById("Edad");
    const Telefono_Instructor = document.getElementById("Telefono");
   

    // Crear objeto con los datos del formulario
    const data = {
      IdInstructor: parseInt(IdInstructor.value),
      Nombre_Instructor: Nombre_Instructor.value.trim(),
      Apellido_Instructor: Apellido_Instructor.value.trim(),
      Edad_Instructor: parseInt(Edad_Instructor.value) || 0,
      Telefono_Instructor: Telefono_Instructor.value.trim(),
   
    };

    // Validación básica
    if (!data.Nombre_Instructor || !data.Apellido_Instructor) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {                                                                           
      const response = await fetch("https://corsproxy.io/?url=http://cybercenter.somee.com/api/Instructor", {
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
