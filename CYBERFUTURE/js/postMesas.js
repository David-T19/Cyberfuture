document.addEventListener("DOMContentLoaded", () => {
  const btnRegistrar = document.getElementById("registrar");
  btnRegistrar.addEventListener("click", async () => {
    // Referencias a los campos del formulario

    const IdMesa = document.getElementById("Id");
    const Nombre_Mesa = document.getElementById("Nombre");
    const Descripcion = document.getElementById("Descripcion");
    const Tipo_Servicio = document.getElementById("Servicio");
    const IdInstructor = document.getElementById("IdI");
 
    // Crear objeto con los datos del formulario
    const data = {
      IdMesa: parseInt(IdMesa.value),
      Nombre_Mesa: Nombre_Mesa.value.trim(),
      Descripcion: Descripcion.value.trim(),
      Tipo_Servicio: Tipo_Servicio.value.trim(),
      IdInstructor: parseInt(IdInstructor.value),
    
      };

    // Validación básica
    if (!data.Nombre_Mesa || !data.Descripcion) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://corsproxy.io/?url=http://cybercenter.somee.com/api/MesaAyuda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Curso creado correctamente.");
        window.location.href = "index.html";
      } else {
        const errorText = await response.text();
        console.error("Error en la solicitud:", errorText);
        alert("⚠️ No se pudo crear el curso. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("❌ Error de conexión con el servidor.");
    }
  });
});
