(function(){

var row = 18;  // Высота поля
var col = 10;  // Ширина поля

var a1 = [Math.floor(row / 2), Math.floor(row / 2), Math.floor(row / 2)];  
var a2 = [Math.floor(col / 2), Math.floor(col / 2) - 1, Math.floor(col / 2) - 2]; 

var fr,fc,flag=0,defaultScore = 0;
var direction = 'right';

var userId;              // Идентификатор пользователя на БП
var email;               // Электропочта пользователя
var currentScore;        // Текущий счёт пользователя, если имеется, то число
var updateScoreUrl;      // Урл для отправки сообщений на обновление счёта
var leaderBoardUrl;      // Урл для получения данных для отрисовки таблицы результатов


const bodyImages = [
    'assets/snake/snakebody1.svg',
    'assets/snake/snakebody2.svg',
    'assets/snake/snakebody3.svg',
    'assets/snake/snakebody4.svg',
    'assets/snake/snakebody5.svg',
    'assets/snake/snakebody6.svg',
    'assets/snake/snakebody7.svg',
    'assets/snake/snakebody8.svg'
];

let snakeBodyParts = ["assets/snake/snakebody1.svg"];
let foodPartToPush;
let currentFoodType;
let container = document.querySelector('.container');
let divGO = document.querySelector('.game-over');
let func 

const loadingIndicator = document.querySelector('.loading-indicator');

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function placeFood() {
    while (true) {
        fr = Math.floor(Math.random() * row);
        fc = Math.floor(Math.random() * col);
        
        let occupied = false;
        for (let i = 0; i < a1.length; i++) {
            if (a1[i] === fr && a2[i] === fc) {
                occupied = true;
                break;
            }
        }

        if (!occupied) break;
    }

    let foodCell = document.querySelector('#c' + fr + '-' + fc);
    if (foodCell) {
        currentFoodType = getRandomElement(bodyImages);
        while (foodCell.firstChild) {
            foodCell.removeChild(foodCell.firstChild);
        }
        foodCell.innerHTML = ''; 
        let foodImg = document.createElement('img');
        foodImg.src = currentFoodType;
        foodImg.classList.add('food');
        foodCell.appendChild(foodImg);
    }
}

function createContainer() {
    document.querySelector('.current-score').innerHTML = defaultScore;
    document.querySelector('.high-score').innerHTML = currentScore || 0;


    container.innerHTML = '';

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let div = document.createElement('div');
            div.id = 'c' + i + '-' + j;
            div.className = 'cell';
            container.append(div);
        }
    }

    renderSnake();
    placeFood();
}

function renderSnake() {
    for (let i = 0; i < a1.length; i++) {
        let cell = document.querySelector(`#c${a1[i]}-${a2[i]}`);
        
        if (cell) {
            cell.innerHTML = ''; 

            let img = document.createElement('img');
            img.classList.add('snake-part');

            if (i === 0) { 
                img.src = 'assets/snake/snakefront.svg';
                img.classList.add(getRotationClass(direction));
            } else if (i === a1.length - 1) { 
                img.src = 'assets/snake/snakeback.svg';
                img.classList.add(getRotationClass(getTailDirection()));
            } else { 
                img.src = snakeBodyParts[i - 1];
            }

            cell.appendChild(img);

        }
    }
}

function getRotationClass(direction) {
    switch (direction) {
        case 'right': return 'rotate-0';
        case 'down': return 'rotate-90';
        case 'left': return 'rotate-180';
        case 'up': return 'rotate-270';
    }
}

function getTailDirection() {
    if (a2[a2.length - 1] < a2[a2.length - 2]) return 'right';
    if (a2[a2.length - 1] > a2[a2.length - 2]) return 'left';
    if (a1[a1.length - 1] < a1[a1.length - 2]) return 'down';
    return 'up';
}

function moveSnake() {
    for (let i = a1.length - 1; i > 0; i--) {
        a1[i] = a1[i - 1];
        a2[i] = a2[i - 1];
    }

    switch (direction) {
        case 'left': a2[0] = a2[0] === 0 ? col - 1 : a2[0] - 1; break;
        case 'right': a2[0] = (a2[0] + 1) % col; break;
        case 'up': a1[0] = a1[0] === 0 ? row - 1 : a1[0] - 1; break;
        case 'down': a1[0] = (a1[0] + 1) % row; break;
    }

    renderSnake();
}

document.onkeydown = (event) => {
    if(flag)
    {
        if(event.keyCode == 37||event.keyCode == 65 )
        {
            if(direction != 'right' && direction != 'left')
            {
                direction = 'left';
                flag = 0;
            }
        }
        else if(event.keyCode == 38||event.keyCode == 87 )
        {
            if(direction != 'down' && direction != 'up')
            {
                direction = 'up';
                flag = 0;
            }
        }
        else if(event.keyCode == 39||event.keyCode == 68 )
        {
            if(direction != 'left' && direction != 'right')
            {    
                direction = 'right';
                flag = 0;
            }
        }
        else if(event.keyCode == 40||event.keyCode == 83 )
        {
            if(direction != 'up' && direction != 'down')
            {
                direction = 'down';
                flag = 0;
            }
        }
        
    }
}

let startTouchX, startTouchY, endTouchX, endTouchY;

document.addEventListener("touchstart", (event) => {
    startTouchX = event.touches[0].clientX;
    startTouchY = event.touches[0].clientY;
}, false);

document.addEventListener("touchend", (event) => {
    endTouchX = event.changedTouches[0].clientX;
    endTouchY = event.changedTouches[0].clientY;
    handleSwipe();
}, false);

function handleSwipe() {
    if (!flag) return;
    flag = 0;

    const diffX = Math.abs(endTouchX - startTouchX);
    const diffY = Math.abs(endTouchY - startTouchY);
    const actualDirection = direction;

    if (endTouchX < startTouchX && actualDirection !== 'right' && diffX > diffY) {
        direction = 'left';
    } else if (endTouchX > startTouchX && actualDirection !== 'left' && diffX > diffY) {
        direction = 'right';
    } else if (endTouchY < startTouchY && actualDirection !== 'down' && diffX < diffY) {
        direction = 'up';
    } else if (endTouchY > startTouchY && actualDirection !== 'up' && diffX < diffY) {
        direction = 'down';
    }
}

function moveSnake() {
    for (let i = a1.length - 1; i > 0; i--) {
        a1[i] = a1[i - 1];
        a2[i] = a2[i - 1];
    }
    if (direction === 'left') {
        a2[0] = (a2[0] === 0) ? col - 1 : a2[0] - 1;
    } else if (direction === 'right') {
        a2[0] = (a2[0] + 1) % col;
    } else if (direction === 'up') {
        a1[0] = (a1[0] === 0) ? row - 1 : a1[0] - 1;
    } else if (direction === 'down') {
        a1[0] = (a1[0] + 1) % row;
    }
}

function addTail() {
    setTimeout(function() {
        let tailRow = a1[a1.length - 1];
        let tailCol = a2[a2.length - 1];

        if (direction === 'left') {
            a2.push((tailCol === col - 1) ? 0 : tailCol + 1);
            a1.push(tailRow);
        } else if (direction === 'right') {
            a2.push((tailCol === 0) ? col - 1 : tailCol - 1);
            a1.push(tailRow);
        } else if (direction === 'up') {
            a1.push((tailRow === row - 1) ? 0 : tailRow + 1);
            a2.push(tailCol);
        } else if (direction === 'down') {
            a1.push((tailRow === 0) ? row - 1 : tailRow - 1);
            a2.push(tailCol);
        }

            snakeBodyParts.push(foodPartToPush);
    }, 50);
}

function checkCollision()
{
    let i,j;
    for(i=0;i<a1.length;i++)
    {
        for(j=i+1;j<a1.length;j++)
        {
            if(a1[i]==a1[j]&&a2[i]==a2[j])
                break;
        }
        if(j<a1.length)
            break;
    }
    if(i<a1.length)
    {
        clearInterval(func);
        gameOver();
    }
}


function gameLoop(){
    flag = 1;

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let cell = document.querySelector('#c' + i + '-' + j);
            if (cell) {
                cell.innerHTML = ''; 
            }
        }
    }

    moveSnake();
    foodPartToPush = currentFoodType
    if (a1[0] === fr && a2[0] === fc) {
        defaultScore++;
        let eatenFoodCell = document.querySelector('#c' + fr + '-' + fc);
        if (eatenFoodCell) {
            eatenFoodCell.classList.remove('food');
            eatenFoodCell.classList.add('cell');
            eatenFoodCell.innerHTML = ''; 
        }
    
        placeFood();
        document.querySelector('.current-score').innerHTML = defaultScore;
        addTail();
    }

    if (a1[0] === fr && a2[0] === fc) {
        defaultScore++;
        placeFood();
        document.querySelector('.current-score').innerHTML = defaultScore;
        addTail();
    }
    renderSnake();

    checkCollision();

    let foodCell = document.querySelector('#c' + fr + '-' + fc);
    if (foodCell) {
        foodCell.innerHTML = ''; 
        let foodImg = document.createElement('img');
        foodImg.src = currentFoodType;
        foodImg.classList.add('food');
        foodCell.appendChild(foodImg);
    }
}

function gameOver() {
    if (container) {
        container.classList.add("hidden");
    } else {
        console.error("Container not found!");
        window.parent.postMessage(
            JSON.stringify({
                type: "error",
                data: {
                    reason: "Элемент не найден",
                    level: "error"
                }
            }),
            "*"
        );
    }

    if (divGO) {
        divGO.classList.remove("hidden");
        document.querySelector('.final-score').innerText = defaultScore;
    } else {
        console.error("Game Over element not found!");
        window.parent.postMessage(
            JSON.stringify({
                type: "error",
                data: {
                    reason: "Элемент не найден в исходном коде",
                    level: "error"
                }
            }),
            "*"
        );
    }


    try {
        window.parent.postMessage(
            JSON.stringify({
                type: "gameComplete",
                data: {
                    score: defaultScore
                }
            }),
            "*"
        );
        console.log("Счет отправлен")
    } catch (error) {
        console.error("Ошибка при отправке результата игры:", error);
        window.parent.postMessage(
            JSON.stringify({
                type: "error",
                data: {
                    reason: "Ошибка при отправке результата игры",
                    level: "critical"
                }
            }),
            "*"
        );
    }
}

window.resetGame = function resetGame() {
    a1 = [Math.floor(row / 2), Math.floor(row / 2), Math.floor(row / 2)];
    a2 = [Math.floor(col / 2), Math.floor(col / 2) - 1, Math.floor(col / 2) - 2];
    direction = 'right';
    defaultScore = 0;
    snakeBodyParts = ["assets/snake/snakebody1.svg"];
    defaultScore = 0;
    container.innerHTML = '';
    divGO.classList.add("hidden");

    clearInterval(func);
    func = null
    showMenu();
}



function updatePostScore(score) {
    if (!updateScoreUrl) {
        console.error("URL для обновления счёта не установлен!");
        return;
    }

    const body = `score=${score}`;
    fetch(updateScoreUrl, {
        method: "POST",
        body: body,
        headers: new Headers([
            ["Content-Type", "application/x-www-form-urlencoded"],
            ["Content-Length", "" + body.length]
        ])
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            console.log("Счёт успешно обновлён.");
        } else {
            console.error("Ошибка при обновлении счёта:", data);
        }
    })
    .catch(error => {
        console.error("Ошибка при отправке запроса:", error);
    });
}

window.showMenu = function showMenu() {
    document.querySelector('.main-menu').classList.remove('hidden');
    document.querySelector('.hello-text').classList.remove('hidden');
    document.querySelector('.rules').classList.add('hidden');
    document.querySelector('.leaderboard').classList.add('hidden');
    loadingIndicator.classList.add('hidden');
    document?.querySelector('.container').classList.add('hidden');  
    document?.querySelector('.score').classList.add('hidden');  
    document?.querySelector('.play-again').classList.add('hidden');  
}

window.showRules = function () {
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.hello-text').classList.add('hidden');
    document.querySelector('.rules').classList.remove('hidden');
}

window.showLeaderboard = function () {
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.hello-text').classList.add('hidden');
    document.querySelector('.leaderboard').classList.remove('hidden');

    const leaderboardTable = document.querySelector('.leaderboard-table');
    leaderboardTable.innerHTML = '';

    loadingIndicator.classList.remove('hidden');

    try {
        window.parent.postMessage(
            JSON.stringify({
                type: "resultsRequest"
            }),
            "*"
        );

        window.addEventListener("message", function handleLeaderboardResponse(event) {
            try {
                const message = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

                if (message.type === "resultResponse" && message.data) {
                    loadingIndicator.classList.add('hidden');

                    const { top, userBoundary } = message.data;

                    if (Array.isArray(top)) {
                        const topSection = document.createElement('div');
                        topSection.classList.add('leaderboard-top');
                        topSection.innerHTML = '<h2>Топ участников</h2>';

                        top.forEach(entry => {
                            const row = document.createElement('div');
                            row.classList.add('leaderboard-row');
                            row.innerHTML = `
                                <div class="yellow-tab">${entry.place} место</div>
                                <div class="leaderboard-score">
                                    <span>${entry.email}</span>
                                    <span>${entry.score}</span>
                                </div>
                            `;
                            topSection.appendChild(row);
                        });

                        leaderboardTable.appendChild(topSection);
                    }

                    if (Array.isArray(userBoundary)) {
                        const userBoundarySection = document.createElement('div');
                        userBoundarySection.classList.add('leaderboard-user-boundary');
                        userBoundary.forEach(entry => {
                            const row = document.createElement('div');
                            row.classList.add('leaderboard-row');
                            row.innerHTML = `
                                <div class="yellow-tab">${entry.place} место</div>
                                <div class="leaderboard-score">
                                    <span>${entry.email}</span>
                                    <span>${entry.score}</span>
                                </div>
                            `;
                            userBoundarySection.appendChild(row);
                        });

                        leaderboardTable.appendChild(userBoundarySection);
                    }

                    window.removeEventListener("message", handleLeaderboardResponse);
                }
            } catch (error) {
                console.error("Ошибка обработки ответа таблицы лидеров:", error);
                loadingIndicator.classList.add('hidden');
            }
        });
    } catch (error) {
        console.error("Ошибка при запросе таблицы лидеров:", error);
        window.parent.postMessage(
            JSON.stringify({
                type: "error",
                data: {
                    reason: "Ошибка при запросе таблицы лидеров",
                    level: "critical"
                }
            }),
            "*"
        );
        loadingIndicator.classList.add('hidden');
    }
};


window.startGame = function () {
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.rules').classList.add('hidden');
    document.querySelector('.leaderboard').classList.add('hidden');
    document.querySelector('.hello-text').classList.add('hidden');
    document?.querySelector('.container').classList.remove('hidden');  
    document.querySelector('.footer').classList.remove('hidden');  
    document.querySelector('.score').classList.remove('hidden');  
    document?.querySelector('.play-again').classList.remove('hidden');  

    createContainer();
    func = setInterval(gameLoop, 200);
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
    try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        console.log("Получены данные:", data);

        if (data.payload) {
            const payload = data.payload;
            userId = payload.userId;
            email = payload.email;
            currentScore = payload.currentScore;
            updateScoreUrl = payload.updateScoreUrl;
            leaderBoardUrl = payload.leaderBoardUrl;

            console.log("URL для обновления счёта:", updateScoreUrl);
        } else {
            console.warn("Payload не найден:", data);
        }
    } catch (error) {
        console.error("Ошибка при обработке сообщения:", error);
    }
    console.log(currentScore)
}


})();