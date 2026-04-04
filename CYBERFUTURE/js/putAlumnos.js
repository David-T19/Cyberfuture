document.addEventListener("DOMContentLoaded", async () => {
  const btnEditar = document.getElementById("editar");
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("No se ha proporcionado un ID de usuario para editar.");
    return;
  }

  // Referencias a los campos
  const IdAlumno = document.getElementById("Id");
  const Nombre_Alumno = document.getElementById("Nombre");
  const Apellido_Alumno = document.getElementById("Apellido");
  const Edad_Alumno = document.getElementById("Edad");
  const Telefono_Alumno = document.getElementById("Telefono");
  const Correo_Alumno = document.getElementById("Correo");
  const IdPractica = document.getElementById("Practica");
 

  // 🚀 Cargar los datos del usuario
  try {
    const response = await fetch(`http://cybercenter.somee.com/api/Alumno/${id}`);
    if (!response.ok) throw new Error(`Error al obtener datos (${response.status})`);

    const data = await response.json();
    const alumno = Array.isArray(data) ? data[0] : data;

    if (!alumno) throw new Error("El alumno no existe o no fue encontrado.");

    // Precargar datos
    IdAlumno.value = alumno.IdAlumno ?? "";
    Nombre_Alumno.value = alumno.Nombre_Alumno ?? "";
    Apellido_Alumno.value = alumno.Apellido_Alumno ?? "";
    Edad_Alumno.value =  alumno.Edad_Alumno ?? "";
    Telefono_Alumno.value = alumno.Telefono_Alumno ?? "";
    Correo_Alumno.value = alumno.Correo_Alumno ?? "";
    IdPractica.value = alumno.IdPractica ?? "";
    

  } catch (error) {
    console.error("❌ Error al obtener datos de la API:", error);
    alert("No se ha podido cargar la información del alumno.");
  }

  // 🧾 Actualizar datos
  btnEditar.addEventListener("click", async () => {
    const data = {
      IdAlumno: IdAlumno.value,
      Nombre_Alumno: Nombre_Alumno.value,
      Apellido_Alumno: Apellido_Alumno.value,
      Edad_Alumno: Edad_Alumno.value,
      Telefono_Alumno: Telefono_Alumno.value,
      Correo_Alumno: Correo_Alumno.value,
      IdPractica: IdPractica.value
    };

    try {
      const response = await fetch(`https://corsproxy.io/?url=http://cybercenter.somee.com/api/Alumno/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("📩 Respuesta del servidor:", responseText);

      if (response.ok) {
        alert("✅ Alumno actualizado correctamente.");
        window.location.href = "index.html";
      } else {
        alert("⚠️ No se pudo actualizar el alumno. Verifica los datos.");
      }
    } catch (error) {
      console.error("❌ Error al enviar la solicitud:", error);
      alert("Error de conexión con el servidor.");
    }
  });
});
