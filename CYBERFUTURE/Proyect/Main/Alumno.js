 // Variables globales
        let datosFacturas = [];
        let datosAlumnos = [];
        let timeoutFactura, timeoutAlumno;


// ==================== DESTRUIR SESIÓN ====================

function destroySession() {
    // 1. Confirmación
    if (!confirm('⚠️ ¿ESTÁS SEGURO?\n\nSe cerrará la sesión y se eliminarán todos los datos temporales.')) {
        return;
    }
    
    // 2. Deshabilitar botón
    const btn = document.getElementById('btnCerrarSesion');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cerrando...';
        btn.disabled = true;
    }
    
    // 3. Animación de cierre
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.5s';
    
    // 4. Limpiar datos
    setTimeout(() => {
        // Lista completa de datos a eliminar
        const itemsToRemove = [
            'userType', 'userEmail', 'userName', 'userId',
            'token', 'sessionData', 'lastLogin', 'userPreferences'
        ];
        
        // Eliminar de localStorage
        itemsToRemove.forEach(item => localStorage.removeItem(item));
        
        // Eliminar de sessionStorage
        sessionStorage.clear();
        
        // 5. Redirigir
        setTimeout(() => {
            window.location.href = "../View Login/login.html?session=destroyed&t=" + Date.now();
            
            // Forzar recarga sin cache
            if (window.location.href.includes('login.html')) {
                window.location.reload(true);
            }
        }, 500);
        
    }, 1000);
}

// ==================== CONFIGURAR BOTÓN ====================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión
    if (!localStorage.getItem('userEmail')) {
        alert('No hay sesión activa');
        window.location.href = "../View Login/login.html";
        return;
    }
    
    // Configurar botón
    const logoutBtn = document.getElementById('btnCerrarSesion');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            destroySession();
        });
        
        // text
        logoutBtn.innerHTML = '<i class="fas fa-power-off"></i> Cerrar Sesion';
        logoutBtn.style.background = 'linear-gradient(135deg, #f80657ff, #c82333)';
    }
    
    
});


        // Cargar todos los datos al iniciar
        document.addEventListener("DOMContentLoaded", async () => {
            mostrarCarga(true);
            
            try {
                console.log('🔄 Cargando datos del sistema...');
                
                // Cargar datos de Facturas
                console.log('📥 Cargando Facturas...');
                const facturasResponse = await fetch(
                    'http://cybercenter.somee.com/api/Factura/'
                );
                
                if (!facturasResponse.ok) throw new Error('Error al cargar Facturas');
                datosFacturas = await facturasResponse.json();
                console.log(`✅ ${datosFacturas.length} facturas cargadas`);
                
                // Cargar datos de Alumnos
                console.log('📥 Cargando Alumnos...');
                const alumnosResponse = await fetch(
                    'http://cybercenter.somee.com/api/Alumno/'
                );
                
                if (!alumnosResponse.ok) throw new Error('Error al cargar Alumnos');
                datosAlumnos = await alumnosResponse.json();
                console.log(`✅ ${datosAlumnos.length} alumnos cargados`);
                
                // Actualizar estadísticas
                actualizarEstadisticas();
                
            } catch (error) {
                console.error('❌ Error al cargar datos:', error);
                mostrarError('No se pudo conectar con el servidor. Intenta recargar la página.');
            } finally {
                mostrarCarga(false);
            }
        });

        // Actualizar estadísticas
        function actualizarEstadisticas() {
            document.getElementById('statsFactura').textContent = datosFacturas.length;
            document.getElementById('statsAlumno').textContent = datosAlumnos.length;
            
            // Calcular total de facturas
            let totalFacturado = 0;
            let facturasPagas = 0;
            let facturasPendientes = 0;
            
            datosFacturas.forEach(factura => {
                if (factura.Total) {
                    totalFacturado += parseFloat(factura.Total);
                }
                if (factura.Estado) {
                    if (factura.Estado.toLowerCase().includes('paga')) {
                        facturasPagas++;
                    } else if (factura.Estado.toLowerCase().includes('pendiente')) {
                        facturasPendientes++;
                    }
                }
            });
            
            console.log(`💰 Total facturado: $${totalFacturado.toLocaleString()}`);
            console.log(`✅ Facturas pagas: ${facturasPagas}`);
            console.log(`⏳ Facturas pendientes: ${facturasPendientes}`);
        }

        // ==================== FUNCIONES PARA FACTURAS ====================

        function buscarFactura() {
            const searchTerm = document.getElementById('searchFactura').value.trim().toLowerCase();
            const resultsContainer = document.getElementById('resultsFactura');
            const resultsCount = document.getElementById('countFactura');
            
            if (!searchTerm) {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-file-invoice-dollar fa-3x mb-3"></i>
                        <h5>Ingresa un término para buscar</h5>
                        <p>Busca por ID Factura, Estado, ID Alumno, Monto, etc.</p>
                    </div>
                `;
                resultsCount.textContent = '0 resultados';
                return;
            }
            
            // Validar longitud mínima
            if (searchTerm.length < 2) {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3" style="color: #ffd166;"></i>
                        <h5>Búsqueda muy corta</h5>
                        <p>Escribe al menos 2 caracteres</p>
                    </div>
                `;
                resultsCount.textContent = '0 resultados';
                return;
            }
            
            // Filtrar facturas
            const resultados = datosFacturas.filter(factura => {
                return (
                    (factura.IdFactura && factura.IdFactura.toString().toLowerCase().includes(searchTerm)) ||
                    (factura.Estado && factura.Estado.toLowerCase().includes(searchTerm)) ||
                    (factura.Subtotal && factura.Subtotal.toString().includes(searchTerm)) ||
                    (factura.Total && factura.Total.toString().includes(searchTerm)) ||
                    (factura.Fecha_Emision && factura.Fecha_Emision.toLowerCase().includes(searchTerm)) ||
                    (factura.IdAlumno && factura.IdAlumno.toString().toLowerCase().includes(searchTerm))
                );
            });
            
            // Mostrar resultados
            if (resultados.length > 0) {
                resultsCount.textContent = `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''}`;
                mostrarResultadosFactura(resultados, searchTerm);
            } else {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search fa-3x mb-3"></i>
                        <h5>No se encontraron facturas</h5>
                        <p>Intenta con otro término de búsqueda</p>
                    </div>
                `;
                resultsCount.textContent = '0 resultados';
            }
        }

        function mostrarResultadosFactura(resultados, searchTerm) {
            const resultsContainer = document.getElementById('resultsFactura');
            let html = '';
            
            resultados.forEach((factura, index) => {
                // Formatear montos
                const subtotal = factura.Subtotal ? parseFloat(factura.Subtotal).toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) : '0.00';
                
                const total = factura.Total ? parseFloat(factura.Total).toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) : '0.00';
                
                // Determinar clase del estado
                let estadoClass = 'badge-estado ';
                if (factura.Estado) {
                    const estadoLower = factura.Estado.toLowerCase();
                    if (estadoLower.includes('paga')) {
                        estadoClass += 'estado-paga';
                    } else if (estadoLower.includes('pendiente')) {
                        estadoClass += 'estado-pendiente';
                    } else if (estadoLower.includes('cancelada')) {
                        estadoClass += 'estado-cancelada';
                    } else {
                        estadoClass += 'estado-pendiente';
                    }
                }
                
                // Formatear fecha
                let fechaFormateada = 'No disponible';
                if (factura.Fecha_Emision) {
                    try {
                        const fecha = new Date(factura.Fecha_Emision);
                        fechaFormateada = fecha.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    } catch (e) {
                        fechaFormateada = factura.Fecha_Emision;
                    }
                }
                
                html += `
                    <div class="result-item result-factura">
                        <div class="mb-3">
                            <span class="badge badge-factura">
                                <i class="fas fa-hashtag me-1"></i>ID: ${factura.IdFactura || 'N/A'}
                            </span>
                            <span class="${estadoClass}">
                                <i class="fas fa-circle me-1" style="font-size: 0.6rem;"></i>
                                ${factura.Estado || 'Sin estado'}
                            </span>
                        </div>
                        
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <tbody>
                                    <tr>
                                        <td><strong><i class="fas fa-hashtag me-2"></i>ID Factura:</strong></td>
                                        <td>${resaltarTermino(factura.IdFactura || '', searchTerm)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-tag me-2"></i>Estado:</strong></td>
                                        <td>${resaltarTermino(factura.Estado || '', searchTerm)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-money-bill-wave me-2"></i>Subtotal:</strong></td>
                                        <td>
                                            <span class="monto">$${resaltarTermino(subtotal, searchTerm)}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-money-bill me-2"></i>Total:</strong></td>
                                        <td>
                                            <span class="monto monto-total">$${resaltarTermino(total, searchTerm)}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-calendar me-2"></i>Fecha Emisión:</strong></td>
                                        <td class="fecha">${resaltarTermino(fechaFormateada, searchTerm)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-user-graduate me-2"></i>ID Alumno:</strong></td>
                                        <td>${resaltarTermino(factura.IdAlumno || '', searchTerm)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Mostrar nombre del alumno si está disponible -->
                        ${mostrarNombreAlumno(factura.IdAlumno)}
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = html;
        }

        // Función para mostrar nombre del alumno si existe
        function mostrarNombreAlumno(idAlumno) {
            if (!idAlumno || !datosAlumnos.length) return '';
            
            const alumno = datosAlumnos.find(a => a.IdAlumno == idAlumno);
            if (!alumno) return '';
            
            return `
                <div class="mt-3 p-3" style="background: rgba(114, 9, 183, 0.05); border-radius: 8px; border-left: 3px solid var(--alumno-color);">
                    <p class="mb-1"><strong><i class="fas fa-user-graduate me-2"></i>Alumno asociado:</strong></p>
                    <p class="mb-0">${alumno.Nombre_Alumno || ''} ${alumno.Apellido_Alumno || ''} (ID: ${alumno.IdAlumno})</p>
                </div>
            `;
        }

        function ejemploFactura(termino) {
            document.getElementById('searchFactura').value = termino;
            document.getElementById('searchFactura').focus();
            buscarFactura();
        }

        // Búsqueda en tiempo real para Facturas
        document.getElementById('searchFactura').addEventListener('input', function() {
            clearTimeout(timeoutFactura);
            
            const searchTerm = this.value.trim();
            
            if (!searchTerm) {
                document.getElementById('resultsFactura').innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-file-invoice-dollar fa-3x mb-3"></i>
                        <h5>Busca facturas</h5>
                        <p>Usa el campo de búsqueda superior</p>
                    </div>
                `;
                document.getElementById('countFactura').textContent = '0 resultados';
                return;
            }
            
            if (searchTerm.length === 1) {
                document.getElementById('resultsFactura').innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-ellipsis-h fa-3x mb-3"></i>
                        <p>Escribiendo...</p>
                    </div>
                `;
                return;
            }
            
            timeoutFactura = setTimeout(() => {
                buscarFactura();
            }, 500);
        });

        // ==================== FUNCIONES PARA ALUMNOS ====================

        function buscarAlumno() {
            const searchTerm = document.getElementById('searchAlumno').value.trim().toLowerCase();
            const resultsContainer = document.getElementById('resultsAlumno');
            const resultsCount = document.getElementById('countAlumno');
            
            if (!searchTerm) {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-user-graduate fa-3x mb-3"></i>
                        <h5>Ingresa un término para buscar</h5>
                        <p>Busca por nombre, apellido, teléfono, email, etc.</p>
                    </div>
                `;
                resultsCount.textContent = '0 resultados';
                return;
            }
            
            // Validar longitud mínima
            if (searchTerm.length < 2) {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-exclamation-triangle fa-3x mb-3" style="color: #ffd166;"></i>
                        <h5>Búsqueda muy corta</h5>
                        <p>Escribe al menos 2 caracteres</p>
                    </div>
                `;
                resultsCount.textContent = '0 resultados';
                return;
            }
            
            // Filtrar alumnos
            const resultados = datosAlumnos.filter(alumno => {
                return (
                    (alumno.IdAlumno && alumno.IdAlumno.toString().toLowerCase().includes(searchTerm)) ||
                    (alumno.Nombre_Alumno && alumno.Nombre_Alumno.toLowerCase().includes(searchTerm)) ||
                    (alumno.Apellido_Alumno && alumno.Apellido_Alumno.toLowerCase().includes(searchTerm)) ||
                    (alumno.Edad_Alumno && alumno.Edad_Alumno.toString().includes(searchTerm)) ||
                    (alumno.Telefono_Alumno && alumno.Telefono_Alumno.includes(searchTerm)) ||
                    (alumno.Correo_Alumno && alumno.Correo_Alumno.toLowerCase().includes(searchTerm)) ||
                    (alumno.IdPractica && alumno.IdPractica.toString().includes(searchTerm))
                );
            });
            
            // Mostrar resultados
            if (resultados.length > 0) {
                resultsCount.textContent = `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''}`;
                mostrarResultadosAlumno(resultados, searchTerm);
            } else {
                resultsContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search fa-3x mb-3"></i>
                        <h5>No se encontraron alumnos</h5>
                        <p>Intenta con otro término de búsqueda</p>
                    </div>
                `;
                resultsCount.textContent = '0 resultados';
            }
        }

        function mostrarResultadosAlumno(resultados, searchTerm) {
            const resultsContainer = document.getElementById('resultsAlumno');
            let html = '';
            
            resultados.forEach((alumno, index) => {
                // Crear filas de la tabla
                html += `
                    <div class="result-item result-alumno">
                        <div class="mb-3">
                            <span class="badge badge-alumno">
                                <i class="fas fa-id-card me-1"></i>ID: ${alumno.IdAlumno || 'N/A'}
                            </span>
                            <span class="badge badge-alumno">
                                <i class="fas fa-user me-1"></i>${alumno.Nombre_Alumno || ''} ${alumno.Apellido_Alumno || ''}
                            </span>
                        </div>
                        
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <tbody>
                                    <tr>
                                        <td><strong><i class="fas fa-user me-2"></i>Nombre:</strong></td>
                                        <td>${resaltarTermino(alumno.Nombre_Alumno || '', searchTerm)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-user me-2"></i>Apellido:</strong></td>
                                        <td>${resaltarTermino(alumno.Apellido_Alumno || '', searchTerm)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-calendar me-2"></i>Edad:</strong></td>
                                        <td>${resaltarTermino(alumno.Edad_Alumno || '', searchTerm)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-phone me-2"></i>Teléfono:</strong></td>
                                        <td>${resaltarTermino(alumno.Telefono_Alumno || '', searchTerm)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-envelope me-2"></i>Correo:</strong></td>
                                        <td>${resaltarTermino(alumno.Correo_Alumno || '', searchTerm)}</td>
                                    </tr>
                                    <tr>
                                        <td><strong><i class="fas fa-clipboard-list me-2"></i>ID Práctica:</strong></td>
                                        <td>${resaltarTermino(alumno.IdPractica || '', searchTerm)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = html;
        }

        // Función para resaltar términos en los resultados
        function resaltarTermino(texto, termino) {
            if (!texto || !termino) return texto || '';
            if (texto.toString().toLowerCase().includes(termino)) {
                const regex = new RegExp(`(${termino})`, 'gi');
                return texto.toString().replace(regex, '<mark>$1</mark>');
            }
            return texto;
        }

        function ejemploAlumno(termino) {
            document.getElementById('searchAlumno').value = termino;
            document.getElementById('searchAlumno').focus();
            buscarAlumno();
        }

        // Búsqueda en tiempo real para Alumnos
        document.getElementById('searchAlumno').addEventListener('input', function() {
            clearTimeout(timeoutAlumno);
            
            const searchTerm = this.value.trim();
            
            if (!searchTerm) {
                document.getElementById('resultsAlumno').innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-user-graduate fa-3x mb-3"></i>
                        <h5>Busca alumnos</h5>
                        <p>Usa el campo de búsqueda superior</p>
                    </div>
                `;
                document.getElementById('countAlumno').textContent = '0 resultados';
                return;
            }
            
            if (searchTerm.length === 1) {
                document.getElementById('resultsAlumno').innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-ellipsis-h fa-3x mb-3"></i>
                        <p>Escribiendo...</p>
                    </div>
                `;
                return;
            }
            
            timeoutAlumno = setTimeout(() => {
                buscarAlumno();
            }, 500);
        });

        // Permitir búsqueda con Enter en ambos campos
        document.getElementById('searchFactura').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarFactura();
            }
        });

        document.getElementById('searchAlumno').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarAlumno();
            }
        });

        // Función para mostrar/ocultar carga
        function mostrarCarga(mostrar) {
            const spinner = document.getElementById('loadingSpinner');
            spinner.style.display = mostrar ? 'block' : 'none';
        }

        // Función para mostrar error
        function mostrarError(mensaje) {
            // Mostrar error en ambas secciones
            const resultadosFactura = document.getElementById('resultsFactura');
            const resultadosAlumno = document.getElementById('resultsAlumno');
            
            resultadosFactura.innerHTML = `
                <div class="alert alert-danger m-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="mb-1">Error de conexión</h5>
                            <p class="mb-0">${mensaje}</p>
                        </div>
                    </div>
                </div>
            `;
            
            resultadosAlumno.innerHTML = `
                <div class="alert alert-danger m-3">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                        <div>
                            <h5 class="mb-1">Error de conexión</h5>
                            <p class="mb-0">${mensaje}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Enfocar automáticamente el primer campo de búsqueda
        setTimeout(() => {
            document.getElementById('searchFactura').focus();
        }, 1000);
         
        
        
        // sesion.js - Para incluir en todas las páginas protegidas

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay sesión activa
    const userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userType || !userEmail) {
        // No hay sesión, redirigir al login
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = "../View Login/login.html";
        return;
    }
    
    // Mostrar información del usuario en consola (opcional)
    console.log(`Usuario activo: ${userEmail} (${userType})`);
    
    // Crear botón de cerrar sesión si no existe
    if (!document.querySelector('#logoutBtn')) {
        const header = document.querySelector('.header ul');
        if (header) {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" id="logoutBtn" style="color: #ff6b6b; font-weight: 600;">
                    <i class="fas fa-sign-out-alt"></i> CERRAR SESIÓN
                </a>
            `;
            header.appendChild(li);
            
            // Agregar evento
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('¿Estás seguro de cerrar sesión?')) {
                    localStorage.removeItem('userType');
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userId');
                    window.location.href = "../View Login/login.html";
                }
            });
        }
    }
    
    // Opcional: Mostrar nombre de usuario en alguna parte
    const userName = localStorage.getItem('userName') || userEmail.split('@')[0];
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        userDisplay.textContent = `Hola, ${userName}`;
    }
});
