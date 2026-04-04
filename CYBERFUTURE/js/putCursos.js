document.addEventListener("DOMContentLoaded", async () => {
  const btnEditar = document.getElementById("editar");
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("No se ha proporcionado un ID de Factura para editar.");
    return;
  }

  // Referencias a los campos
    const IdCurso = document.getElementById("Id");
    const Nombre_Curso = document.getElementById("Nombre");
    const Costo = document.getElementById("Costo");
    const Duracion = document.getElementById("Duracion");
    const Fecha_Inicial = document.getElementById("Fecha_Inicial");
    const Fecha_Fin = document.getElementById("Fecha_Fin");
 

  // 🚀 Cargar los datos del usuario
  try {
    const response = await fetch(`http://cybercenter.somee.com/api/Curso/${id}`);
    if (!response.ok) throw new Error(`Error al obtener datos (${response.status})`);

    const data = await response.json();
    const curso = Array.isArray(data) ? data[0] : data;

    if (!curso)throw new Error("El curso no existe o no fue encontrado.");

    // Precargar datos
    IdCurso.value = curso.IdCurso ?? "";
    Nombre_Curso.value = curso.Nombre_Curso ?? "";
    Costo.value = curso.Costo ?? "";
    Duracion.value =  curso.Duracion ?? "";
    Fecha_Inicial.value = curso.Fecha_Inicial ?? "";
    Fecha_Fin.value = curso.Fecha_Fin ?? "";
      

  } catch (error) {
    console.error("❌ Error al obtener datos de la API:", error);
    alert("No se ha podido cargar la información del curso.");
  }

  // 🧾 Actualizar datos
  btnEditar.addEventListener("click", async () => {
    const data = {
      IdCurso: IdCurso.value,
      Nombre_Curso: Nombre_Curso.value,
      Costo: Costo.value,
      Duracion: Duracion.value,
      Fecha_Inicial: Fecha_Inicial.value,
      Fecha_Fin: Fecha_Fin.value
      
    };

    try {
      const response = await fetch(`https://corsproxy.io/?url=http://cybercenter.somee.com/api/Curso/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("📩 Respuesta del servidor:", responseText);

      if (response.ok) {
        alert("✅ Curso actualizado correctamente.");
        window.location.href = "index.html";
      } else {
        alert("⚠️ No se pudo actualizar el curso. Verifica los datos.");
      }
    } catch (error) {
      console.error("❌ Error al enviar la solicitud:", error);
      alert("Error de conexión con el servidor.");
    }
  });
});
