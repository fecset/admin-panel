export function initMasters() {
    const mastersTableBody = document.getElementById('mastersTableBody');
    const addMasterButton = document.getElementById('addMasterButton');
    const addMasterModal = document.getElementById('addMasterModal');
    const closeAddMasterModal = document.getElementById('closeAddMasterModal');
    const masterSettingsModal = document.getElementById('masterSettingsModal');
    const closeMasterModal = document.getElementById('closeMasterModal');

    let currentMasterRow; 

    async function loadMasters() {
        const response = await fetch('db/barbershop_db.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        return data.find(table => table.name === "Мастера").data;
    }

    async function populateMasters() {
        const masters = await loadMasters();
        masters.forEach(master => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="master-id">${master.мастер_id}</td>
                <td class="master-name">${master.имя}</td>
                <td class="master-specialization">${master.специализация}</td>
                <td class="master-schedule">${master.график_работы}</td>
                <td class="master-actions">
                    <button class="master-button master-button--settings">Настройки</button>
                    <button class="master-button master-button--delete">
                        <img src="img/delete-icon.svg" alt="Delete">
                    </button>
                </td>
            `;
            mastersTableBody.appendChild(row);
        });

        attachEventHandlers(); 
    }

    function attachEventHandlers() {

        document.querySelectorAll('.master-button--delete').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr'); 
                row.remove(); 
            });
        });

        document.querySelectorAll('.master-button--settings').forEach(button => {
            button.addEventListener('click', function() {
                currentMasterRow = this.closest('tr'); 
                const masterId = currentMasterRow.querySelector('.master-id').textContent;
                const masterName = currentMasterRow.querySelector('.master-name').textContent;
                const masterSpecialization = currentMasterRow.querySelector('.master-specialization').textContent;
                const masterSchedule = currentMasterRow.querySelector('.master-schedule').textContent;

                document.getElementById('masterId').textContent = masterId;
                document.getElementById('masterName').textContent = masterName;
                document.getElementById('masterSpecialization').textContent = masterSpecialization;
                document.getElementById('masterSchedule').textContent = masterSchedule;

                masterSettingsModal.style.display = 'flex'; 
            });
        });

        
        document.querySelectorAll('.edit-icon').forEach(icon => {
            icon.addEventListener('click', function() {

                const fieldToEdit = this.closest('td').previousElementSibling.querySelector('span'); 
        
                if (fieldToEdit) {
                    fieldToEdit.contentEditable = 'true'; 
                    fieldToEdit.focus();

                    fieldToEdit.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            this.contentEditable = 'false'; 
                        }
                    });
                }
            });
        });
        
    }

    closeMasterModal.addEventListener('click', function() {
        masterSettingsModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === masterSettingsModal) {
            masterSettingsModal.style.display = 'none';
        }
    });

    document.getElementById('saveMasterSettings').addEventListener('click', function() {
        const masterName = document.getElementById('masterName').textContent.trim();
        const masterSpecialization = document.getElementById('masterSpecialization').textContent.trim();
        const masterSchedule = document.getElementById('masterSchedule').textContent.trim();


        if (masterName && masterSpecialization && masterSchedule) {
            currentMasterRow.querySelector('.master-name').textContent = masterName;
            currentMasterRow.querySelector('.master-specialization').textContent = masterSpecialization;
            currentMasterRow.querySelector('.master-schedule').textContent = masterSchedule;
            masterSettingsModal.style.display = 'none';
        }
    });

    
    addMasterButton.addEventListener('click', function() {
        document.getElementById('newMasterName').value = ''; 
        document.getElementById('newMasterSpecialization').value = '';
        document.getElementById('newMasterSchedule').value = '';
        addMasterModal.style.display = 'flex'; 
    });

    closeAddMasterModal.addEventListener('click', function() {
        addMasterModal.style.display = 'none';
    });

    // Обработчик кнопки "Сохранить мастера"
    document.getElementById('saveNewMaster').addEventListener('click', function() {
        const newMasterName = document.getElementById('newMasterName').value.trim();
        const newMasterSpecialization = document.getElementById('newMasterSpecialization').value.trim();
        const newMasterSchedule = document.getElementById('newMasterSchedule').value.trim();

        const nameError = document.getElementById('masterNameError');
        const specializationError = document.getElementById('specializationError');
        const scheduleError = document.getElementById('scheduleError');

        // Очищаем предыдущие ошибки
        nameError.textContent = '';
        specializationError.textContent = '';
        scheduleError.textContent = '';

        // Валидация имени мастера (не должно быть пустым и не должно содержать цифры)
        if (!newMasterName) {
            nameError.textContent = 'Введите имя мастера.';
            return;
        } else if (!/^[a-zA-Zа-яА-Я\s]+$/.test(newMasterName)) {
            nameError.textContent = 'Имя мастера может содержать только буквы.';
            return;
        }

        // Валидация специализации (не должна быть пустой и не должна содержать цифры)
        if (!newMasterSpecialization) {
            specializationError.textContent = 'Введите специализацию мастера.';
            return;
        } else if (!/^[a-zA-Zа-яА-Я\s]+$/.test(newMasterSpecialization)) {
            specializationError.textContent = 'Специализация может содержать только буквы.';
            return;
        }

        // Валидация графика работы мастера (просто проверяем, что поле не пустое)
        if (!newMasterSchedule) {
            scheduleError.textContent = 'Введите график работы мастера.';
            return;
        }

        const newMasterId = mastersTableBody.children.length + 1;
        const row = document.createElement('tr');
        row.innerHTML = `   
            <td class="master-id">${newMasterId}</td>
            <td class="master-name">${newMasterName}</td>
            <td class="master-specialization">${newMasterSpecialization}</td>
            <td class="master-schedule">${newMasterSchedule}</td>
            <td class="master-actions">
                <button class="master-button master-button--settings">Настройки</button>
                <button class="master-button master-button--delete">
                    <img src="img/delete-icon.svg" alt="Delete">
                </button>
            </td>
        `;
        mastersTableBody.appendChild(row);

        addMasterModal.style.display = 'none';

        document.getElementById('newMasterName').value = '';
        document.getElementById('newMasterSpecialization').value = '';
        document.getElementById('newMasterSchedule').value = '';

        attachEventHandlers();
    });

    // Валидация ввода только букв для поля "Имя мастера"
    document.getElementById('newMasterName').addEventListener('input', function() {
        const nameError = document.getElementById('nameError');
        const value = this.value;
        if (!/^[a-zA-Zа-яА-Я\s]*$/.test(value)) {
            nameError.textContent = 'Имя мастера должно содержать только буквы и пробелы.';
            this.value = value.replace(/[^a-zA-Zа-яА-Я\s]/g, ''); // Убираем все недопустимые символы
        } else {
            nameError.textContent = '';
        }
    });

    // Валидация ввода только букв для поля "Специализация мастера"
    document.getElementById('newMasterSpecialization').addEventListener('input', function() {
        const specializationError = document.getElementById('specializationError');
        const value = this.value;
        if (!/^[a-zA-Zа-яА-Я\s]*$/.test(value)) {
            specializationError.textContent = 'Специализация должна содержать только буквы и пробелы.';
            this.value = value.replace(/[^a-zA-Zа-яА-Я\s]/g, ''); // Убираем все недопустимые символы
        } else {
            specializationError.textContent = '';
        }
    });

    

    // Валидация
    const masterNameField = document.getElementById('masterName');
    const masterSpecializationField = document.getElementById('masterSpecialization');
    const masterScheduleField = document.getElementById('masterSchedule');

    masterNameField.addEventListener('keydown', handleAlphabeticKey);
    masterSpecializationField.addEventListener('keydown', handleAlphabeticKey);
    masterScheduleField.addEventListener('keydown', handleMasterScheduleKey);

    function handleMasterScheduleKey(event) {
        const maxLength = getMaxLength(this.id);
        if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            return;
        }

        if (!isAlphabeticKey(event) && !isNumberKey(event) || this.textContent.length >= maxLength) {
            event.preventDefault();
        }
    }

    function handleAlphabeticKey(event) {
        const maxLength = getMaxLength(this.id);
        if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Tab' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            return;
        }

        if (!isAlphabeticKey(event) || this.textContent.length >= maxLength) {
            event.preventDefault();
        }
    }

    function getMaxLength(id) {
        switch (id) {
            case 'masterName': return 30; 
            case 'masterSpecialization': return 30; 
            case 'masterSchedule': return 25; 
            default: return Infinity; 
        }
    }

    function isNumberKey(event) {
        const charCode = event.which || event.keyCode;
        return (
            (charCode >= 48 && charCode <= 57) || 
            (charCode >= 96 && charCode <= 105) ||
            charCode === 8 || 
            charCode === 46 || 
            charCode === 9 || 
            (charCode >= 37 && charCode <= 40)
        );
    }

    function isAlphabeticKey(event) {
        const charCode = event.which || event.keyCode;
        return (
            (charCode >= 65 && charCode <= 90) || 
            (charCode >= 97 && charCode <= 122) || 
            charCode === 32 || 
            charCode === 8 || 
            charCode === 46 || 
            charCode === 9 || 
            (charCode >= 37 && charCode <= 40) 
        );
    }

    populateMasters();
}
