document.addEventListener("DOMContentLoaded", () => {
  const btnRegistrar = document.getElementById("registrar");

  btnRegistrar.addEventListener("click", async () => {
    // Referencias a los campos del formulario
     const IdCurso = document.getElementById("Id");
  const IdFactura = document.getElementById("IdF");
  const Detalle = document.getElementById("Detalle");
   
    // Crear objeto con los datos del formulario
    const data = {
      IdCurso: parseInt(IdCurso.value),
      IdFactura: parseInt(IdFactura.value),
      Detalle: Detalle.value.trim(),
         };

    // Validación básica
    if (!data.Detalle) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://corsproxy.io/?url=http://cybercenter.somee.com/api/Contiene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Estado creado correctamente.");
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
