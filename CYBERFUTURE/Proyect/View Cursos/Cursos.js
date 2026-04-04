 // Filtrado de cursos
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Remover clase activa de todos los botones
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Agregar clase activa al botón clickeado
                this.classList.add('active');
                
                // Obtener filtro
                const filter = this.getAttribute('data-filter');
                const cards = document.querySelectorAll('.curso-card');
                
                // Filtrar cursos
                cards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Búsqueda de cursos
        const searchInput = document.querySelector('.search-input');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.curso-card');
            
            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });

        // Efectos hover mejorados
        document.querySelectorAll('.curso-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const image = this.querySelector('.card-image');
                image.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', function() {
                const image = this.querySelector('.card-image');
                image.style.transform = 'scale(1)';
            });
            
            // Botón más información
            const btn = this.querySelector('.card-btn');
            btn.addEventListener('click', function() {
                const cardTitle = this.closest('.curso-card').querySelector('.card-title').textContent;
                alert(`Más información sobre: ${cardTitle}\n\nPróximamente tendrás acceso a todos los detalles de este curso.`);
            });
        });

        // Animación al cargar
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.curso-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        });