// Профессии будут загружаться из JSON файла
let professionsData = {};

// Загрузка результатов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadProfessions();
});

// Загрузка профессий из JSON файла
function loadProfessions() {
    // В реальном приложении здесь был бы fetch запрос к professions.json
    // Сейчас используем встроенные данные из предыдущего шага
    professionsData = {
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
        ]
    };
    
    showResults();
}

// Показать результаты
function showResults() {
    const resultsList = document.getElementById('professionsList');
    const savedResults = localStorage.getItem('testResults');
    
    if (!savedResults) {
        resultsList.innerHTML = '<p>Результаты не найдены. Пройдите тест сначала.</p>';
        return;
    }
    
    const answers = JSON.parse(savedResults);
    
    // Подсчет баллов по категориям
    const scores = {
        technical: 0,
        social: 0,
        analytical: 0,
        creative: 0,
        leadership: 0
    };
    
    // Вопросы соответствуют категориям по порядку
    const categories = ['technical', 'social', 'analytical', 'creative', 'leadership'];
    
    answers.forEach((answer, index) => {
        if (answer !== null && categories[index]) {
            scores[categories[index]] += answer + 1; // +1 потому что ответы от 0 до 4
        }
    });
    
    // Находим топ-3 категории
    const topCategories = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    // Показываем рекомендованные профессии
    let resultsHTML = '<div class="results-grid">';
    
    topCategories.forEach(([category, score]) => {
        const categoryProfessions = professionsData[category];
        if (categoryProfessions) {
            resultsHTML += `<div class="category-section">`;
            resultsHTML += `<h3 style="color: #2c3e50; margin-bottom: 1rem;">${getCategoryName(category)} (${score} баллов)</h3>`;
            
            categoryProfessions.forEach(profession => {
                resultsHTML += `
                    <div class="profession-card">
                        <h4>${profession.name}</h4>
                        <p>${profession.description}</p>
                    </div>
                `;
            });
            
            resultsHTML += `</div>`;
        }
    });
    
    resultsHTML += '</div>';
    resultsList.innerHTML = resultsHTML || '<p>Не удалось определить подходящие профессии.</p>';
}

// Получить русское название категории
function getCategoryName(category) {
    const names = {
        technical: 'Технические профессии',
        social: 'Социальные профессии',
        analytical: 'Аналитические профессии',
        creative: 'Творческие профессии',
        leadership: 'Управленческие профессии'
    };
    return names[category] || category;
}