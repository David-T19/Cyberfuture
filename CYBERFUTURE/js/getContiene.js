document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("cuerpoTabla");
  const loadingElement = document.getElementById("loading");
  const offlineMessageElement = document.getElementById("offlineMessage");
  const connectionStatusElement = document.getElementById("connectionStatus");
  const debugInfoElement = document.getElementById("debugInfo");
  const debugContentElement = document.getElementById("debugContent");
  const debugBtn = document.getElementById("debugBtn");
  const retryBtn = document.getElementById("retryConnection");

  let paginaActual = 1;
  const tamañoPagina = 10;
  let datosReales = [];

  // Probar conexión con la API
  async function probarConexion() {
    const endpoint = "http://cybercenter.somee.com/api/Contiene/";
    const resultados = [];

    try {
      const inicio = Date.now();
      const response = await fetch(endpoint);
      const tiempo = Date.now() - inicio;

      if (response.ok) {
        const data = await response.json();
        resultados.push({ endpoint, status: "✅ OK", tiempo: `${tiempo}ms` });
        mostrarDebugInfo(resultados);
        return { exito: true, data, tiempo };
      } else {
        resultados.push({ endpoint, status: `❌ ${response.status}`, tiempo: `${tiempo}ms` });
        mostrarDebugInfo(resultados);
        return { exito: false };
      }
    } catch (error) {
      resultados.push({ endpoint, status: `❌ ${error.name}`, tiempo: "N/A" });
      mostrarDebugInfo(resultados);
      return { exito: false };
    }
  }

  // Mostrar tabla con resultados de conexión
  function mostrarDebugInfo(resultados) {
    let html = '<table class="table table-sm"><tr><th>Endpoint</th><th>Estado</th><th>Tiempo</th></tr>';
    resultados.forEach(r => {
      html += `<tr><td><small>${r.endpoint}</small></td><td>${r.status}</td><td>${r.tiempo}</td></tr>`;
    });
    html += "</table>";
    debugContentElement.innerHTML = html;
  }

  // Cargar datos desde la API
  async function cargarDatos() {
    mostrarCargando(true);
    offlineMessageElement.style.display = "none";
    try {
      const resultado = await probarConexion();
      if (resultado.exito) {
        datosReales = resultado.data;
        paginaActual = 1;
        renderizarTabla(datosReales);
        actualizarPaginacion(datosReales.length);
        connectionStatusElement.textContent = `🟢 Conectado (${resultado.tiempo}ms)`;
      } else {
        throw new Error("No se pudo conectar a la API");
      }
    } catch {
      tabla.innerHTML = `<tr><td colspan="9" class="text-center text-danger py-4">Error de conexión con el servidor</td></tr>`;
      offlineMessageElement.style.display = "block";
      connectionStatusElement.textContent = "🔴 Sin conexión con el servidor";
    } finally {
      mostrarCargando(false);
    }
  }

  // Renderizar tabla - CORREGIDO
  function renderizarTabla(datos) {
    const inicio = (paginaActual - 1) * tamañoPagina;
    const fin = inicio + tamañoPagina;
    const datosPaginados = datos.slice(inicio, fin);
    tabla.innerHTML = "";

    if (datosPaginados.length === 0) {
      tabla.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No hay datos</td></tr>`;
      return;
    }

    datosPaginados.forEach(contiene => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${contiene.IdCurso ?? ""}</td>
        <td>${contiene.IdFactura ?? ""}</td>
        <td>${contiene.Detalle ?? ""}</td>
           
        <td class="text-center">
            <button 
            value='${JSON.stringify({idCurso: contiene.IdCurso, idFactura: contiene.IdFactura})}' 
            class="btn btn-sm btn-warning btn-editar"
          >
            Editar
          </button>
          <button 
            value='${JSON.stringify({idCurso: contiene.IdCurso, idFactura: contiene.IdFactura})}' 
            class="btn btn-sm btn-danger btn-borrar"
          >
            Eliminar
          </button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  // Mostrar/ocultar indicador de carga
  function mostrarCargando(mostrar) {
    loadingElement.style.display = mostrar ? "block" : "none";
  }

  // Actualizar paginación
  function actualizarPaginacion(total) {
    const totalPaginas = Math.max(1, Math.ceil(total / tamañoPagina));
    document.getElementById("paginaAnterior").disabled = paginaActual <= 1;
    document.getElementById("paginaSiguiente").disabled = paginaActual >= totalPaginas;
    document.getElementById("infoPagina").textContent = `Página ${paginaActual} de ${totalPaginas}`;
  }

  // Delegación de eventos para editar y eliminar - CORREGIDO
  tabla.addEventListener("click", async (event) => {
    const target = event.target;

    // 🔴 ELIMINAR REGISTRO - CORREGIDO
    if (target.classList.contains("btn-borrar")) {
      try {
        // Obtener ambos IDs del value
        const ids = JSON.parse(target.value);
        const idCurso = ids.idCurso;
        const idFactura = ids.idFactura;

        if (confirm(`¿Eliminar este registro?\nCurso: ${idCurso}\nFactura: ${idFactura}`)) {
          
          // PROBAR DIFERENTES FORMATOS DE URL
          let response;
          let success = false;
          
          // Intento 1: DELETE con ambos IDs en la URL
          try {
            response = await fetch(`https://corsproxy.io/?url=http://cybercenter.somee.com/api/Contiene/${idCurso}/${idFactura}`, {
              method: "DELETE"
            });
            if (response.ok) success = true;
          } catch (e) {}
          
          // Intento 2: DELETE con body (si el anterior falla)
          if (!success) {
            try {
              response = await fetch("https://corsproxy.io/?url=http://cybercenter.somee.com/api/Contiene/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ IdCurso: idCurso, IdFactura: idFactura })
              });
              if (response.ok) success = true;
            } catch (e) {}
          }

          if (!success) {
            throw new Error(`Error al eliminar (${response?.status || 'Desconocido'})`);
          }

          // Eliminar la fila visualmente y actualizar datos
          const fila = target.closest("tr");
          fila.remove();

          // Actualizar datos en memoria
          datosReales = datosReales.filter(item => 
            !(item.IdCurso == idCurso && item.IdFactura == idFactura)
          );

          // Re-renderizar tabla
          renderizarTabla(datosReales);
          actualizarPaginacion(datosReales.length);

          alert("✅ Registro eliminado correctamente");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("⚠️ Error: " + err.message);
      }
      return;
    }

    // 🟡 EDITAR REGISTRO - CORREGIDO
    if (target.classList.contains("btn-editar")) {
      try {
        const ids = JSON.parse(target.value);
        const idCurso = ids.idCurso;
        const idFactura = ids.idFactura;
        
        // Pasar ambos IDs como parámetros
        window.location.href = `../view Contiene/editar.html?idCurso=${encodeURIComponent(idCurso)}&idFactura=${encodeURIComponent(idFactura)}`;
      } catch (err) {
        console.error("Error al editar:", err);
        alert("Error al procesar la edición");
      }
      return;
    }
  });

  // Botones de paginación
  document.getElementById("paginaAnterior").addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      renderizarTabla(datosReales);
      actualizarPaginacion(datosReales.length);
    }
  });

  document.getElementById("paginaSiguiente").addEventListener("click", () => {
    const totalPaginas = Math.max(1, Math.ceil(datosReales.length / tamañoPagina));
    if (paginaActual < totalPaginas) {
      paginaActual++;
      renderizarTabla(datosReales);
      actualizarPaginacion(datosReales.length);
    }
  });

  // Mostrar/ocultar depuración
  debugBtn.addEventListener("click", () => {
    debugInfoElement.style.display = debugInfoElement.style.display === "none" ? "block" : "none";
  });

  // Reintentar conexión
  retryBtn.addEventListener("click", cargarDatos);

  // Cargar datos al iniciar
  cargarDatos();
});