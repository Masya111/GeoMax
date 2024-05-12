class FlagGame {
    constructor() {
        this.flagImg = document.getElementById('flag-img');
        this.resultMsg = document.getElementById('result');
        this.Buttons = document.querySelectorAll(".flag-option");
        this.score = 0;
        this.questionCount = 0;

        // Прив'язка контексту this до методів класу
        this.checkGuess = this.checkGuess.bind(this);
        this.restartGame = this.restartGame.bind(this);
    }

    async fetchRandomFlag() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            if (!response.ok) {
                throw new Error('Failed to fetch flag data');
            }
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.length);
            const correctButtonIndex = Math.floor(Math.random() * 3);
            const flagUrl = data[randomIndex].flags.png;
            const countryName = data[randomIndex].name.common;
            this.flagImg.src = flagUrl;
            this.flagImg.dataset.country = countryName;

            const randomNames = [];
            for (let i = 0; i < 3; i++) {
                let rand;
                do {
                    rand = Math.floor(Math.random() * data.length);
                } while (randomNames.includes(data[rand].name.common));
                randomNames.push(data[rand].name.common);
            }
            randomNames[correctButtonIndex] = countryName;

            this.Buttons.forEach(button => {
                button.removeEventListener('click', this.checkGuess);
            });

            this.Buttons.forEach((button, index) => {
                button.textContent = randomNames[index];
                button.addEventListener('click', this.checkGuess);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async updateScoreFlag(newScore) {
        let currentUserID = localStorage.getItem('currentUserID');
        try {
            const response = await fetch(`https://6636740b415f4e1a5e27717b.mockapi.io/api/v1/User/${currentUserID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch current score_fact');
            }
            const currentUser = await response.json();

            if (newScore > currentUser.score_flag) {
                const updateResponse = await fetch(`https://6636740b415f4e1a5e27717b.mockapi.io/api/v1/User/${currentUserID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ score_flag: newScore })
                });
                if (!updateResponse.ok) {
                    throw new Error('Failed to update score_fast');
                }
                console.log('Score_flag updated successfully');
            } else {
                console.log('New score_fast is not greater than current score_flag');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    checkGuess(event) {
        const guess = event.target.textContent;
        const correctAnswer = this.flagImg.dataset.country.toLowerCase();
        if (guess.toLowerCase() === correctAnswer) {
            this.score++;
            this.resultMsg.textContent = 'Correct!';
            this.resultMsg.style.color = 'green';
        } else {
            this.resultMsg.textContent = 'Incorrect. Try again.';
            this.resultMsg.style.color = 'red';
        }

        this.questionCount++;
        if (this.questionCount === 15) {
            this.endGame();
            this.updateScoreFlag(this.score);
        } else {
            this.fetchRandomFlag();
        }
    }

    endGame() {
        this.resultMsg.textContent = `The End`;
        document.getElementById("score-value").textContent = this.score;
        this.resultMsg.style.color = 'black';
        document.getElementById('result-window').style.display = 'block';
        document.getElementById('mainMenu').style.display = 'block';
        document.getElementById('restart').style.display = 'block';
        this.Buttons.forEach(button => {
            button.removeEventListener('click', this.checkGuess);
        });
    }

    restartGame() {
        this.score = 0;
        this.questionCount = 0;
        this.resultMsg.textContent = '';
        this.resultMsg.style.color = 'black';
        document.getElementById('result-window').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('restart').style.display = 'none';
        this.Buttons.forEach(button => {
            button.addEventListener('click', this.checkGuess);
        });
        this.fetchRandomFlag();
    }

    init() {
        this.fetchRandomFlag();
        document.getElementById('mainMenu').addEventListener('click', () => {
            location.href = 'Menu.html';
        });
        document.getElementById('restart').addEventListener('click', this.restartGame);
    }
}

const game = new FlagGame();
game.init();