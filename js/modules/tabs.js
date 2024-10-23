// Переключение между окнами
export function initTabSwitching() {
    const links = document.querySelectorAll('.sidebar__link'); 
    const servicesSection = document.getElementById('servicesSection');
    const mastersSection = document.getElementById('mastersSection');
    const recordsSection = document.getElementById('recordsSection');
    const mainСontentSection = document.getElementById('main-content');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 

            // Скрываем все разделы
            servicesSection.style.display = 'none';
            mastersSection.style.display = 'none';
            recordsSection.style.display = 'none';
            mainСontentSection.style.display = 'none';


            // Проверяем, какой раздел нужно показать
            if (this.textContent.includes('Управление услугами')) {
                servicesSection.style.display = 'block';
            } else if (this.textContent.includes('Мастера')) {
                mastersSection.style.display = 'block';
            } else if (this.textContent.includes('Записи')) { 
                recordsSection.style.display = 'block';
            } else if (this.textContent.includes('Главная')) {
                mainСontentSection.style.display = 'flex';
            }
        });
    });
}
