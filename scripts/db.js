// Функции для работы с базой данных (в реальном приложении)
class Database {
    // Сохранение результатов теста
    static saveTestResults(results) {
        // В реальном приложении здесь был бы запрос к серверу
        console.log('Сохранение результатов:', results);
        return Promise.resolve(true);
    }
    
    // Получение результатов учеников (для куратора)
    static getStudentResults(classFilter = '') {
        // В реальном приложении здесь был бы запрос к серверу
        const mockResults = [
            { name: 'Иванов Иван', class: '9а', profession: 'Программист', score: 85 },
            { name: 'Петрова Мария', class: '9а', profession: 'Врач', score: 92 },
            { name: 'Сидоров Алексей', class: '9б', profession: 'Инженер', score: 78 }
        ];
        
        if (classFilter) {
            return mockResults.filter(result => result.class === classFilter);
        }
        
        return mockResults;
    }
}

// Функция для куратора - загрузка результатов
function loadResults() {
    const classFilter = document.getElementById('classFilter').value;
    const results = Database.getStudentResults(classFilter);
    
    const resultsContainer = document.getElementById('studentsResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>Нет результатов для выбранного класса</p>';
        return;
    }
    
    let html = '<table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">';
    html += '<tr><th style="border: 1px solid #ddd; padding: 8px;">ФИО</th><th style="border: 1px solid #ddd; padding: 8px;">Класс</th><th style="border: 1px solid #ddd; padding: 8px;">Профессия</th><th style="border: 1px solid #ddd; padding: 8px;">Балл</th></tr>';
    
    results.forEach(result => {
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