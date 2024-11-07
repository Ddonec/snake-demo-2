if(!localStorage.getItem('snake-high-score'))
    localStorage.setItem('snake-high-score','0');

var row = 18;  // Высота поля
var col = 10;  // Ширина поля

var a1 = [Math.floor(row / 2), Math.floor(row / 2), Math.floor(row / 2)];  // Начальная позиция змейки по строкам
var a2 = [Math.floor(col / 2), Math.floor(col / 2) - 1, Math.floor(col / 2) - 2];  // Начальная позиция змейки по столбцам

var fr,fc,flag=0,highScore=parseInt(localStorage.getItem('snake-high-score')),currentScore=0;
var direction = 'right';



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

    let food = document.querySelector('#c' + fr + '-' + fc);
    if (food) {
        food.className = 'food';
    }
}

function createContainer() {
    // Отображаем текущий и максимальный счёт
    document.querySelector('.current-score').innerHTML = currentScore;
    document.querySelector('.high-score').innerHTML = highScore;
    
    // Очищаем контейнер перед созданием нового поля
    let container = document.querySelector('.container');
    container.innerHTML = '';  // Удаляет старые ячейки

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let div = document.createElement('div');
            div.id = 'c' + i + '-' + j;
            div.className = 'cell';
            container.append(div);
        }
    }
    
    for (let i = 0; i < a1.length; i++) {   
        let div = document.querySelector('#c' + a1[i] + '-' + a2[i]);
        div.className = 'snake';
    }

    placeFood();
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
    // Если змейка уже изменила направление, ждем следующего свайпа
    if (!flag) return;
    flag = 0;

    // Определяем смещения по осям
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


function addTail()
{
    if(direction == 'left')
    {
        a1.unshift(a1[0]);
        if(a2[0]==0)
        {
            a2.unshift(col-1);
        }
        else
        {
            a2.unshift(a2[0]-1);
        }
    }
    else if(direction == 'right')
    {
        a1.unshift(a1[0]);
        a2.unshift((a2[0]+1)%col);
    }
    else if(direction == 'up')
    {
        if(a1[0]==0)
        {
            a1.unshift(row-1);
        }
        else
        {
            a1.unshift(a1[0]-1);
        }
        a2.unshift(a2[0]);
    }
    else if(direction == 'down')
    {
        a1.unshift((a1[0]+1)%row);
        a2.unshift(a2[0]);
    }
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

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let cell = document.querySelector('#c' + i + '-' + j);
            if (cell) {
                cell.className = 'cell'; // Очистка ячеек
            }
        }
    }

    moveSnake();

    if (a1[0] === fr && a2[0] === fc) {
        currentScore++;
        placeFood();
        document.querySelector('.current-score').innerHTML = currentScore;
        addTail();
    }

    for (let i = 0; i < a1.length; i++) {
        let cell = document.querySelector('#c' + a1[i] + '-' + a2[i]);
        if (cell) {
            cell.className = 'snake';
        }
    }

    checkCollision();

    let foodCell = document.querySelector('#c' + fr + '-' + fc);
    if (foodCell) {
        foodCell.className = 'food';
    }
}, 200);


function gameOver()
{
    let container = document.querySelector('.container');
    container.style.display = "none";
    let div = document.querySelector('.game-over');
    div.style.display = "block";
    if(currentScore>highScore)
    {
        document.querySelector('.high-score').innerHTML = currentScore;
        localStorage.setItem('snake-high-score',currentScore)
    }
}







function showMenu() {
    document.querySelector('.main-menu').classList.remove('hidden');
    document.querySelector('.rules').classList.add('hidden');
    document.querySelector('.leaderboard').classList.add('hidden');
    document.querySelector('.registration').classList.add('hidden');
}

function showRules() {
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.rules').classList.remove('hidden');
}

function showLeaderboard() {
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.leaderboard').classList.remove('hidden');
    // Здесь можно заполнить таблицу лидеров из localStorage или базы данных
}

function showRegistration() {
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.registration').classList.remove('hidden');
}

function startGame() {
    document.querySelector('.main-menu').classList.add('hidden');
    document.querySelector('.rules').classList.add('hidden');
    document.querySelector('.leaderboard').classList.add('hidden');
    document.querySelector('.registration').classList.add('hidden');
    document.querySelector('.container').classList.remove('hidden');  
    document.querySelector('.footer').classList.remove('hidden');  
    document.querySelector('.score').classList.remove('hidden');  
    createContainer();
}