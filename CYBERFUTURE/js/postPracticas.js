document.addEventListener("DOMContentLoaded", () => {
  const btnRegistrar = document.getElementById("registrar");

  btnRegistrar.addEventListener("click", async () => {
    // Referencias a los campos del formulario
    const IdPractica = document.getElementById("Id");
    const No_Horas = document.getElementById("No_Horas");
    const Fecha_Inicio = document.getElementById("Fecha_Inicio");
    const Fecha_Final = document.getElementById("Fecha_Final");
   
   

    // Crear objeto con los datos del formulario
    const data = {
      IdPractica: parseInt(IdPractica.value),
      No_Horas: No_Horas.value.trim(),
       Fecha_Inicio: Fecha_Inicio.value.trim(),
      Fecha_Final: Fecha_Final.value.trim(),
     
    };

    // Validación básica
    if (!data.No_Horas || !data.Fecha_Inicio) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://corsproxy.io/?url=http://cybercenter.somee.com/api/PracticasEmpresariales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Practica creada correctamente.");
        window.location.href = "index.html";
      } else {
        const errorText = await response.text();
        console.error("Error en la solicitud:", errorText);
        alert("⚠️ No se pudo crear la practica. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("❌ Error de conexión con el servidor.");
    }
  });
});
