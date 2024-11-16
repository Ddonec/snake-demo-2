if(!localStorage.getItem('snake-high-score'))
    localStorage.setItem('snake-high-score','0');


var row = 18;  // Высота поля
var col = 10;  // Ширина поля

var a1 = [Math.floor(row / 2), Math.floor(row / 2), Math.floor(row / 2)];  // Начальная позиция змейки по строкам
var a2 = [Math.floor(col / 2), Math.floor(col / 2) - 1, Math.floor(col / 2) - 2];  // Начальная позиция змейки по столбцам

var fr,fc,flag=0,highScore=parseInt(localStorage.getItem('snake-high-score')),currentScore=0;
var direction = 'right';


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
let currentFoodType = 'food2'; // Текущий тип еды (food или food2)

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
        // Случайный выбор еды
        currentFoodType = getRandomElement(bodyImages);
        while (foodCell.firstChild) {
            foodCell.removeChild(foodCell.firstChild);
        }
        foodCell.innerHTML = ''; // Очищаем ячейку перед добавлением новой еды
        let foodImg = document.createElement('img');
        foodImg.src = currentFoodType;
        foodImg.classList.add('food');
        foodCell.appendChild(foodImg);
        console.log(currentFoodType);
    }
}

function createContainer() {
    document.querySelector('.current-score').innerHTML = currentScore;
    document.querySelector('.high-score').innerHTML = highScore;

    let container = document.querySelector('.container');
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
            cell.innerHTML = ''; // Очищаем содержимое ячейки

            let img = document.createElement('img');
            img.classList.add('snake-part');

            if (i === 0) { // Голова змейки
                img.src = 'assets/snake/snakefront.svg';
                img.classList.add(getRotationClass(direction));
            } else if (i === a1.length - 1) { // Хвост змейки
                img.src = 'assets/snake/snakeback.svg';
                img.classList.add(getRotationClass(getTailDirection()));
            } else { // Части тела змейки с фиксацией случайных элементов
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

// Переменные для хранения координат касания
let startTouchX, startTouchY, endTouchX, endTouchY;

// Обработчик для фиксации начала свайпа
document.addEventListener("touchstart", (event) => {
    startTouchX = event.touches[0].clientX;
    startTouchY = event.touches[0].clientY;
}, false);

// Обработчик для фиксации конца свайпа и определения направления
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

    // Проверяем текущее направление змейки
    const actualDirection = direction;

    // Логика смены направления на основании свайпа
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
    // setTimeout(function() {
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

            snakeBodyParts.push(currentFoodType);
    // }, 10);
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

var func = setInterval(() => {
    flag = 1;

    // Очищаем все ячейки перед обновлением позиции змейки
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let cell = document.querySelector('#c' + i + '-' + j);
            if (cell) {
                cell.innerHTML = ''; // Удаляем все содержимое, включая картинки
            }
        }
    }

    moveSnake();

    // Проверяем, находится ли голова змейки в позиции еды
    if (a1[0] === fr && a2[0] === fc) {
        currentScore++;

        // Удаляем класс 'food' из ячейки, где была еда
        let eatenFoodCell = document.querySelector('#c' + fr + '-' + fc);
        if (eatenFoodCell) {
            eatenFoodCell.classList.remove('food');
            eatenFoodCell.classList.add('cell');
            eatenFoodCell.innerHTML = ''; // Удаляем изображение еды
        }
    
        placeFood();
        document.querySelector('.current-score').innerHTML = currentScore;
        addTail();
    }

    if (a1[0] === fr && a2[0] === fc) {
        currentScore++;
        placeFood();
        document.querySelector('.current-score').innerHTML = currentScore;
        addTail();
    }

    // Перерисовываем змейку, используя только SVG-картинки
    renderSnake();

    checkCollision();

    // Устанавливаем изображение еды
    let foodCell = document.querySelector('#c' + fr + '-' + fc);
    if (foodCell) {
        foodCell.innerHTML = ''; // Очищаем ячейку перед добавлением новой еды
        let foodImg = document.createElement('img');
        foodImg.src = currentFoodType;
        foodImg.classList.add('food');
        foodCell.appendChild(foodImg);
    }

}, 200);



function gameOver() {
    let container = document.querySelector('.container');
    if (container) {
        container.style.display = "none";
    } else {
        console.error("Container not found!");
    }
    
    let div = document.querySelector('.game-over');
    if (div) {
        div.style.display = "block";
        // Обновление финального счёта
        document.querySelector('.final-score').innerText = currentScore;
    } else {
        console.error("Game Over element not found!");
    }

    // Проверяем, если текущий счёт больше высокого, обновляем его
    if(currentScore > highScore) {
        document.querySelector('.high-score').innerHTML = currentScore;
        localStorage.setItem('snake-high-score', currentScore);
    }

}


function showMenu() {
    document.querySelector('.main-menu').classList.remove('hidden');
    document.querySelector('.hello-text').classList.remove('hidden');
    document?.getElementById('successMessage').classList.remove('hidden');
    document.querySelector('.rules').classList.add('hidden');
    document.querySelector('.leaderboard').classList.add('hidden');
    document.querySelector('.registration').classList.add('hidden');
}

function showRules() {
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.hello-text').classList.add('hidden');
    document?.getElementById('successMessage').classList.add('hidden');
    document.querySelector('.rules').classList.remove('hidden');
}

function showLeaderboard() {
    console.log("Showing leaderboard...");
    
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.hello-text').classList.add('hidden');
    document?.getElementById('successMessage').classList.add('hidden');
    document.querySelector('.leaderboard').classList.remove('hidden');
    
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardTable = document.querySelector('.leaderboard-table');

    leaderboardTable.innerHTML = '';
    
    leaderboardData.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <div class="yellow-tab">${index + 1} место</div>
            <div class="leaderboard-score">
            <span>${entry.nickname}</span>
            <span>${entry.score}</span>
            </div>
        `;
        leaderboardTable.appendChild(row);
    });

    console.log("Leaderboard shown.");
}



function startGame() {
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.rules').classList.add('hidden');
    document.querySelector('.leaderboard').classList.add('hidden');
    document.querySelector('.registration').classList.add('hidden');
    document.querySelector('.hello-text').classList.add('hidden');
    document.getElementById('successMessage').classList.add('hidden');
    document.querySelector('.container').classList.remove('hidden');  
    document.querySelector('.footer').classList.remove('hidden');  
    document.querySelector('.score').classList.remove('hidden');  
    createContainer();
}