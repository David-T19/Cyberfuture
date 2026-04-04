document.addEventListener("DOMContentLoaded", async () => {
  const btnEditar = document.getElementById("editar");
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("No se ha proporcionado un ID de Factura para editar.");
    return;
  }

  // Referencias a los campos
    const IdPractica = document.getElementById("Id");
    const No_Horas = document.getElementById("No_Horas");
    const Fecha_Inicio = document.getElementById("Fecha_Inicio");
    const Fecha_Final = document.getElementById("Fecha_Final");
   
 

  // 🚀 Cargar los datos del usuario
  try {
    const response = await fetch(`http://cybercenter.somee.com/api/PracticasEmpresariales/${id}`);
    if (!response.ok) throw new Error(`Error al obtener datos (${response.status})`);

    const data = await response.json();
    const practica = Array.isArray(data) ? data[0] : data;

    if (!practica)throw new Error("La practica no existe o no fue encontrada.");

    // Precargar datos
    IdPractica.value = practica.IdPractica ?? "";
    No_Horas.value = practica.No_Horas ?? "";
    Fecha_Inicio.value = practica.Fecha_Inicio ?? "";
    Fecha_Final.value = practica.Fecha_Final ?? "";
      

  } catch (error) {
    console.error("❌ Error al obtener datos de la API:", error);
    alert("No se ha podido cargar la información de la practica.");
  }

  // 🧾 Actualizar datos
  btnEditar.addEventListener("click", async () => {
    const data = {
      IdPractica: IdPractica.value,
      No_Horas: No_Horas.value,
      Fecha_Inicio: Fecha_Inicio.value,
      Fecha_Final: Fecha_Final.value
            
    };

    try {
      const response = await fetch(`https://corsproxy.io/?url=http://cybercenter.somee.com/api/PracticasEmpresariales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("📩 Respuesta del servidor:", responseText);

      if (response.ok) {
        alert("✅ Practica actualizada correctamente.");
        window.location.href = "index.html";
      } else {
        alert("⚠️ No se pudo actualizar la practica. Verifica los datos.");
      }
    } catch (error) {
      console.error("❌ Error al enviar la solicitud:", error);
      alert("Error de conexión con el servidor.");
    }
  });
});
