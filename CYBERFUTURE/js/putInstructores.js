document.addEventListener("DOMContentLoaded", async () => {
  const btnEditar = document.getElementById("editar");
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    alert("No se ha proporcionado un ID de usuario para editar.");
    return;
  }

  // Referencias a los campos
  const IdInstructor = document.getElementById("Id");
  const Nombre_Instructor = document.getElementById("Nombre");
  const Apellido_Instructor = document.getElementById("Apellido");
  const Edad_Instructor = document.getElementById("Edad");
  const Telefono_Instructor = document.getElementById("Telefono");
 
  // 🚀 Cargar los datos del usuario
  try {
    const response = await fetch(`http://cybercenter.somee.com/api/Instructor/${id}`);
    if (!response.ok) throw new Error(`Error al obtener datos (${response.status})`);

    const data = await response.json();
    const instructor = Array.isArray(data) ? data[0] : data;

    if (!instructor) throw new Error("El instructor no existe o no fue encontrado.");

    // Precargar datos
    IdInstructor.value = instructor.IdInstructor ?? "";
    Nombre_Instructor.value = instructor.Nombre_Instructor ?? "";
    Apellido_Instructor.value = instructor.Apellido_Instructor ?? "";
    Edad_Instructor.value = instructor.Edad_Instructor ?? "";
    Telefono_Instructor.value = instructor.Telefono_Instructor ?? "";
   
  } catch (error) {
    console.error("❌ Error al obtener datos de la API:", error);
    alert("No se ha podido cargar la información del usuario.");
  }

  // 🧾 Actualizar datos
  btnEditar.addEventListener("click", async () => {
    const data = {
      IdInstructor: IdInstructor.value,
      Nombre_Instructor: Nombre_Instructor.value,
      Apellido_Instructor: Apellido_Instructor.value,
      Edad_Instructor: Edad_Instructor.value,
      Telefono_Instructor: Telefono_Instructor.value
    };

    try {
      const response = await fetch(`https://corsproxy.io/?url=http://cybercenter.somee.com/api/Instructor/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("📩 Respuesta del servidor:", responseText);

      if (response.ok) {
        alert("✅ Instructor actualizado correctamente.");
        window.location.href = "index.html";
      } else {
        alert("⚠️ No se pudo actualizar el Instructor. Verifica los datos.");
      }
    } catch (error) {
      console.error("❌ Error al enviar la solicitud:", error);
      alert("Error de conexión con el servidor.");
    }
  });
});
