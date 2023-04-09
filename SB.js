cava = {
    scr: document.createElement("canvas"),

    on: function() {
        this.scr.width = (window.innerWidth > window.innerHeight) ? 0.9* window.innerHeight : 0.9* window.innerWidth;
        this.scr.height = this.scr.width;
        this.scr.style = "border: 1px solid; display: block; margin: 0 auto";
        this.frame = 0;
        this.point = 0;

        document.body.appendChild(this.scr);
        this.interval = setInterval(update, 20)
    },

    off: function() {
        clearInterval(cava.interval);
        replay()
    }
}

var myObj, left, right;
var line;
myBullet = [];
otherObj = [];

function Rect(x, y, width, height, color = "MediumSeaGreen", hp = 1, border = false, borderColor = "black") {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.c = color;
    this.hp = hp;
    this.b = border;
    this.bC = borderColor;

    this.draw = function() {
        let ctx = cava.scr.getContext("2d");
        if (this.b) {
            ctx.strokeStyle = this.bC;
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.stroke();
            ctx.fillStyle = this.c;
            ctx.fillRect(this.x + 1, this.y + 1, this.w - 2, this.h - 2)
        }
        else {
            ctx.fillStyle = this.c;
            ctx.fillRect(this.x, this.y, this.w, this.h)
        }
    }

    this.collision = function(other) {
        if (this.x < other.x + other.w && other.x < this.x + this.w && this.y < other.y + other.h && other.y < this.y + this.h)
            return true;
        return false
    }

    this.destroy = function() {
        switch (--this.hp) {
            case 0 :
                return true;
            case 1 :
                this.c = "MediumSeaGreen";
                return false;
            case 2 :
                this.c = "gold";
                return false;
            case 3 :
                this.c = "red";
                return false;
            default :
                this.c = "purple";
                return false
        }
    }
}

random = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;

function mainScreen() {
    clrscr();

    let tit = document.createElement("h1");
    tit.innerText = "Shooting Block";
    tit.style = "font-size: 10vh; font-family: Comic Sans MS, Arial; text-align: center";

    let play = document.createElement("button");
    play.innerText = "Play";
    play.addEventListener("click", startGame);

    let guide = document.createElement("button");
    guide.innerText = "How to play";
    guide.addEventListener("click", guideScreen);

    let rank = document.createElement("button");
    rank.innerText = "High score";
    rank.addEventListener("click", rankScreen);

    let main = document.createElement("button");
    main.innerText = "Back to main page";
    main.setAttribute("onclick", "window.location.href='index.html'");

    document.body.append(tit, play, guide, rank, main)
}

function update() {
    let w = cava.scr.width;
    let h = cava.scr.height;
    let ctx = cava.scr.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    // ctx.beginPath();       Bật lên nếu vẽ hình có viền

    if (!(++cava.frame % 50)) {
        let rand;
        if (cava.frame < 501) {
            rand = random(0, 0.9*w);
            otherObj.push(new Rect(rand, -(h / 10), w / 10, h / 10))
        }
        else if (cava.frame < 1001) {
            rand = random(0, w * 14/15);
            otherObj.push(new Rect(rand, -(h / 15), w / 15, h / 15, "gold", 2))
        }
        else if (cava.frame < 1501) {
            rand = random(0, 0.95*w);
            otherObj.push(new Rect(rand, -(h / 20), w / 20, h / 20, "red", 3))
        }
        else if (cava.frame < 2001) {
            rand = random(0, 0.96*w);
            otherObj.push(new Rect(rand, -(h / 25), w / 25, h / 25, "purple", 4))
        }
        else {
            rand = random(0, w * 29/30);
            otherObj.push(new Rect(rand, -(h / 30), w / 30, h / 30, "black", 5))
        }
    }

    if (left)
        myObj.x -= w / 67;
    if (right)
        myObj.x += w / 67;

    if (myObj.x < 0)
        myObj.x = 0;
    else if (myObj.x > w - myObj.w)
        myObj.x = w - myObj.w;

    for (obj of otherObj) {
        obj.y += h / 300;
        obj.draw();
        if (obj.y + obj.h > line.y)
            cava.off()
    }

    for (let i = 0; i < myBullet.length; i++) {
        myBullet[i].y -= h / 30;
        if (myBullet[i].y < -(myBullet[i].h))
            myBullet.splice(i--, 1);
        else {
            myBullet[i].draw();
            for (let j = 0; j < otherObj.length; j++)
                if (otherObj[j].collision(myBullet[i])) {
                    myBullet.splice(i--, 1);
                    if (otherObj[j].destroy()) {
                        otherObj.splice(j, 1);
                        cava.point++
                    }
                    break
                }
        }
    }

    ctx.font = "3vh Arial";
    ctx.fillStyle = "black";
    ctx.fillText("SCORE : " + cava.point, 5, h - 5);

    line.draw();
    myObj.draw()
}

function startGame() {
    clrscr();
    otherObj.splice(0);
    myBullet.splice(0);
    cava.on();
    myObj = new Rect(cava.scr.width / 2, 0.92* cava.scr.height, cava.scr.width / 50, 0.08* cava.scr.height, "grey");
    line = new Rect(0, 0.9* cava.scr.height, cava.scr.width, cava.scr.width / 100);
    window.focus()
}

function replay() {
    let back = document.createElement("button");
    back.style = "width: 50%; font-size: 4vh; padding: 1vh; display: inline-block";
    back.innerText = "Back";
    back.addEventListener("click", mainScreen);

    let again = document.createElement("button");
    again.style = "width: 50%; font-size: 4vh; padding: 1vh; display: inline-block";
    again.innerText = "Replay";
    again.addEventListener("click", startGame);

    document.body.append(back, again)
}

function guideScreen() {
    clrscr();
    document.body.innerHTML = `<p style="font: bold 5vh/1.2 Arial">- Use arrow buttons to move left and right<br><br>- Click SPACEBAR to shoot</p>
    <p style="font: bold 4vh/1.1 Arial">- Block with different color has different hp :<br>+ Green: 1 hp<br>+ Yellow: 2 hp<br>+ Red: 3 hp<br>+ Purple: 4 hp<br>+ Black: 5 hp</p>`

    let back = document.createElement("button");
    back.style = "width: 50%; display: inline-block";
    back.innerText = "Back";
    back.addEventListener("click", mainScreen);

    let play = document.createElement("button");
    play.style = "width: 50%; display: inline-block";
    play.innerText = "Play";
    play.addEventListener("click", startGame);

    document.body.append(back, play)
}

function rankScreen() {
    clrscr();
    document.body.innerHTML = "<p style='font: bold 10vh/1 Arial; text-align: center'>Not ready yet</p>";

    let back = document.createElement("button");
    back.innerText = "Main Screen";
    back.addEventListener("click", mainScreen);

    document.body.append(back)
}

clrscr = () => document.body.textContent = "";

var keyup = true;

window.addEventListener("keydown", function(key) {
    switch (key.which) {
        case 32 :
            if (keyup) {
                myBullet.push(new Rect(myObj.x, myObj.y, myObj.w, myObj.w, "gold"));
                keyup = false
            }
            break;
        case 37 :
            left = true;
            break;
        case 39 :
            right = true;
            break
    }
})
window.addEventListener("keyup", function() {
    left = false;
    right = false;
    keyup = true
})