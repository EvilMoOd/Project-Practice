//sw，sh是单个方块参数，tr，td是网格参数
let [sw, sh, tr, td] = [20, 20, 30, 30];
let snake = null;

function Square(x, y, classname) {
    this.x = x * sw;
    this.y = y * sh;
    this.class = classname;

    this.viewContent = document.createElement("div");
    this.viewContent.className = this.class;
    this.parent = document.getElementsByClassName("snakeWrap")[0];
}
//创建方块
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
            y: 0
        },
        right: {
            x: +1,
            y: 0
        },
        up: {
            x: 0,
            y: -1
        },
        down: {
            x: 0,
            y: +1
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

    // 无事发生
    this.strategies.move.call(this)//调用move函数并将里面的this指向snake（原本指向snake.strategies）


}
Snake.prototype.strategies = {

    move: function () {
        let newBody = new Square(this.head.x / sw, this.head.y / sh, "snakeBody");

        newBody.next = this.head.next;
        newBody.next.last = newBody;
        newBody.last = null;

        this.head.remove()
        newBody.create();

        let newHead = (this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y, "snakeHead")
        newHead.next = newBody;
        newHead.last = null;
        newBody.last = newHead;
    },
    eat: function () {

    },
    die: function () {

    }
}


snake = new Snake();
snake.init();
snake.getNextPos();