cava = {
    scr: document.createElement("canvas"),

    on: function() {
        this.scr.width = 0.8* window.innerWidth;
        this.scr.height = 0.8* window.innerHeight;
        this.scr.style = "border: 1px solid black; display: block; margin: 0 auto";
        this.frame = 0;

        this.h1 = document.createElement("h1");
        this.h1.innerText = "0";
        this.h1.style = "font-size: 4vh; text-align: center";

        document.body.append(this.h1, this.scr);

        this.timer = setInterval(update, 20)
    },

    off: () => {
        clearInterval(cava.timer);
        replay()
    }
}

var myObj;
otherObj = [];

function Rect(x, y, width, height, color = "MediumSeaGreen", border = false, borderColor = "black") {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.color = color;
    this.border = border;
    this.borderColor = borderColor;
    this.speedY = 0;

    this.draw = () => {
        let ctx = cava.scr.getContext("2d");
        if (this.border) {
            ctx.strokeStyle = this.borderColor;
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.stroke();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x + 1, this.y + 1, this.w - 2, this.h - 2)
        }
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.w, this.h)
        }
    }

    this.collision = (other) => {
        if (this.x < other.x + other.w && other.x < this.x + this.w && this.y < other.y + other.h && other.y < this.y + this.h)
            return true;
        return false
    }
}

random = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;

function mainScreen() {
    clrscr();

    let tit = document.createElement("h1");
    tit.innerText = "Bouncy Đaggy";
    tit.style = "font-size: 10vh; font-family: Comic Sans MS, Arial; text-align: center";

    let play = document.createElement("button");
    play.innerText = "Play";
    play.addEventListener("click", playScreen);

    let guide = document.createElement("button");
    guide.innerText = "How to play";
    guide.addEventListener("click", guideScreen);

    let rank = document.createElement("button");
    rank.innerText = "High score";
    rank.addEventListener("click", rankScreen);

    document.body.append(tit, play, guide, rank)
}

function playScreen() {
    clrscr();
    otherObj.splice(0);
    cava.on();
    myObj = new Rect(0.1* cava.scr.width, 0, cava.scr.height * 0.05, cava.scr.height * 0.05, "DeepSkyBlue")
}

function update() {
    let w = cava.scr.width;
    let h = cava.scr.height;
    let ctx = cava.scr.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    // ctx.beginPath();          Bật lên nếu vẽ hình có viền

    if (!(++cava.frame % 50)) {
        cava.h1.innerText = cava.frame / 50;
        let rand;
        if (cava.frame < 751) {
            rand = random(0, 2/3*h);
            otherObj.push(new Rect(w, 0, 0.01*w, rand));
            otherObj.push(new Rect(w, rand + 1/3*h, 0.01*w, 2/3*h - rand))
        }
        else if (cava.frame < 1501) {
            rand = random(0, 0.75*h);
            otherObj.push(new Rect(w, 0, 0.01*w, rand, "gold"));
            otherObj.push(new Rect(w, rand + 0.25*h, 0.01*w, 0.75*h - rand, "gold"))
        }
        else if (cava.frame < 2251) {
            rand = random(0, 0.8*h);
            otherObj.push(new Rect(w, 0, 0.01*w, rand, "red"));
            otherObj.push(new Rect(w, rand + 0.2*h, 0.01*w, 0.8*h - rand, "red"))
        }
        else if (cava.frame < 3001) {
            rand = random(0, 5/6*h);
            otherObj.push(new Rect(w, 0, 0.01*w, rand, "purple"));
            otherObj.push(new Rect(w, rand + 1/6*h, 0.01*w, 5/6*h - rand, "purple"))
        }
        else {
            rand = random(0, 6/7*h);
            otherObj.push(new Rect(w, 0, 0.01*w, rand, "black"));
            otherObj.push(new Rect(w, rand + 1/7*h, 0.01*w, 6/7*h - rand, "black"))
        }
    }

    myObj.speedY += h / 500;
    myObj.y += myObj.speedY;

    if (myObj.y < 0) {
        myObj.y = 0;
        myObj.speedY = -(myObj.speedY / 2)
    }
    else if (myObj.y > h - myObj.h) {
        myObj.y = h - myObj.h;
        myObj.speedY = -(myObj.speedY / 2)
    }
    myObj.draw();

    for (let i = 0; i < otherObj.length; i++) {
        if (otherObj[i].x > -(otherObj[i].w)) {
            otherObj[i].x -= 0.01*w;
            otherObj[i].draw();
            if (myObj.collision(otherObj[i]))
                cava.off()
        }
        else
            otherObj.splice(i--, 2)
    }
}

function replay() {
    let back = document.createElement("button");
    back.style = "width: 50%; font-size: 4vh; padding: 1vh; display: inline-block";
    back.innerText = "Back";
    back.addEventListener("click", mainScreen);

    let again = document.createElement("button");
    again.style = "width: 50%; font-size: 4vh; padding: 1vh; display: inline-block";
    again.innerText = "Replay";
    again.addEventListener("click", playScreen);

    document.body.append(back, again)
}

function guideScreen() {
    clrscr();
    document.body.innerHTML = "<p style='font: bold 5vh/1 Arial; text-align: center'>Click SPACEBAR to jump and dodge the column</p>";

    let back = document.createElement("button");
    back.style = "width: 50%; display: inline-block";
    back.innerText = "Back";
    back.addEventListener("click", mainScreen);

    let play = document.createElement("button");
    play.style = "width: 50%; display: inline-block";
    play.innerText = "Play";
    play.addEventListener("click", playScreen);

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
    if (key.which == 32)
        if (keyup) {
            myObj.speedY -= cava.scr.height / 33;
            keyup = false
        }
})
window.addEventListener("keyup", () => keyup = true)

window.addEventListener("touchstart", () => myObj.speedY -= cava.scr.height / 33)