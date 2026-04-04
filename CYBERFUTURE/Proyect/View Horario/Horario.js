    // Función para mostrar el horario actual
        function highlightCurrentSchedule() {
            const now = new Date();
            const day = now.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
            const hour = now.getHours();
            const minutes = now.getMinutes();
            const currentTime = hour + minutes/60;
            
            const horarioItems = document.querySelectorAll('.horario-item');
            
            horarioItems.forEach(item => {
                item.classList.remove('current-schedule');
                
                // Extraer horas del texto
                const horaText = item.querySelector('.horario-horas').textContent;
                const [startStr, endStr] = horaText.split(' - ');
                
                // Convertir a formato 24h
                function parseTime(timeStr) {
                    const [time, modifier] = timeStr.split(' ');
                    let [hours, minutes] = time.split(':').map(Number);
                    
                    if (modifier === 'PM' && hours < 12) hours += 12;
                    if (modifier === 'AM' && hours === 12) hours = 0;
                    
                    return hours + (minutes || 0)/60;
                }
                
                try {
                    const startTime = parseTime(startStr);
                    const endTime = parseTime(endStr);
                    
                    // Verificar si estamos en este horario
                    if (currentTime >= startTime && currentTime <= endTime) {
                        // Solo marcar si es el día correcto
                        const isWeekday = item.closest('.dias-section').querySelector('.section-title').textContent.includes('Lunes');
                        const isSaturday = item.closest('.dias-section').querySelector('.section-title').textContent.includes('Sábado');
                        
                        if ((day >= 1 && day <= 5 && isWeekday) || (day === 6 && isSaturday)) {
                            item.classList.add('current-schedule');
                        }
                    }
                } catch (e) {
                    console.log('Error parsing time:', e);
                }
            });
        }
        
        // Resaltar al cargar
        document.addEventListener('DOMContentLoaded', highlightCurrentSchedule);
        
        // Actualizar cada minuto
        setInterval(highlightCurrentSchedule, 60000);
        
        // Efectos interactivos
        document.querySelectorAll('.horario-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });