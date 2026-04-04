document.addEventListener("DOMContentLoaded", async () => {
  const btnEditar = document.getElementById("editar");
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("No se ha proporcionado un ID de Factura para editar.");
    return;
  }

  // Referencias a los campos
  const IdFactura = document.getElementById("Id");
  const Estado = document.getElementById("Estado");
  const Subtotal = document.getElementById("Subtotal");
  const Total = document.getElementById("Total");
  const Fecha_Emision = document.getElementById("Fecha");
  const IdAlumno = document.getElementById("Alumno");
 
 

  // 🚀 Cargar los datos del usuario
  try {
    const response = await fetch(`http://cybercenter.somee.com/api/Factura/${id}`);
    if (!response.ok) throw new Error(`Error al obtener datos (${response.status})`);

    const data = await response.json();
    const factura = Array.isArray(data) ? data[0] : data;

    if (!factura)throw new Error("La factura no existe o no fue encontrada.");

    // Precargar datos
    IdFactura.value = factura.IdFactura ?? "";
    Estado.value = factura.Estado ?? "";
    Subtotal.value = factura.Subtotal ?? "";
    Total.value =  factura.Total ?? "";
    Fecha_Emision.value = factura.Total ?? "";
    IdAlumno.value = factura.IdAlumno ?? "";
      

  } catch (error) {
    console.error("❌ Error al obtener datos de la API:", error);
    alert("No se ha podido cargar la información de la factura.");
  }

  // 🧾 Actualizar datos
  btnEditar.addEventListener("click", async () => {
    const data = {
      IdFactura: IdFactura.value,
      Estado: Estado.value,
      Subtotal: Subtotal.value,
      Total: Total.value,
      Fecha_Emision: Fecha_Emision.value,
      IdAlumno: IdAlumno.value
      
    };

    try {
      const response = await fetch(`https://corsproxy.io/?url=http://cybercenter.somee.com/api/Factura/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("📩 Respuesta del servidor:", responseText);

      if (response.ok) {
        alert("✅ Factura actualizada correctamente.");
        window.location.href = "index.html";
      } else {
        alert("⚠️ No se pudo actualizar la factura. Verifica los datos.");
      }
    } catch (error) {
      console.error("❌ Error al enviar la solicitud:", error);
      alert("Error de conexión con el servidor.");
    }
  });
});
