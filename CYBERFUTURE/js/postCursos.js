document.addEventListener("DOMContentLoaded", () => {
  const btnRegistrar = document.getElementById("registrar");

  btnRegistrar.addEventListener("click", async () => {
    // Referencias a los campos del formulario
    const IdCurso = document.getElementById("Id");
    const Nombre_Curso = document.getElementById("Nombre");
    const Costo = document.getElementById("Costo");
    const Duracion = document.getElementById("Duracion");
    const Fecha_Inicial = document.getElementById("Fecha_Inicial");
    const Fecha_Fin = document.getElementById("Fecha_Fin");
   
   

    // Crear objeto con los datos del formulario
    const data = {
      IdCurso: parseInt(IdCurso.value),
      Nombre_Curso: Nombre_Curso.value.trim(),
      Costo: parseInt(Costo.value) || 0,
      Duracion: parseInt(Duracion.value) || 0,
      Fecha_Inicial: Fecha_Inicial.value.trim(),
      Fecha_Fin: Fecha_Fin.value.trim(),
  
    };

    // Validación básica
    if (!data.Nombre_Curso || !data.Costo) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://corsproxy.io/?url=http://cybercenter.somee.com/api/Curso", {
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
