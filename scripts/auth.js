// Простая система авторизации
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Простая проверка (в реальном приложении нужно подключаться к базе данных)
            if (email && password) {
                // Сохраняем информацию о пользователе
                localStorage.setItem('currentUser', JSON.stringify({
                    email: email,
                    name: 'Ученик',
                    role: 'student'
                }));
                
                // Переходим в личный кабинет
                window.location.href = 'student_dashboard.html';
            } else {
                alert('Пожалуйста, заполните все поля');
            }
        });
    }
    
    // Проверка авторизации на защищенных страницах
    const protectedPages = ['student_dashboard.html', 'curator_dashboard.html', 'test.html', 'results.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'login.html';
        } else {
            // Показываем имя пользователя
            const userData = JSON.parse(currentUser);
            const userNameElement = document.getElementById('studentName') || document.getElementById('curatorName');
            if (userNameElement) {
                userNameElement.textContent = userData.name;
            }
        }
    }
});

// Выход из системы
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('testResults');
    window.location.href = 'index.html';
}