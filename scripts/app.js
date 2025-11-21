// Глобальное состояние приложения
const appState = {
    currentUser: null,
    testData: {
        questions: [],
        currentQuestion: 0,
        answers: []
    }
};

// Демо данные пользователей
const users = {
    // Ученики (из сгенерированных данных)
    'eарутюнян9а@school.ru': { password: 'A1b2C3d4', name: 'Елизавета Арутюнян', role: 'student', class: '9а' },
    'kарысова9а@school.ru': { password: 'E5f6G7h8', name: 'Карина Арысова', role: 'student', class: '9а' },
    'sбелова9а@school.ru': { password: 'I9j0K1l2', name: 'Софья Белова', role: 'student', class: '9а' },
    'vбертолло9а@school.ru': { password: 'M3n4O5p6', name: 'Виталий Бертолло', role: 'student', class: '9а' },
    'dбоборев9а@school.ru': { password: 'Q7r8S9t0', name: 'Денис Боборев', role: 'student', class: '9а' },
    
    // Куратор
    'curator@school.ru': { password: 'curator123', name: 'Иванова Мария Петровна', role: 'curator' }
};

// Функции для модального окна входа
function showLoginForm(role) {
    const modal = document.getElementById('loginModal');
    const title = document.getElementById('modalTitle');
    
    if (role === 'student') {
        title.textContent = 'Вход для ученика';
    } else {
        title.textContent = 'Вход для куратора';
    }
    
    // Очищаем форму
    document.getElementById('modalEmail').value = '';
    document.getElementById('modalPassword').value = '';
    
    modal.style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
}

// Навигация между страницами
function showPage(pageName) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Показываем нужную страницу
    switch(pageName) {
        case 'home':
            document.getElementById('homePage').style.display = 'block';
            break;
        case 'studentDashboard':
            document.getElementById('studentDashboard').style.display = 'block';
            loadStudentDashboard();
            break;
        case 'curatorDashboard':
            document.getElementById('curatorDashboard').style.display = 'block';
            break;
        case 'test':
            document.getElementById('testPage').style.display = 'block';
            startTest();
            break;
        case 'results':
            document.getElementById('resultsPage').style.display = 'block';
            showTestResults();
            break;
    }
}

// Обработка входа в систему
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('modalEmail').value;
    const password = document.getElementById('modalPassword').value;
    
    // Проверка пользователя
    if (users[email] && users[email].password === password) {
        appState.currentUser = {
            email: email,
            name: users[email].name,
            role: users[email].role,
            class: users[email].class
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
        
        // Закрываем модальное окно
        closeLoginModal();
        
        // Переходим в соответствующий кабинет
        if (users[email].role === 'student') {
            showPage('studentDashboard');
        } else {
            showPage('curatorDashboard');
        }
    } else {
        alert('Неверный логин или пароль');
    }
}

// Выход из системы
function logout() {
    appState.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('testResults');
    showPage('home');
}

// Загрузка личного кабинета ученика
function loadStudentDashboard() {
    if (appState.currentUser) {
        document.getElementById('studentName').textContent = appState.currentUser.name;
        document.getElementById('studentWelcomeName').textContent = appState.currentUser.name;
        
        // Проверяем есть ли результаты теста
        const savedResults = localStorage.getItem('testResults');
        const resultsSection = document.getElementById('studentResults');
        
        if (savedResults) {
            resultsSection.style.display = 'block';
            displayStudentResults(JSON.parse(savedResults));
        } else {
            resultsSection.style.display = 'none';
        }
    }
}

// Показ результатов ученика
function displayStudentResults(results) {
    const resultsList = document.getElementById('resultsList');
    const scores = calculateScores(results);
    const topCategories = getTopCategories(scores, 2);
    
    let html = '<div class="results-preview">';
    html += '<h4>Ваши лучшие направления:</h4>';
    
    topCategories.forEach(([category, score]) => {
        html += `<p><strong>${getCategoryName(category)}</strong> - ${score} баллов</p>`;
    });
    
    html += '<p><a href="#" onclick="showPage(\'results\')">Посмотреть все рекомендации</a></p>';
    html += '</div>';
    
    resultsList.innerHTML = html;
}

// Начало тестирования
function startTest() {
    // Загружаем вопросы
    loadQuestions();
    showPage('test');
}

// Загрузка вопросов (20 вопросов)
function loadQuestions() {
    appState.testData.questions = [
        {
            id: 1,
            question_text: "Вам нравится работать с техникой и механизмами?",
            category: "technical",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 2,
            question_text: "Вы любите общаться с людьми и помогать им?",
            category: "social",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 3,
            question_text: "Вам интересно решать сложные математические задачи?",
            category: "analytical",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 4,
            question_text: "Вы любите рисовать, заниматься музыкой или творчеством?",
            category: "creative",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 5,
            question_text: "Вам нравится организовывать работу и руководить?",
            category: "leadership",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 6,
            question_text: "Вы любите изучать природу и живые организмы?",
            category: "science",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 7,
            question_text: "Вам нравится работа, связанная с документами и отчетами?",
            category: "administrative",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 8,
            question_text: "Вы любите спортивные занятия и физическую активность?",
            category: "physical",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 9,
            question_text: "Вам интересно программирование и IT-технологии?",
            category: "technical",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 10,
            question_text: "Вы любите учить и объяснять что-то другим?",
            category: "social",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 11,
            question_text: "Вам нравится анализировать данные и строить графики?",
            category: "analytical",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 12,
            question_text: "Вы любите писать тексты, стихи или рассказы?",
            category: "creative",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 13,
            question_text: "Вам нравится принимать важные решения?",
            category: "leadership",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 14,
            question_text: "Вы интересуетесь медицинскими профессиями?",
            category: "science",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 15,
            question_text: "Вам нравится работа, требующая аккуратности и внимания к деталям?",
            category: "administrative",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 16,
            question_text: "Вы любите работать руками и мастерить что-то?",
            category: "physical",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 17,
            question_text: "Вам интересно, как устроены различные механизмы?",
            category: "technical",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 18,
            question_text: "Вы любите работать в команде?",
            category: "social",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 19,
            question_text: "Вам нравится решать логические головоломки?",
            category: "analytical",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        },
        {
            id: 20,
            question_text: "Вы любите выступать перед публикой?",
            category: "creative",
            options: ["Совсем не нравится", "Скорее не нравится", "Нейтрально", "Скорее нравится", "Очень нравится"]
        }
    ];
    
    appState.testData.answers = new Array(appState.testData.questions.length).fill(null);
    appState.testData.currentQuestion = 0;
    
    showQuestion(0);
    document.getElementById('totalQuestions').textContent = appState.testData.questions.length;
}

// Показ вопроса
function showQuestion(questionIndex) {
    const question = appState.testData.questions[questionIndex];
    const optionsContainer = document.getElementById('optionsContainer');
    
    document.getElementById('questionText').textContent = question.question_text;
    document.getElementById('currentQuestion').textContent = questionIndex + 1;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.style.marginBottom = '10px';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = index;
        radio.id = `option${index}`;
        radio.checked = appState.testData.answers[questionIndex] === index;
        
        const label = document.createElement('label');
        label.htmlFor = `option${index}`;
        label.textContent = option;
        label.style.marginLeft = '10px';
        label.style.cursor = 'pointer';
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
        
        radio.addEventListener('change', function() {
            appState.testData.answers[questionIndex] = index;
            updateNavigationButtons();
        });
    });
    
    updateNavigationButtons();
}

// Обновление кнопок навигации
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.style.display = appState.testData.currentQuestion > 0 ? 'block' : 'none';
    
    if (appState.testData.currentQuestion === appState.testData.questions.length - 1) {
        nextBtn.textContent = 'Завершить тест';
        nextBtn.onclick = completeTest;
    } else {
        nextBtn.textContent = 'Далее';
        nextBtn.onclick = nextQuestion;
    }
    
    nextBtn.disabled = appState.testData.answers[appState.testData.currentQuestion] === null;
}

// Следующий вопрос
function nextQuestion() {
    if (appState.testData.currentQuestion < appState.testData.questions.length - 1) {
        appState.testData.currentQuestion++;
        showQuestion(appState.testData.currentQuestion);
    }
}

// Предыдущий вопрос
function prevQuestion() {
    if (appState.testData.currentQuestion > 0) {
        appState.testData.currentQuestion--;
        showQuestion(appState.testData.currentQuestion);
    }
}

// Завершение теста
function completeTest() {
    // Сохраняем результаты
    localStorage.setItem('testResults', JSON.stringify(appState.testData.answers));
    
    // Показываем секцию завершения
    document.getElementById('testContent').style.display = 'none';
    document.getElementById('completionSection').style.display = 'block';
}

// Показ результатов теста
function showResults() {
    showPage('results');
}

// Отображение результатов
function showTestResults() {
    const resultsList = document.getElementById('professionsList');
    const savedResults = localStorage.getItem('testResults');
    
    if (!savedResults) {
        resultsList.innerHTML = '<p>Результаты не найдены</p>';
        return;
    }
    
    const answers = JSON.parse(savedResults);
    const scores = calculateScores(answers);
    const topCategories = getTopCategories(scores, 3);
    
    let html = '<div class="results-grid">';
    
    topCategories.forEach(([category, score]) => {
        const professions = getProfessionsByCategory(category);
        html += `<div class="category-section">`;
        html += `<h3 style="color: #2c3e50; margin-bottom: 1rem;">${getCategoryName(category)} (${score} баллов)</h3>`;
        
        professions.forEach(profession => {
            html += `
                <div style="border: 1px solid #ddd; padding: 1rem; margin: 1rem 0; border-radius: 5px;">
                    <h4>${profession.name}</h4>
                    <p>${profession.description}</p>
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    html += '</div>';
    resultsList.innerHTML = html;
}

// Вспомогательные функции
function calculateScores(answers) {
    const scores = {
        technical: 0,
        social: 0,
        analytical: 0,
        creative: 0,
        leadership: 0,
        science: 0,
        administrative: 0,
        physical: 0
    };
    
    const categories = [
        'technical', 'social', 'analytical', 'creative', 'leadership',
        'science', 'administrative', 'physical', 'technical', 'social',
        'analytical', 'creative', 'leadership', 'science', 'administrative',
        'physical', 'technical', 'social', 'analytical', 'creative'
    ];
    
    answers.forEach((answer, index) => {
        if (answer !== null && categories[index]) {
            scores[categories[index]] += answer + 1;
        }
    });
    
    return scores;
}

function getTopCategories(scores, count) {
    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count);
}

function getCategoryName(category) {
    const names = {
        technical: 'Технические профессии',
        social: 'Социальные профессии',
        analytical: 'Аналитические профессии',
        creative: 'Творческие профессии',
        leadership: 'Управленческие профессии',
        science: 'Научные профессии',
        administrative: 'Административные профессии',
        physical: 'Физические профессии'
    };
    return names[category] || category;
}

function getProfessionsByCategory(category) {
    const professions = {
        technical: [
            { name: "Инженер-программист", description: "Разработка программного обеспечения и алгоритмов" },
            { name: "Системный администратор", description: "Обслуживание компьютерных сетей и серверов" },
            { name: "Инженер-конструктор", description: "Проектирование технических устройств и систем" }
        ],
        social: [
            { name: "Учитель", description: "Обучение и воспитание учащихся" },
            { name: "Психолог", description: "Помощь в решении психологических проблем" },
            { name: "Социальный работник", description: "Помощь людям в трудной жизненной ситуации" }
        ],
        analytical: [
            { name: "Аналитик данных", description: "Анализ данных и прогнозирование" },
            { name: "Ученый-исследователь", description: "Проведение научных исследований" },
            { name: "Финансовый аналитик", description: "Анализ финансовых рынков и инвестиций" }
        ],
        creative: [
            { name: "Дизайнер", description: "Создание визуальных решений" },
            { name: "Артист", description: "Творческая деятельность в искусстве" },
            { name: "Копирайтер", description: "Создание текстового контента" }
        ],
        leadership: [
            { name: "Менеджер проекта", description: "Управление командой и проектами" },
            { name: "Предприниматель", description: "Создание и развитие бизнеса" },
            { name: "Руководитель отдела", description: "Управление организацией" }
        ],
        science: [
            { name: "Врач", description: "Диагностика и лечение заболеваний" },
            { name: "Биолог", description: "Исследование живых организмов" },
            { name: "Химик", description: "Изучение веществ и их превращений" }
        ],
        administrative: [
            { name: "Бухгалтер", description: "Ведение финансовой отчетности" },
            { name: "Секретарь", description: "Организация документооборота" },
            { name: "Архивариус", description: "Работа с архивными документами" }
        ],
        physical: [
            { name: "Спортсмен", description: "Профессиональные спортивные достижения" },
            { name: "Тренер", description: "Обучение и подготовка спортсменов" },
            { name: "Инструктор по фитнесу", description: "Проведение тренировок" }
        ]
    };
    
    return professions[category] || [];
}

// Загрузка результатов для куратора
function loadStudentResults() {
    const classFilter = document.getElementById('classFilter').value;
    const resultsContainer = document.getElementById('studentsResults');
    
    // Демо данные результатов
    const mockResults = [
        { name: 'Арутюнян Елизавета Арутюновна', class: '9а', profession: 'Программист', score: 85 },
        { name: 'Арысова Карина Талгатовна', class: '9а', profession: 'Врач', score: 92 },
        { name: 'Белова Софья Васильевна', class: '9а', profession: 'Дизайнер', score: 78 },
        { name: 'Бертолло Виталий Олегович', class: '9а', profession: 'Инженер', score: 88 },
        { name: 'Боборев Денис Русланович', class: '9а', profession: 'Аналитик', score: 91 },
        { name: 'Архипова Полина Михайловна', class: '9б', profession: 'Психолог', score: 95 },
        { name: 'Белоусова Анна Владимировна', class: '9б', profession: 'Учитель', score: 90 },
        { name: 'Бабаянц Артемий Игоревич', class: '11а', profession: 'Программист', score: 96 },
        { name: 'Бабич Дмитрий Александрович', class: '11а', profession: 'Инженер', score: 89 }
    ];
    
    let filteredResults = mockResults;
    if (classFilter) {
        filteredResults = mockResults.filter(result => result.class === classFilter);
    }
    
    if (filteredResults.length === 0) {
        resultsContainer.innerHTML = '<p>Нет результатов для выбранного класса</p>';
        return;
    }
    
    let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">';
    html += '<tr><th style="border: 1px solid #ddd; padding: 8px;">ФИО</th><th style="border: 1px solid #ddd; padding: 8px;">Класс</th><th style="border: 1px solid #ddd; padding: 8px;">Рекомендуемая профессия</th><th style="border: 1px solid #ddd; padding: 8px;">Балл</th></tr>';
    
    filteredResults.forEach(result => {
        html += `<tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${result.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${result.class}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${result.profession}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${result.score}</td>
        </tr>`;
    });
    
    html += '</table>';
    resultsContainer.innerHTML = html;
}

// Назначаем глобальные обработчики
document.getElementById('prevBtn').onclick = prevQuestion;
document.getElementById('nextBtn').onclick = nextQuestion;

// Проверка авторизации при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
        if (appState.currentUser.role === 'student') {
            showPage('studentDashboard');
        } else {
            showPage('curatorDashboard');
        }
    } else {
        showPage('home');
    }
});