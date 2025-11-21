// Данные теста
let testData = {
    questions: [],
    currentQuestion: 0,
    answers: []
};

// Загрузка вопросов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();
});

// Загрузка вопросов из JSON
function loadQuestions() {
    // Временно используем встроенные вопросы
    testData.questions = [
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
        }
    ];
    
    // Инициализируем массив ответов
    testData.answers = new Array(testData.questions.length).fill(null);
    
    // Показываем первый вопрос
    showQuestion(0);
    
    // Обновляем счетчик вопросов
    document.getElementById('totalQuestions').textContent = testData.questions.length;
};

// Показать вопрос
function showQuestion(questionIndex) {
    const question = testData.questions[questionIndex];
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Обновляем текст вопроса
    document.getElementById('questionText').textContent = question.question_text;
    document.getElementById('currentQuestion').textContent = questionIndex + 1;
    
    // Создаем варианты ответов
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.style.marginBottom = '10px';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = index;
        radio.id = `option${index}`;
        radio.checked = testData.answers[questionIndex] === index;
        
        const label = document.createElement('label');
        label.htmlFor = `option${index}`;
        label.textContent = option;
        label.style.marginLeft = '10px';
        label.style.cursor = 'pointer';
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
        
        // Обработчик выбора ответа
        radio.addEventListener('change', function() {
            testData.answers[questionIndex] = index;
            updateNavigationButtons();
        });
    });
    
    // Обновляем кнопки навигации
    updateNavigationButtons();
}

// Обновление кнопок навигации
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Кнопка "Назад"
    prevBtn.style.display = testData.currentQuestion > 0 ? 'block' : 'none';
    
    // Кнопка "Далее" / "Завершить"
    if (testData.currentQuestion === testData.questions.length - 1) {
        nextBtn.textContent = 'Завершить тест';
        nextBtn.onclick = completeTest;
    } else {
        nextBtn.textContent = 'Далее';
        nextBtn.onclick = nextQuestion;
    }
    
    // Блокируем кнопку "Далее" если ответ не выбран
    nextBtn.disabled = testData.answers[testData.currentQuestion] === null;
}

// Следующий вопрос
function nextQuestion() {
    if (testData.currentQuestion < testData.questions.length - 1) {
        testData.currentQuestion++;
        showQuestion(testData.currentQuestion);
    }
}

// Предыдущий вопрос
function prevQuestion() {
    if (testData.currentQuestion > 0) {
        testData.currentQuestion--;
        showQuestion(testData.currentQuestion);
    }
}

// Завершение теста
function completeTest() {
    // Сохраняем результаты в localStorage
    localStorage.setItem('testResults', JSON.stringify(testData.answers));
    
    // Показываем секцию завершения
    document.getElementById('testContent').style.display = 'none';
    document.getElementById('completionSection').style.display = 'block';
}

// Показать результаты
document.getElementById('showResultsBtn').addEventListener('click', function() {
    // Переходим на страницу результатов
    window.location.href = 'results.html';
});

// Назначаем обработчики кнопок
document.getElementById('prevBtn').onclick = prevQuestion;
document.getElementById('nextBtn').onclick = nextQuestion;