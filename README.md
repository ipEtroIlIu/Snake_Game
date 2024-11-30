# Snake Game

This project is a web-based implementation of the classic Snake game, with added features like customizable skins and real-time score tracking.

## Description

The Snake Game allows users to control a snake as it collects berries and grows longer while avoiding collisions with itself. The game supports real-time score tracking and customization, making it engaging and fun for players.

### Features

1. **Real-Time Gameplay**

   - Navigate the snake using arrow keys (or W, A, S, D).
   - Collect berries to increase the snake's length and score.
   - Avoid collisions with yourself to stay in the game.

2. **Custom Skins**

   - Select from a variety of skins (e.g., Snake, Rabbit, Tiger) for a personalized experience.

3. **Score Tracking**

   - Track your current and best scores.
   - Best scores are updated dynamically and stored on the server.

## Languages and Technologies Used

- **HTML** — For structuring the web page.
- **CSS** — For styling and design.
- **JavaScript** — For game logic and interactions.

## Functionality

1. **Game Start and Play**

   - Start the game by pressing the "Start" button or the **R** key.
   - The game begins with a snake that can move in all directions.

2. **Dynamic Gameplay**

   - The snake grows longer as it collects berries.
   - If the snake collides with itself, the game ends.

3. **Customization**

   - Change your skin through a dropdown menu.
   - Previously selected skins are restored upon restarting the game.

4. **Score Management**
   - Track your current score during gameplay.
   - The best score for your user is displayed on the screen.

## Installation and Launch

1. Clone the repository:
   ```bash
   git clone https://github.com/ipEtroIlIu/Snake_Game
   ```
2. Navigate to the project folder:
   ```bash
   cd Snake_Game
   ```
3. Open the `index.html` file in a browser.

4. Enjoy the game!

## How It Works

1. **Game Loop**  
   The game uses a continuous loop to update the snake's position, detect collisions, and draw the game elements (snake and berries).

2. **Real-Time Score Updates**  
   Scores are updated in real-time and displayed dynamically on the screen.

3. **Data Persistence**  
   Player data (e.g., scores and skin preferences) is sent to a server via API calls for storage and retrieval.

## API Integration

The game interacts with a server to:

- Fetch the user's best score.
- Retrieve the last selected skin for returning users.
- Save the current session's score and skin after the game ends.

Example API endpoint used:

- **POST** `/Snake_Game` — To send game data (name, score, skin, time).
- **GET** `/Snake_Game` — To fetch user and game data.

## Controls

- **Arrow Keys (↑, ↓, ←, →)** or **W, A, S, D**: Move the snake.
- **R**: Restart the game.
- **Dropdown Menu**: Change the your skin.

## Customization

Players can select from various skins using the dropdown menu. The selected skin is saved for future sessions.

## Repository

Find the source code and updates on [GitHub](https://github.com/ipEtroIlIu/Snake_Game).

Happy gaming! 🐍
