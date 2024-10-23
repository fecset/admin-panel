export function initRecords() {
    const recordsTableBody = document.getElementById('recordsTableBody');

    async function loadData() {
        const response = await fetch('db/barbershop_db.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        return data;
    }

    async function populateRecords() {
        try {
            const data = await loadData();
            const records = data.find(table => table.name === "Записи").data;
            const clients = data.find(table => table.name === "Клиенты").data;
            const masters = data.find(table => table.name === "Мастера").data;
            const services = data.find(table => table.name === "Услуги").data;

            const clientMap = {};
            clients.forEach(client => {
                clientMap[client.клиент_id] = client;
            });

            const masterMap = {};
            masters.forEach(master => {
                masterMap[master.мастер_id] = master;
            });

            const serviceMap = {};
            services.forEach(service => {
                serviceMap[service.услуга_id] = service;
            });

            records.forEach(record => {
                const row = document.createElement('tr');
                const client = clientMap[record.клиент_id] || { имя: 'Неизвестный клиент', телефон: '', email: '' };
                const master = masterMap[record.мастер_id] || { имя: 'Неизвестный мастер' };
                const service = serviceMap[record.услуга_id] || { название: 'Неизвестная услуга', цена: '' };

                row.innerHTML = `
                    <td>${record.запись_id}</td>
                    <td>${client.имя}</td>
                    <td>${record.дата_время}</td>
                    <td class="status">${record.статус}</td>
                    <td>
                        <div class="record-buttons">
                            <button class="record-button record-button--info" 
                                data-id="${record.запись_id}" 
                                data-client-name="${client.имя}"
                                data-phone="${client.телефон}"
                                data-email="${client.email}"
                                data-master-name="${master.имя}"
                                data-service-name="${service.название}"
                                data-service-price="${service.цена}"
                                data-date="${record.дата_время}"
                                data-status="${record.статус}">
                                <img src="img/info.svg" alt="Info">
                            </button>
                            <button class="record-button record-button--confirm">
                                <img src="img/confirm.svg" alt="Confirm">
                            </button>
                            <button class="record-button record-button--reject">
                                <img src="img/reject.svg" alt="Reject">
                            </button>
                            <button class="record-button record-button--delete">
                                <img src="img/delete-icon.svg" alt="Delete">
                            </button>
                        </div>
                    </td>
                `;
                recordsTableBody.appendChild(row);
            });

            attachEventHandlers();
        } catch (error) {
            console.error(error);
        }
    }

    function attachEventHandlers() {
        document.querySelectorAll('.record-button--delete').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr'); 
                row.remove(); 
            });
        });

        document.querySelectorAll('.record-button--confirm').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const statusCell = row.querySelector('.status');

                statusCell.textContent = 'Подтверждена';
                statusCell.style.color = '#037E36'; 
                statusCell.style.fontWeight = 'bold'; 

                this.disabled = true;
                this.style.filter = 'grayscale(100%)'; 
                this.classList.add('inactive'); 

                const rejectButton = row.querySelector('.record-button--reject');
                rejectButton.disabled = false; 
                rejectButton.style.filter = 'none'; 
                rejectButton.classList.remove('inactive');
            });
        });

        document.querySelectorAll('.record-button--reject').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const statusCell = row.querySelector('.status');

                statusCell.textContent = 'Отклонена';
                statusCell.style.fontWeight = 'bold'; 
                statusCell.style.color = '#8E2E2E';

                this.disabled = true;
                this.style.filter = 'grayscale(100%)'; 
                this.classList.add('inactive'); 

                const confirmButton = row.querySelector('.record-button--confirm');
                confirmButton.disabled = false; 
                confirmButton.style.filter = 'none';
                confirmButton.classList.remove('inactive'); 
            });
        });
    
        document.querySelectorAll('.record-button--info').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const clientName = this.getAttribute('data-client-name');
                const phone = this.getAttribute('data-phone');
                const email = this.getAttribute('data-email');
                const masterName = this.getAttribute('data-master-name');
                const serviceName = this.getAttribute('data-service-name');
                const servicePrice = this.getAttribute('data-service-price');
                const date = this.getAttribute('data-date');
                const status = this.getAttribute('data-status');

                document.getElementById('detailId').textContent = id;
                document.getElementById('detailClientName').textContent = clientName;
                document.getElementById('detailPhone').textContent = phone;
                document.getElementById('detailEmail').textContent = email;
                document.getElementById('detailMaster').textContent = masterName;
                document.getElementById('detailService').textContent = serviceName;
                document.getElementById('detailPrice').textContent = servicePrice;
                document.getElementById('detailDate').textContent = date;
        
                const statusElement = document.getElementById('detailStatus');
                statusElement.textContent = status;
        
                if (status === 'Подтверждена') {
                    statusElement.style.color = '#037E36';
                    statusElement.style.fontWeight = 'bold';
                } else if (status === 'Ожидает подтверждения') {
                    statusElement.style.color = '#E09100';
                    statusElement.style.fontWeight = 'bold';
                } else if (status === 'Отклонена') {
                    statusElement.style.color = '#8E2E2E';
                    statusElement.style.fontWeight = 'bold';
                }
    
                document.getElementById('detailsModal').style.display = 'flex';
            });
        });

        document.getElementById('closeDetailsModal').addEventListener('click', function() {
            document.getElementById('detailsModal').style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            const modal = document.getElementById('detailsModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    populateRecords();
}
