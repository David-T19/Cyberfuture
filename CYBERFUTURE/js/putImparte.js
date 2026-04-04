document.addEventListener("DOMContentLoaded", async () => {
  const btnEditar = document.getElementById("editar");
  const urlParams = new URLSearchParams(window.location.search);

  // Obtener los dos IDs desde la URL
  const idInstructor = urlParams.get("idInstructor");
  const idCurso = urlParams.get("idCurso");

  if (!idInstructor || !idCurso) {
    alert("No se han proporcionado los IDs necesarios para editar.");
    return;
  }

  // Inputs del formulario
  const IdInstructor = document.getElementById("Id");
  const IdCurso = document.getElementById("IdC");
  const Tematica = document.getElementById("Tematica");

  // -----------------------------------------------------
  // OBTENER EL REGISTRO COMPLETO (GET)
  // -----------------------------------------------------
  try {
    const response = await fetch(
      `http://cybercenter.somee.com/api/Imparte`
    );

    if (!response.ok) throw new Error("Error al cargar los datos.");

    const lista = await response.json();

    // Buscar el registro que coincide con los IDs
    const imparte = lista.find(
      (x) =>
        x.IdInstructor == idInstructor &&
        x.IdCurso == idCurso
    );

    if (!imparte) {
      alert("No se encontró el registro .");
      return;
    }

    // Precargar datos en el formulario
    IdInstructor.value = imparte.IdInstructor;
    IdCurso.value = imparte.IdCurso;
    Tematica.value = imparte.Tematica;

  } catch (error) {
    console.error("❌ Error en el GET:", error);
    alert("No se pudo obtener la información del registro.");
  }

  // -----------------------------------------------------
  // ACTUALIZAR REGISTRO (PUT)
  // -----------------------------------------------------
  btnEditar.addEventListener("click", async () => {

    const data = {
      IdInstructor: IdInstructor.value,
      IdCurso: IdCurso.value,
      Tematica: Tematica.value
    };

    try {
      const response = await fetch(
        `https://corsproxy.io/?url=http://cybercenter.somee.com/api/Imparte`,
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
