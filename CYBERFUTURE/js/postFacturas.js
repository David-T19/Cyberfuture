document.addEventListener("DOMContentLoaded", () => {
  const btnRegistrar = document.getElementById("registrar");

  btnRegistrar.addEventListener("click", async () => {
    // Referencias a los campos del formulario
    const IdFactura = document.getElementById("Id");
    const Estado = document.getElementById("Estado");
    const Subtotal = document.getElementById("Subtotal");
    const Total = document.getElementById("Total");
    const Fecha_Emision = document.getElementById("Fecha");
    const IdAlumno = document.getElementById("Alumno");
   
   

    // Crear objeto con los datos del formulario
    const data = {
      IdFactura: parseInt(IdFactura.value),
      Estado: Estado.value.trim(),
      Subtotal: Subtotal.value.trim(),
      Total: parseInt(Total.value) || 0,
      Fecha_Emision: Fecha_Emision.value.trim(),
      IdAlumno:parseInt(IdAlumno.value) || 0,
  
    };

    // Validación básica
    if (!data.Estado || !data.Subtotal) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://corsproxy.io/?url=http://cybercenter.somee.com/api/Factura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Factura creada correctamente.");
        window.location.href = "index.html";
      } else {
        const errorText = await response.text();
        console.error("Error en la solicitud:", errorText);
        alert("⚠️ No se pudo crear la factura. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("❌ Error de conexión con el servidor.");
    }
  });
});
