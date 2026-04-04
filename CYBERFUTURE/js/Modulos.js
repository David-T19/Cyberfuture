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
            window.location.href = "../Proyect/View Login/login.html?session=destroyed&t=" + Date.now();
            
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
        window.location.href = "../Proyect/View Login/login.html";
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

   const modulos = [
   
      {
        nombre: "Instructores", 
        descripcion: "Administra instructores registrados, horarios y asignación de cursos.", 
        enlace: "../view Instructor/index.html", 
        color: "success", 
        icon: "bi-person-badge", 
        category: "success",
        bgGradient: "linear-gradient(135deg, #00b894, #00cec9)"
      },
      {
        nombre: "Estudiantes", 
        descripcion: "Gestiona estudiantes, matriculación, progreso y datos académicos.", 
        enlace: "../view Alumno/index.html", 
        color: "warning", 
        icon: "bi-mortarboard", 
        category: "warning",
        bgGradient: "linear-gradient(135deg, #fdcb6e, #e17055)"
      },
      {
        nombre: "Facturación", 
        descripcion: "Control de facturas, pagos y estados financieros de clientes.", 
        enlace: "../view Factura/index.html", 
        color: "info", 
        icon: "bi-receipt", 
        category: "info",
        bgGradient: "linear-gradient(135deg, #0984e3, #74b9ff)"
      },
      {
        nombre: "Cursos", 
        descripcion: "Administra cursos disponibles, contenidos y programación.", 
        enlace: "../view Curso/index.html", 
        color: "info", 
        icon: "bi-journal-bookmark", 
        category: "info",
        bgGradient: "linear-gradient(135deg, #0984e3, #74b9ff)"
      },
     
      {
        nombre: "Prácticas Empresariales", 
        descripcion: "Coordina prácticas empresariales y seguimiento de estudiantes.", 
        enlace: "../view Practicas Empresariales/index.html", 
        color: "warning", 
        icon: "bi-briefcase", 
        category: "warning",
        bgGradient: "linear-gradient(135deg, #fdcb6e, #e17055)"
      },
      {
        nombre: "Estado Estudiantil", 
        descripcion: "Administra el estado académico y progreso de los estudiantes.", 
        enlace: "../view Contiene/index.html", 
        color: "primary", 
        icon: "bi-clipboard-data", 
        category: "primary",
        bgGradient: "linear-gradient(135deg, #6a11cb, #2575fc)"
      },
      {
        nombre: "Temáticas", 
        descripcion: "Gestiona temas, contenidos y materiales educativos.", 
        enlace: "../view Imparte/index.html", 
        color: "success", 
        icon: "bi-lightbulb", 
        category: "success",
        bgGradient: "linear-gradient(135deg, #00b894, #00cec9)"
      }  
    ];
    
    const contenedor = document.getElementById("menuContenedor");
    const searchInput = document.getElementById("searchInput");
    const categoryButtons = document.querySelectorAll('.category-btn');
    const noResults = document.getElementById("noResults");
    
    // Función para renderizar los módulos
    function renderModulos(modulosToRender) {
      contenedor.innerHTML = '';
      
      if (modulosToRender.length === 0) {
        noResults.classList.remove('d-none');
        return;
      }
      
      noResults.classList.add('d-none');
      
      modulosToRender.forEach(m => {
        const card = document.createElement("div");
        card.className = "module-card";
        card.innerHTML = `
          <div class="card-header">
            <div class="card-icon" style="background: ${m.bgGradient};">
              <i class="${m.icon}"></i>
            </div>
            <h3 class="card-title">${m.nombre}</h3>
          </div>
          <div class="card-body">
            <p class="card-description">${m.descripcion}</p>
            <div class="card-footer">
              <a href="${m.enlace}" class="module-btn" style="background: ${m.bgGradient};">Abrir módulo</a>
            </div>
          </div>
        `;
        contenedor.appendChild(card);
      });
    }
    
    // Filtrado por búsqueda y categoría
    function filterModulos() {
      const searchTerm = searchInput.value.toLowerCase();
      const activeCategory = document.querySelector('.category-btn.active').dataset.category;
      
      const filteredModulos = modulos.filter(m => {
        const matchesSearch = m.nombre.toLowerCase().includes(searchTerm) || 
                             m.descripcion.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
        
        return matchesSearch && matchesCategory;
      });
      
      renderModulos(filteredModulos);
    }
    
    // Inicializar la vista
    renderModulos(modulos);
    
    // Event listeners
    searchInput.addEventListener('input', filterModulos);
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        filterModulos();
      });
    });