🚀 Galactic Annihilator: A Prompt Engineering Case Study <br><br>
<p align="center">
  
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Badge"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge"/>
</p>

<p align="center">
A retro-style arcade shooter built entirely through a conversational AI development process with <strong>Google Gemini</strong>.
</p>
Try Here : <a href="https://rajmulik511.github.io/Galactic-Annihilator/" target="_blank">  Game </a> (Mobile/Web Compatible)<br><br>

✨ Features
The result of this iterative process is a complete game with the following features:

✅ Dynamic Title Screen: An animated particle background on the start screen.

✅ Player Personalization: Enter your name and choose from four unique spaceships.

✅ Persistent High Score: The game saves the all-time high score locally in your browser.

✅ Progressive Difficulty: Enemy warships speed up after you reach a score of 350.

✅ "Rapid Fire" Power-Up: A chance for destroyed enemies to drop a temporary firerate booster.

✅ Fully Responsive: A clean, vertical layout that works great on both desktop and mobile.

✅ Dual Controls: Supports both keyboard (arrow keys) and on-screen touch controls.

🎮 How to Play
Objective: Destroy as many enemy warships as you can to get the highest score!

Game Over Conditions:

Your spaceship collides with an enemy warship.

An enemy warship reaches the bottom of the screen.

Controls:

Desktop: Use the Left and Right Arrow Keys to move.

Mobile: Use the on-screen buttons to move.

🤖 The Development Journey: From Prompt to Product
<details>
<summary><strong>Click to expand the full development log</strong></summary>

The game was built feature by feature, with each step initiated by a natural language prompt. This log details the iterative process.

Phase 1: Core Concept & Gameplay
Prompt: "Create a game where a spaceship at the bottom moves left and right, continuously shooting bullets at enemy warships that descend from the top."

Result: Gemini generated the initial HTML file with a functional game loop using the Canvas API, including player movement, continuous shooting, enemy spawning, and basic collision detection.

Phase 2: UI/UX & Mobile Adaptation
Prompt: "Make this game mobile-friendly. Add on-screen touch controls and change the layout to a vertical format that works better on phones."

Result: The code was refactored to include a responsive layout using Tailwind CSS, with touch buttons that appear on mobile devices. The game's aspect ratio and element sizes were adjusted for a better mobile viewing experience.

Phase 3: Personalization & Replayability
Prompt: "Add a flow where the player first enters their name, then selects from four different spaceships before the game starts. The game should also track and display a persistent high score."

Result: New UI screens for name entry and ship selection were added. JavaScript logic was implemented to handle this new pre-game flow and use localStorage to save and retrieve the high score, making the game more engaging.

Phase 4: Adding Dynamic Gameplay Mechanics
Prompt: "Let's add power-ups. Create a 'Rapid Fire' power-up that has a chance to drop from destroyed enemies and temporarily doubles the player's firing speed."

Result: The game logic was expanded to include a power-up system. This involved spawning the power-up on a random chance, detecting its collection by the player, and using a timer to manage the temporary effect.

Prompt: "Increase the game's difficulty. When the player's score crosses 350, make the enemy ships move faster."

Result: A state variable was added to track the difficulty level. The enemy spawning function was modified to generate faster ships once the score threshold was reached, adding a new layer of challenge.

Phase 5: Polishing and Debugging
Prompt: "The game freezes when it starts. I think the images aren't loading correctly. Fix it."

Result: Gemini identified an asynchronous bug where the game tried to draw images before they were loaded. It fixed the code by adding onload handlers to ensure all assets were fully loaded before starting the game loop.

Prompt: "Add a retro-style title and an animated background with shooting stars to the name entry screen to make it more exciting."

Result: A second canvas was added for the background animation, and the HTML/CSS was updated to include a large, stylized game title, enhancing the initial user experience.

</details>

💻 Technologies Used
HTML5, CSS3, JavaScript (Vanilla)

Tailwind CSS for styling and layout.

Google Gemini as the AI development partner.
