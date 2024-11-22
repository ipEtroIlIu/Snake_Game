// Переменные для отслеживания счета
let scoreBlock;
let score = 0;

// Конфигурационные параметры игры
const config = {
	step: 0, // Шаг анимации
	maxStep: 6, // Максимальное количество шагов на кадр (для замедления игры)
	sizeCell: 16, // Размер ячейки змеи и других объектов
	sizeBerry: 16 / 4, // Размер ягоды (четверть размера ячейки)
};

// Объект змеи с начальными координатами, направлением и хвостом
const snake = {
	x: 160, // Начальная позиция по оси X
	y: 160, // Начальная позиция по оси Y
	dx: config.sizeCell, // Направление движения змеи по оси X
	dy: 0, // Направление движения змеи по оси Y
	tails: [], // Массив хвоста змеи
	maxTails: 3, // Максимальная длина хвоста
};

// Начальная позиция ягоды
let berry = {
	x: 0,
	y: 0,
};

// Получаем элементы для отображения счета и канваса
let canvas = document.querySelector('#game-canvas');
let context = canvas.getContext('2d');
scoreBlock = document.querySelector('.game-score .score-count');
drawScore(); // Отображаем начальный счет

// Основной игровой цикл
function gameLoop() {
	requestAnimationFrame(gameLoop); // Вызываем функцию для следующего кадра
	if (++config.step < config.maxStep) {
		return; // Пропускаем кадр, если шаг не достиг максимума
	}
	config.step = 0; // Сбрасываем шаг

	context.clearRect(0, 0, canvas.width, canvas.height); // Очищаем экран

	drawBerry(); // Отображаем ягоду
	drawSnake(); // Отображаем змею
}
requestAnimationFrame(gameLoop); // Запускаем игровой цикл

// Функция для рисования змеи
function drawSnake() {
	snake.x += snake.dx; // Обновляем координаты змеи по X
	snake.y += snake.dy; // Обновляем координаты змеи по Y

	collisionBorder(); // Проверяем столкновение с границей экрана

	// Добавляем новую позицию головы змеи в массив хвоста
	snake.tails.unshift({ x: snake.x, y: snake.y });

	// Если хвост слишком длинный, удаляем последний элемент
	if (snake.tails.length > snake.maxTails) {
		snake.tails.pop();
	}

	// Рисуем каждый сегмент хвоста
	snake.tails.forEach(function (el, index) {
		// Если это голова змеи, цвет будет другой
		if (index == 0) {
			context.fillStyle = '#25aff3';
		} else {
			context.fillStyle = '#166d99';
		}
		context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell); // Рисуем квадрат

		// Если змея съела ягоду, увеличиваем хвост и счет
		if (el.x === berry.x && el.y === berry.y) {
			snake.maxTails++; // Увеличиваем длину хвоста
			incScore(); // Увеличиваем счет
			randomPositionBerry(); // Генерируем новую позицию для ягоды
		}

		// Проверяем, не столкнулась ли змея с собой
		for (let i = index + 1; i < snake.tails.length; i++) {
			if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) {
				refreshGame(); // Если столкнулась — перезапускаем игру
			}
		}
	});
}

// Функция для проверки столкновения с границей экрана
function collisionBorder() {
	// Если змея выходит за пределы экрана по X
	if (snake.x < 0) {
		snake.x = canvas.width - config.sizeCell; // Переходит на правую сторону
	} else if (snake.x >= canvas.width) {
		snake.x = 0; // Переходит на левую сторону
	}

	// Если змея выходит за пределы экрана по Y
	if (snake.y < 0) {
		snake.y = canvas.height - config.sizeCell; // Переходит вниз
	} else if (snake.y >= canvas.height) {
		snake.y = 0; // Переходит вверх
	}
}

// Функция для перезапуска игры
function refreshGame() {
	score = 0; // Сбросить счет
	drawScore(); // Обновить отображение счета

	// Сбросить начальные параметры змеи
	snake.x = 160;
	snake.y = 160;
	snake.tails = [];
	snake.maxTails = 3;
	snake.dx = config.sizeCell;
	snake.dy = 0;

	randomPositionBerry(); // Генерируем новую позицию для ягоды
}

// Функция для рисования ягоды
function drawBerry() {
	context.fillStyle = '#25aff3'; // Устанавливаем цвет для ягоды
	context.fillRect(
		berry.x + config.sizeCell / 2 - config.sizeBerry, // Смещение для центрирования
		berry.y + config.sizeCell / 2 - config.sizeBerry, // Смещение для центрирования
		config.sizeBerry * 2, // Размер ягоды (диаметр)
		config.sizeBerry * 2, // Размер ягоды (диаметр)
	);
}

// Функция для генерации случайной позиции ягоды
function randomPositionBerry() {
	berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell; // Случайное положение по X
	berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell; // Случайное положение по Y
}

// Функция для увеличения счета
function incScore() {
	score++; // Увеличиваем счет на 1
	drawScore(); // Обновляем отображение счета
}

// Функция для отображения счета
function drawScore() {
	scoreBlock.innerHTML = score; // Отображаем счет на экране
}

// Функция для получения случайного целого числа в диапазоне
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min); // Генерируем случайное число
}

// Обработчик нажатий клавиш для управления змеей
document.addEventListener('keydown', function (e) {
	// Обработка клавиш для движения вверх (W или стрелка вверх)
	if ((e.code === 'KeyW' || e.code === 'ArrowUp') && snake.dy === 0) {
		snake.dy = -config.sizeCell; // Изменяем направление движения по Y
		snake.dx = 0; // Оставляем направление по X неизменным
	}
	// Обработка клавиш для движения влево (A или стрелка влево)
	else if ((e.code === 'KeyA' || e.code === 'ArrowLeft') && snake.dx === 0) {
		snake.dx = -config.sizeCell; // Изменяем направление движения по X
		snake.dy = 0; // Оставляем направление по Y неизменным
	}
	// Обработка клавиш для движения вниз (S или стрелка вниз)
	else if ((e.code === 'KeyS' || e.code === 'ArrowDown') && snake.dy === 0) {
		snake.dy = config.sizeCell; // Изменяем направление движения по Y
		snake.dx = 0; // Оставляем направление по X неизменным
	}
	// Обработка клавиш для движения вправо (D или стрелка вправо)
	else if ((e.code === 'KeyD' || e.code === 'ArrowRight') && snake.dx === 0) {
		snake.dx = config.sizeCell; // Изменяем направление движения по X
		snake.dy = 0; // Оставляем направление по Y неизменным
	}
});
