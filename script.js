document.addEventListener('DOMContentLoaded', function () {
	const startButton = document.querySelector('#start-button');
	const gameContainer = document.querySelector('#game');
	const canvas = document.querySelector('#game-canvas');
	const context = canvas.getContext('2d');
	let gameStarted = false;
	let gamePaused = false;

	let scoreBlock;
	let score = 0;
	let animationFrame;

	const config = {
		step: 0,
		maxStep: 6,
		sizeCell: 16,
		sizeBerry: 16 / 4,
	};

	const snake = {};
	let berry = { x: 0, y: 0 };

	// Получение имени пользователя через prompt
	const userName = `${prompt('What is your Name?') || 'Anonymous'}`;
	const animalSelect = document.querySelector('select');
	let skin = animalSelect.value;

	function drawScore() {
		scoreBlock.innerHTML = score;
	}

	function drawSnake() {
		snake.x += snake.dx;
		snake.y += snake.dy;

		collisionBorder();

		snake.tails.unshift({ x: snake.x, y: snake.y });

		if (snake.tails.length > snake.maxTails) {
			snake.tails.pop();
		}

		snake.tails.forEach(function (el, index) {
			context.fillStyle = index === 0 ? '#25aff3' : '#166d99';
			context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

			if (el.x === berry.x && el.y === berry.y) {
				snake.maxTails++;
				incScore();
				randomPositionBerry();
			}

			for (let i = index + 1; i < snake.tails.length; i++) {
				if (el.x === snake.tails[i].x && el.y === snake.tails[i].y) {
					stopGame(); // Столкновение
				}
			}
		});
	}

	function drawBerry() {
		context.fillStyle = '#25aff3';
		context.fillRect(
			berry.x + config.sizeCell / 2 - config.sizeBerry,
			berry.y + config.sizeCell / 2 - config.sizeBerry,
			config.sizeBerry * 2,
			config.sizeBerry * 2,
		);
	}

	function collisionBorder() {
		if (snake.x < 0) snake.x = canvas.width - config.sizeCell;
		else if (snake.x >= canvas.width) snake.x = 0;
		if (snake.y < 0) snake.y = canvas.height - config.sizeCell;
		else if (snake.y >= canvas.height) snake.y = 0;
	}

	function randomPositionBerry() {
		berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
		berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
	}

	function incScore() {
		score++;
		drawScore();
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	function gameLoop() {
		animationFrame = requestAnimationFrame(gameLoop);

		if (++config.step < config.maxStep) return;
		config.step = 0;

		context.clearRect(0, 0, canvas.width, canvas.height);
		drawBerry();
		drawSnake();
	}

	function startGame() {
		if (gameStarted) {
		}

		gameStarted = true;
		gamePaused = false;
		gameContainer.style.display = 'flex'; // Показываем игру
		startButton.textContent = 'Restart'; // Меняем текст кнопки
		scoreBlock = document.querySelector('.score-count');
		score = 0;
		drawScore();

		snake.x = 176;
		snake.y = 192;
		snake.dx = config.sizeCell;
		snake.dy = 0;
		snake.tails = [];
		snake.maxTails = 5;

		randomPositionBerry();

		cancelAnimationFrame(animationFrame);
		requestAnimationFrame(gameLoop);
	}

	function stopGame() {
		gamePaused = true;
		cancelAnimationFrame(animationFrame);
		sendGameData(); // Отправляем данные при проигрыше
	}

	function sendGameData() {
		skin = animalSelect.value; // Обновляем выбранное животное

		const payload = {
			name: userName,
			score: score,
			skin: skin,
			time: new Date().toISOString(),
		};

		fetch('https://kool.krister.ee/chat/Snake_Game', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})
			.then((response) => response.json())
			.then((data) => console.log('Data sent successfully:', data))
			.catch((error) => console.error('Error sending data:', error));
	}

	async function getName() {
		const element = document.querySelector('.yourName');
		element.innerHTML = `<span class="spanName">You are: ${userName}</span>`;
	}

	getName();

	async function getBestScore() {
		const url = 'https://kool.krister.ee/chat/Snake_Game';
		const response = await fetch(url);
		const data = await response.json();

		const element = document.querySelector('.best-score-count');
		element.innerHTML = '';

		// Проверка имени пользователя, если это аноним, не показываем счёт
		if (userName === 'Anonymous') {
			return;
		}

		// Фильтруем данные для текущего пользователя и находим лучший счёт
		const bestScore = data.filter((item) => item.name === userName).reduce((max, item) => (item.score > max.score ? item : max), { score: 0 });

		// Выводим лучший счёт, если он есть
		if (bestScore.score > 0) {
			element.innerHTML = `/${bestScore.score}`;
		}
	}
	getBestScore();

	setInterval(getBestScore, 1000);

	async function getSkin() {
		if (userName === 'Anonymous') return; // Если пользователь анонимный, ничего не делаем

		const url = 'https://kool.krister.ee/chat/Snake_Game';
		const response = await fetch(url);
		const data = await response.json();

		// Сортируем данные по времени в порядке убывания
		const sortedData = data.sort((a, b) => new Date(b.time) - new Date(a.time));

		// Перебираем отсортированные данные
		for (const item of sortedData) {
			const name = item.name;
			const skin = item.skin;

			if (userName === name) {
				// Если имя совпадает с текущим пользователем
				const animalImage = document.getElementById('animal-img');
				const animalSelect = document.querySelector('select');

				// Устанавливаем картинку и текст в select
				animalImage.src = `img/${skin}.svg`;
				animalSelect.value = skin;
			}
		}
	}

	// Вызов функции для инициализации отображения
	getSkin();

	document.addEventListener('keydown', function (e) {
		if (e.code === 'KeyW' || e.code === 'ArrowUp') {
			if (snake.dy === 0) {
				snake.dy = -config.sizeCell;
				snake.dx = 0;
			}
		} else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
			if (snake.dx === 0) {
				snake.dx = -config.sizeCell;
				snake.dy = 0;
			}
		} else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
			if (snake.dy === 0) {
				snake.dy = config.sizeCell;
				snake.dx = 0;
			}
		} else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
			if (snake.dx === 0) {
				snake.dx = config.sizeCell;
				snake.dy = 0;
			}
		} else if (e.code === 'KeyR') {
			if (gameStarted == true || gameStarted == false) {
				startGame();
			}
		}
	});

	startButton.addEventListener('click', startGame);

	animalSelect.addEventListener('change', () => {
		const animalImage = document.getElementById('animal-img');
		const selectedAnimal = animalSelect.value;

		animalImage.src = `img/${selectedAnimal}.svg`;
		animalImage.alt = selectedAnimal.charAt(0).toUpperCase() + selectedAnimal.slice(1);
	});
});
