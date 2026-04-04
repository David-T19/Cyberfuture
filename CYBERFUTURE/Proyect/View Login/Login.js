document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    const links = document.querySelectorAll('a[data-view]');
    const container = document.getElementById('main-container');
    
    // Función para cambiar de vista
    function showView(viewId) {
        views.forEach(view => {
            view.classList.remove('active');
        });

        document.getElementById(`${viewId}-view`).classList.add('active');
        
        navButtons.forEach(btn => {
            if (btn.getAttribute('data-view') === viewId) {
                btn.classList.add('active');
                if (viewId === 'alumno') {
                    container.classList.add('alumno');
                } else {
                    container.classList.remove('alumno');
                }
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Navegación entre vistas
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewId = this.getAttribute('data-view');
            showView(viewId);
        });
    });

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const viewId = this.getAttribute('data-view');
            showView(viewId);
        });
    });

    // Mostrar login por defecto
    showView('login');

    // =============================
    //      BOTONES DE INTERCAMBIO LOGIN/REGISTRO
    // =============================
    
    // Botón "Registrarse" en el formulario de login
    const btnRegistrarse = document.getElementById('btn-registrarse');
    if (btnRegistrarse) {
        btnRegistrarse.addEventListener('click', function(e) {
            e.preventDefault();
            showView('alumno');
        });
    }

    // Botón "Iniciar Sesión" en el formulario de registro
    const btnIniciarSesion = document.getElementById('btn-iniciar-sesion');
    if (btnIniciarSesion) {
        btnIniciarSesion.addEventListener('click', function(e) {
            e.preventDefault();
            showView('login');
        });
    }

    // =============================
    //      LOGIN CON VERIFICACIÓN REAL
    // =============================
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('login-message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const tipoUsuario = document.getElementById('tipoUsuario').value.toLowerCase();
        const correo = document.getElementById('loginCorreo').value.trim();
        const contrasena = document.getElementById('loginContrasena').value;

        // Validación básica
        if (!tipoUsuario || !correo || !contrasena) {
            showMessage(loginMessage, 'Por favor, completa todos los campos', 'error');
            return;
        }

        // Validación de formato de correo (opcional pero recomendado)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            showMessage(loginMessage, 'Por favor ingresa un correo electrónico válido', 'error');
            return;
        }

        loginForm.classList.add('loading');
        showMessage(loginMessage, 'Verificando credenciales...', 'success');

        try {
            // Datos para la API de login
            const loginData = {
                Correo: correo,
                Contrasena: contrasena,
                TipoUsuario: tipoUsuario
            };

            // URLs con CORS proxy
            let loginUrl;
            switch(tipoUsuario) {
                case 'alumno':
                    loginUrl = 'https://corsproxy.io/?url=http://cybercenter.somee.com/api/login/alumno';
                    break;
                case 'admin':
                    loginUrl = 'https://corsproxy.io/?url=http://cybercenter.somee.com/api/login/admin';
                    break;
             
                default:
                    throw new Error('Tipo de usuario no válido');
            }

            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const responseText = await response.text();
            console.log('Login RAW response:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Error parseando JSON login:', parseError);
                throw new Error('Respuesta no válida del servidor');
            }

            loginForm.classList.remove('loading');

            // Verificación ESTRICTA del login
            const isSuccess = result.success === true || result.Success === true || 
                            result.status === "success" || result.authenticated === true;
            
            if (isSuccess) {
                showMessage(loginMessage, `¡Bienvenido ${tipoUsuario}!`, 'success');
                loginForm.reset();

                // Guardar datos de sesión
                if (result.token) {
                    localStorage.setItem('token', result.token);
                }
                localStorage.setItem('userType', tipoUsuario);
                localStorage.setItem('userEmail', correo);

                // Redirección
                switch (tipoUsuario) {
                    case "alumno":
                        window.location.href = "../../Proyect/Main/Alumno.html";
                        break;
                    case "admin":
                        window.location.href = "../../Main/Index.html";
                        break;
                  
                    default:
                        showMessage(loginMessage, 'Tipo de usuario no válido', 'error');
                }
            } else {
                // Mostrar mensaje de error específico
                let errorMessage = 'Credenciales incorrectas';
                if (result.message) errorMessage = result.message;
                else if (result.Message) errorMessage = result.Message;
                else if (result.error) errorMessage = result.error;
                
                showMessage(loginMessage, 'Error: ' + errorMessage, 'error');
            }
        } catch (error) {
            loginForm.classList.remove('loading');
            
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                // NO permitir acceso sin API - mostrar error
                showMessage(loginMessage, 
                    'No se puede conectar con el servidor. Por favor, verifica tu conexión o contacta al administrador.', 
                    'error');
                console.error('Error de conexión a la API:', error);
            } else {
                showMessage(loginMessage, 'Error: ' + error.message, 'error');
                console.error('Error en login:', error);
            }
        }
    });

    // =============================
    //     REGISTRO DE ALUMNO CON VALIDACIÓN
    // =============================
    const registroAlumnoForm = document.getElementById('registroAlumnoForm');
    const alumnoMessage = document.getElementById('alumno-message');

    registroAlumnoForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(registroAlumnoForm);
        const data = Object.fromEntries(formData);

        // Validación completa
        if (!data.Nombre_Alumno || !data.Apellido_Alumno || !data.Edad_Alumno || 
            !data.Telefono_Alumno || !data.Correo_Alumno || !data.Contrasena) {
            showMessage(alumnoMessage, 'Por favor, completa todos los campos', 'error');
            return;
        }

        // Validar correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.Correo_Alumno)) {
            showMessage(alumnoMessage, 'Por favor ingresa un correo electrónico válido', 'error');
            return;
        }

        if (data.Contrasena.length < 6) {
            showMessage(alumnoMessage, 'La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        // Validar teléfono (mínimo 10 dígitos)
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(data.Telefono_Alumno.replace(/\D/g, ''))) {
            showMessage(alumnoMessage, 'Ingresa un número de teléfono válido (mínimo 10 dígitos)', 'error');
            return;
        }

        // Convertir y validar edad
        const edad = parseInt(data.Edad_Alumno);
        if (isNaN(edad) || edad < 16 || edad > 100) {
            showMessage(alumnoMessage, 'La edad debe estar entre 16 y 100 años', 'error');
            return;
        }

        // Preparar datos
        const alumnoData = {
            Nombre_Alumno: data.Nombre_Alumno.trim(),
            Apellido_Alumno: data.Apellido_Alumno.trim(),
            Edad_Alumno: edad,
            Telefono_Alumno: data.Telefono_Alumno,
            Correo_Alumno: data.Correo_Alumno.trim(),
            Contrasena: data.Contrasena
        };

        registroAlumnoForm.classList.add('loading');
        showMessage(alumnoMessage, 'Registrando alumno...', 'success');

        try {
            const apiUrl = 'https://corsproxy.io/?url=http://cybercenter.somee.com/api/register/alumno';
            
            console.log('Enviando datos registro:', alumnoData);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(alumnoData)
            });

            const responseText = await response.text();
            console.log('Registro RAW response:', responseText);
            
            registroAlumnoForm.classList.remove('loading');

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                result = {};
            }

            // Verificar si el registro fue exitoso
            if (response.ok || result.success === true || result.Success === true) {
                showMessage(alumnoMessage, '¡Registro completado exitosamente!', 'success');
                registroAlumnoForm.reset();

                // Redirigir al login
                setTimeout(() => {
                    showView('login');
                }, 2000);
            } else {
                // Manejar errores específicos
                let errorMsg = 'Error en el registro';
                if (result.message) errorMsg = result.message;
                else if (result.Message) errorMsg = result.Message;
                else if (responseText.includes('duplicate')) errorMsg = 'El correo ya está registrado';
                
                showMessage(alumnoMessage, errorMsg, 'error');
            }
            
        } catch (error) {
            registroAlumnoForm.classList.remove('loading');
            
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                showMessage(alumnoMessage, 
                    'No se puede conectar con el servidor. Por favor, intenta más tarde.', 
                    'error');
            } else {
                showMessage(alumnoMessage, 'Error: ' + error.message, 'error');
            }
            console.error('Error en registro:', error);
        }
    });

    // =============================
    //         FUNCIÓN DE MENSAJES
    // =============================
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = 'message ' + type;
        element.style.display = 'block';

        // No ocultar automáticamente los mensajes de error importantes
        if (type === 'error') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 7000);
        } else {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }
});