//sw，sh是单个方块参数，tr，td是网格参数
let [sw, sh, tr, td] = [20, 20, 30, 30];
let snake = null,
    food = null,
    game = null;

//创建方块
function Square(x, y, classname) {
    this.x = x * sw;
    this.y = y * sh;
    this.class = classname;

    this.viewContent = document.createElement("div");
    this.viewContent.className = this.class;
    this.parent = document.getElementsByClassName("snakeWrap")[0];
}
//写入方块样式
Square.prototype.create = function () {
    this.viewContent.style.position = "absolute";
    this.viewContent.style.width = sw + "px";
    this.viewContent.style.height = sh + "px";
    this.viewContent.style.left = this.x + "px";
    this.viewContent.style.top = this.y + "px";
    this.parent.appendChild(this.viewContent);
};
//吃掉方块
Square.prototype.remove = function () {
    this.parent.removeChild(this.viewContent);
};
//蛇
function Snake() {
    this.head = null;//蛇头
    this.tail = null;//蛇尾
    this.pos = [];//蛇身体

    this.directionNum = {
        left: {
            x: -1,
            y: 0,
            rotate: 180
        },
        right: {
            x: +1,
            y: 0,
            rotate: 0
        },
        up: {
            x: 0,
            y: -1,
            rotate: -90
        },
        down: {
            x: 0,
            y: +1,
            rotate: 90
        }
    }//蛇走的方向
}
//初始化蛇信息
Snake.prototype.init = function () {
    // 蛇头
    let snakeHead = new Square(2, 0, 'snakeHead');
    snakeHead.create();
    this.head = snakeHead;//存储头信息
    this.pos.push([2, 0]);
    // 蛇体
    let snakeBody1 = new Square(1, 0, 'snakeBody');
    snakeBody1.create();
    this.pos.push([1, 0]);

    let snakeBody2 = new Square(0, 0, 'snakeBody');
    snakeBody2.create();
    this.tail = snakeBody2//蛇尾巴设定在蛇体末端
    this.pos.push([0, 0]);

    // 链表使蛇变成一个整体
    snakeHead.last = null;
    snakeHead.next = snakeBody1;

    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;

    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;

    this.direction = this.directionNum.right;
};

// 获取蛇头下一个位置信息，判断下一步发生事情
Snake.prototype.getNextPos = function () {
    //判断下一个点信息
    let nextPos = [
        this.head.x / sw + this.direction.x,
        this.head.y / sh + this.direction.y
    ];
    //撞到自己
    let selfCollied = false;
    this.pos.forEach(function (value) {
        if (value[0] == nextPos[0] && value[1] == nextPos[1]) {
            selfCollied = true;
        }
    });
    if (selfCollied) {
        console.log("咬到自己了");
        this.strategies.die();
        return;//避免重复判断后面情况
    }
    //撞到围墙
    if (nextPos[0] < 0 || nextPos[1] < 0 || nextPos[0] > td - 1 || nextPos[1] > tr - 1) {
        console.log('撞墙了！');
        this.strategies.die();
        return;
    }
    // 吃东西
    if (food && food.pos[0] == nextPos[0] && food.pos[1] == nextPos[1]) {
        this.strategies.eat.call(this);
        return;
    }

    // 无事发生
    this.strategies.move.call(this)//调用move函数并将里面的this指向snake（原本指向snake.strategies）

    // 蛇行为逻辑
}
Snake.prototype.strategies = {

    move: function (eating) {
        let newBody = new Square(this.head.x / sw, this.head.y / sh, "snakeBody");
        //更新链表
        newBody.next = this.head.next;
        newBody.next.last = newBody;
        newBody.last = null;
        //删掉旧蛇头
        this.head.remove()
        newBody.create();
        //创建心蛇头更新链表关系
        let newHead = new Square(this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y, "snakeHead")
        newHead.next = newBody;
        newHead.last = null;
        newBody.last = newHead;
        newHead.viewContent.style.transform = 'rotate(' + this.direction.rotate + 'deg)';
        newHead.create();
        //更新pos
        this.pos.splice(0, 0, [this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y]);
        this.head = newHead;

        if (!eating) {
            this.tail.remove();
            this.tail = this.tail.last;
            this.pos.pop();
        }
    },
    eat: function () {
        this.strategies.move.call(this, true);
        createFood();
        game.score++;
    },
    die: function () {
        game.over();
    }
}


snake = new Snake();

//食物生成
function createFood() {
    //随机生成食物坐标，在容器里且判断是否在蛇身上
    let x = null;
    let y = null;
    let include = true;
    while (include) {
        x = Math.round(Math.random() * (td - 1));
        y = Math.round(Math.random() * (tr - 1));

        snake.pos.forEach(function (value) {
            if (x != value[0] && y != value[1]) {
                include = false;
            }
        });
    }
    //生成食物
    food = new Square(x, y, 'food');
    food.pos = [x, y];

    let foodDom = document.querySelector('.food');
    if (foodDom) {
        foodDom.style.left = x * sw + 'px';
        foodDom.style.top = y * sh + 'px';
    } else {
        food.create();
    }

}

//创建游戏逻辑
function Game() {
    this.timer = null;
    this.score = 0;
}
//开始游戏初始化
Game.prototype.init = function () {
    snake.init();
    // snake.getNextPos();
    createFood();

    document.onkeydown = function (ev) {
        //绑定键盘事件
        if (ev.which == 37 && snake.direction != snake.directionNum.right) {
            snake.direction = snake.directionNum.left;
        } else if (ev.which == 38 && snake.direction != snake.directionNum.down) {
            snake.direction = snake.directionNum.up;
        } else if (ev.which == 39 && snake.direction != snake.directionNum.left) {
            snake.direction = snake.directionNum.right;
        } else if (ev.which == 40 && snake.direction != snake.directionNum.up) {
            snake.direction = snake.directionNum.down;
        }

    }
    this.start();
}
Game.prototype.start = function () {
    this.timer = setInterval(function () {
        snake.getNextPos();
    }, 200);
}
//游戏结束
Game.prototype.over = function () {
    clearInterval(this.timer);
    alert('你的得分为:' + this.score);
    
    // 重置游戏
    let snakeWrap = document.querySelector('.snakeWrap');
    snakeWrap.innerHTML  = '';

    snake = new Snake();
    game = new Game();

    let startBtnWarp = document.querySelector('.startbtn');
    startBtnWarp.style.display = 'block';
}
//开始游戏
game = new Game();
let startBtn = document.querySelector('.startbtn');
startBtn.onclick = function () {
    startBtn.style.display = 'none';
    game.init();
};

