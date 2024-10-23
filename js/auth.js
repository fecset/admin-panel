async function loadData() {
    const response = await fetch('db/barbershop_db.json');
    if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
    }
    return await response.json();
}


document.getElementById('authForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    let isValid = true;

    const authError = document.getElementById('authError');
    authError.style.display = 'none';

    if (isValid) {
        try {
            const users = await loadData();
            let userFound = false;

            for (const user of users) {
                if (user.type === "table" && user.name === "Администратор") {
                    for (const admin of user.data) {
                        if (admin.логин === username && admin.пароль === password) {
                            userFound = true;
                            break;
                        }
                    }
                }
            }
            if (userFound) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            }

            if (!userFound) {
                authError.textContent = 'Неверный логин или пароль';
                authError.style.display = 'block';
            }
            
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            authError.textContent = 'Ошибка при авторизации';
            authError.style.display = 'block';
        }
    }
});
