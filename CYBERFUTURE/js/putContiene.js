document.addEventListener("DOMContentLoaded", async () => {
  const btnEditar = document.getElementById("editar");
  const urlParams = new URLSearchParams(window.location.search);

  // Obtener los dos IDs desde la URL
  const idCurso = urlParams.get("idCurso");
  const idFactura = urlParams.get("idFactura");

  if (!idCurso || !idFactura) {
    alert("No se han proporcionado los IDs necesarios para editar.");
    return;
  }

  // Inputs del formulario
  const IdCurso = document.getElementById("Id");
  const IdFactura = document.getElementById("IdF");
  const Detalle = document.getElementById("Detalle");

  // -----------------------------------------------------
  // OBTENER EL REGISTRO COMPLETO (GET)
  // -----------------------------------------------------
  try {
    const response = await fetch(
      `http://cybercenter.somee.com/api/Contiene`
    );

    if (!response.ok) throw new Error("Error al cargar los datos.");

    const lista = await response.json();

    // Buscar el registro que coincide con los IDs
    const contiene = lista.find(
      (x) =>
        x.IdCurso == idCurso &&
        x.IdFactura == idFactura
    );

    if (!contiene) {
      alert("No se encontró el registro Contiene.");
      return;
    }

    // Precargar datos en el formulario
    IdCurso.value = contiene.IdCurso;
    IdFactura.value = contiene.IdFactura;
    Detalle.value = contiene.Detalle;

  } catch (error) {
    console.error("❌ Error en el GET:", error);
    alert("No se pudo obtener la información del registro.");
  }

  // -----------------------------------------------------
  // ACTUALIZAR REGISTRO (PUT)
  // -----------------------------------------------------
  btnEditar.addEventListener("click", async () => {

    const data = {
      IdCurso: IdCurso.value,
      IdFactura: IdFactura.value,
      Detalle: Detalle.value
    };

    try {
      const response = await fetch(
        `https://corsproxy.io/?url=http://cybercenter.somee.com/api/Contiene`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );

      const respuesta = await response.text();
      console.log("📩 Respuesta del servidor:", respuesta);

      if (response.ok) {
        alert("✅ Registro actualizado correctamente.");
        window.location.href = "index.html";
      } else {
        alert("⚠️ No se pudo actualizar el registro.");
      }

    } catch (error) {
      console.error("❌ Error en el PUT:", error);
      alert("Error al enviar la actualización al servidor.");
    }
  });
});
