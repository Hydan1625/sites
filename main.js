//variables here

let update_game_time = 1000 / 60;
let max_size = 100;
let max_quantity = 2;
let my_circle_radius = 20;
let max_speed = 12;
let circles = [];
let squares = [];
let copy = [];

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
window.addEventListener('mousemove', setMousePosition, true);
window.addEventListener('resize', resizeing, true);

canvas.width = innerWidth - 400;
canvas.height = innerHeight - 100;

let mouseX = Math.floor(canvas.width / 2);
let mouseY = Math.floor(canvas.height / 2);

let random_x = Math.floor(Math.random() * canvas.width) + 1;
let random_y = Math.floor(Math.random() * canvas.height) + 1;
let random_radius = Math.floor(Math.random() * max_size) + 1;
let random_speed = Math.floor(Math.random() * max_speed) + 1;



function resizeing(event) {
    canvas.width = innerWidth - 400;
    canvas.height = innerHeight - 100;
}

function setMousePosition(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}




//classes

class object_contructor {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        this.dx = 2 * this.speed;
        this.dy = this.speed;

        this.centerX = this.x + (this.width * 0.5);
        this.centerY = this.y + (this.height * 0.5);

    }

    get bottom() { return this.y + this.height; };
    get left() { return this.x; };
    get right() { return this.x + this.width; };
    get top() { return this.y; };


    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        //ctx.fill();
    }

    update() {

        this.draw(ctx);

        if (this.x <= 0) { this.x = 1, this.dx = -this.dx }
        if (this.y <= 0) { this.y = 1, this.dy = -this.dy }
        if (this.x + this.width >= canvas.width) { this.x = canvas.width - this.width - 1, this.dx = -this.dx }
        if (this.y + this.height >= canvas.height) { this.y = canvas.height - this.height - 1, this.dy = -this.dy }

        this.x += this.dx;
        this.y += this.dy;

        this.centerX = this.x + (this.width * 0.5);
        this.centerY = this.y + (this.height * 0.5);


    }

    draw_line(object_or_array) {

        object_or_array.forEach(element => {
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.lineTo(element.centerX, element.centerY);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#fffffff";
            ctx.stroke();
        });
    }



    square_square_colision(obj2) {

        if (this.x + this.width >= obj2.x &&
            this.x <= obj2.x + obj2.width &&
            this.y + this.height >= obj2.y &&
            this.y <= obj2.y + obj2.height
        ) { return true }

        else { return false }
    }

    circle_rectangle_colision(circle) {
        if (this.x + this.width >= circle.x - circle.radius &&
            this.x <= circle.x + circle.radius &&
            this.y + this.height >= circle.y - circle.radius &&
            this.y <= circle.y + circle.radius
        ) { return true }

        else { return false }
    }

    circle_rectangle_colision(circle) {
        if (this.x + this.width >= circle.x - circle.radius &&
            this.x <= circle.x + circle.radius &&
            this.y + this.height >= circle.y - circle.radius &&
            this.y <= circle.y + circle.radius
        ) { return true }

        else { return false }
    }


    square_response(values) {
        //colision_response_with_squares

        values.forEach(element => {

            if (this.x == element.x && element.y == this.y) { return }

            else {
                if (this.square_square_colision(element)) { // if you add a "!" to the beggining of the if, will make them just stop

                    let vector_x = this.centerX - element.centerX;
                    let vector_y = this.centerY - element.centerY;

                    if (vector_y * vector_y > vector_x * vector_x) {

                        if (vector_y > 0) {
                            this.y = element.bottom;
                            element.dy = -element.dy;
                        } else {
                            this.y = element.y - this.height
                            element.dy = -element.dy;
                        }
                    } else {
                        if (vector_x > 0) {
                            this.x = element.right;
                            element.dx = -element.dx;
                        } else {
                            this.x = element.x - this.width
                            element.dx = -element.dx;
                        }
                    }

                    //this.dx = element.dx = this.dy = element.dy = 0;
                }

            }

            //this.update();
            //element.update();

        });
    }



    circle_square_response(circles) {

        circles.forEach(element => {

            if (this.circle_rectangle_colision(element)) {

                let vectorX = this.centerX - element.x;
                let vectorY = this.centerY - element.y;
                let square_radius = 0;

                let varx = 0;
                let vary = 0;

                if (element.x <= this.x) { varx = this.x }
                if (element.x >= this.x + this.width) { varx = this.x + this.width }
                else { varx = element.x }

                if (element.y <= this.y) { varx = this.y }
                if (element.y >= this.y + this.height) { vary = this.y + this.height }
                else { vary = element.y }


                square_radius = Math.sqrt((this.centerX - varx) * (this.centerX - varx) + (this.centerY - vary) * (this.centerY - vary));

                let radius_distance = square_radius + element.radius;
                let distance = radius_distance - Math.sqrt(vectorX * vectorX + vectorY * vectorY);

                if (vectorY * vectorY > vectorX * vectorX) {

                    if (vectorY > 0) {
                        //this.y += distance;
                        element.y = this.top - element.radius - 1
                        this.dy = -this.dy;
                        element.dy = -element.dy;
                    }

                    else {
                        //this.y -= distance;
                        element.y = this.bottom + element.radius + 1
                        this.dy = -this.dy;
                        element.dy = -element.dy;
                    }
                }

                else {

                    if (vectorX > 0) {
                        
                        element.x = this.left - element.radius - 1
                        //this.x += distance;
                        this.dx = -this.dx;
                        element.dx = -element.dx;
                    }

                    else {
                        //this.x -= distance;
                        element.x = this.right + element.radius + 1
                        this.dx = -this.dx;
                        element.dx = -element.dx;
                    }
                }
            }
        });
    }
}





class Circle extends object_contructor {
    constructor(x, y, radius, color, text, speed) {
        super(x, y, speed);

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color
        this.text = text;
        this.speed = speed;

        this.dx = 2 * speed;
        this.dy = speed;
        this.hitCount = 0;

        this.centerX = this.x;
        this.centerY = this.y;

    }

    draw(ctx) {
        ctx.beginPath();

        ctx.fillStyle = "black";
        ctx.strokeStyle = this.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = Math.floor(this.radius * 0.5) + "px" + " Arial";
        ctx.fillText(this.text, this.x, this.y);

        ctx.lineWidth = 5;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
    }

    update() {

        this.draw(ctx);

        this.text = this.hitCount;

        if (this.x - this.radius <= 0) { this.dx = this.speed, this.x = 1 + this.radius, this.hitCount++ }
        if (this.y - this.radius <= 0) { this.dy = this.speed, this.y = 1 + this.radius, this.hitCount++ }
        if (this.x + this.radius >= canvas.width) { this.dx = -this.speed, this.x = canvas.width - this.radius - 1, this.hitCount++ }
        if (this.y + this.radius >= canvas.height) { this.dy = -this.speed, this.y = canvas.height - this.radius - 1, this.hitCount++ }

        this.x += this.dx;
        this.y += this.dy;

        this.centerX = this.x;
        this.centerY = this.y;

    }

    circle_rectangle_colision(square) {
        if (square.x + square.width >= this.x - this.radius &&
            square.x <= this.x + this.radius &&
            square.y + square.height >= this.y - this.radius &&
            square.y <= this.y + this.radius
        ) { return true }

        else { return false }
    }




    draw_line(object_or_array) {

        object_or_array.forEach(element => {
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.lineTo(element.centerX, element.centerY);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#fffffff";
            ctx.stroke();
        });
    }


    circle_colision(circle) {

        let distanceX = (circle.x - this.x);
        let distanceY = (circle.y - this.y);
        let radius_distance = this.radius + circle.radius;

        if (radius_distance * radius_distance >=
            distanceX * distanceX + distanceY * distanceY) { return true }

        else { return false }
    }

    invert_velocities(circle) {

        if (this.circle_colision(circle)) {

            this.dx = -this.dx
            circle.dx = -circle.dx

            this.dy = -this.dy
            circle.dy = -circle.dy

        }

        this.update();
        circle.update();
    }


    circle_square_response(figure1) {

        figure1.forEach(element => {

            if (this.circle_rectangle_colision(element)) {

                let vectorX = element.centerX - this.x;
                let vectorY = element.centerY - this.y;
                let distance = Math.sqrt(vectorX * vectorX + vectorY * vectorY);

                //start
                //for bouncing of the thing
                let distancex = distance;
                let distancey = distance;
                let minx = element.width * 0.5
                let miny = element.height * 0.5


                if (distance < minx) { distancex = minx; }

                if (distance < miny) { distancey = miny; }

                if (vectorY * vectorY > vectorX * vectorX) {

                    if (vectorY > 0) { //baixo pra cima

                        this.y -= (distancey - (element.centerY - element.y));

                        if (this.y + this.radius >= element.y) {

                            this.y = element.y - this.radius

                        }

                        this.dy = -this.dy;

                    } else { //cima pra baixo

                        this.y += (distancey - (element.centerY - element.y));

                        if (this.y - this.radius <= element.y + element.height) {

                            this.y = element.y + element.height + this.radius

                        }
                        this.dy = -this.dy;
                    }

                } else {

                    if (vectorX > 0) { //esquerda pra direita

                        this.x -= (distancex - (element.centerX - element.x));

                        if (this.x + this.radius >= element.x) {
                            this.x = element.x - this.radius
                        }

                        this.dx = -this.dx;

                    } else { //direita pra esquerda

                        this.x += (distancex - (element.centerX - element.x));

                        if (this.x - this.radius <= element.x + element.width) {

                            this.x = element.x + element.width + this.radius

                        }

                        this.dx = -this.dx;

                    }
                }

                //for bouncing the colinding object around

                /*if (vectorY * vectorY > vectorX * vectorX) {
                    if (vectorY > 0) { figure1.dy += distance; }

                    else { figure1.dy -= distance; }
                } 
                
                else {

                    if (vectorX > 0) { figure1.dx += distance; } 
                    
                    else { figure1.dx -= distance; }

                }*/

                //figure1.dx = this.dx = figure1.dy = this.dy = 0

            }
        });
    }

    circle_response(circles) {

        circles.forEach(element => {

            if (element.x == this.x && element.y == this.y) { return }

            else {

                let distanceX = this.x - element.x;
                let distanceY = this.y - element.y;

                if (this.circle_colision(element)) {

                    let radius_distance = this.radius + element.radius;
                    let distance = radius_distance - Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                    if (distanceY * distanceY > distanceX * distanceX) {

                        if (distanceY > 0) {
                            this.y += distance;
                            //this.dy = -this.dy;
                            element.dy = -element.dy;
                        }

                        else {
                            this.y -= distance;
                            //this.dy = -this.dy;
                            element.dy = -element.dy;
                        }
                    }

                    else {

                        if (distanceX < 0) {
                            this.x -= distance;
                            //this.dx = -this.dx;
                            element.dx = -element.dx;
                        }

                        else {
                            this.x += distance;
                            //this.dx = -this.dx;
                            element.dx = -element.dx;
                        }
                    }

                    if (distanceX == 0 && distanceY == 0) {
                        this.x += radius_distance;
                        this.y += radius_distance;
                    }

                    //this.dx = element.dx = this.dy = element.dy = 0

                }
            }
        });
    }
}



//classes objects
//buttons for creating stuff



let $create_circle = document.getElementById("create_circle");
$create_circle.onclick = function () {
    let random_x = Math.floor(Math.random() * canvas.width) + 1;
    let random_y = Math.floor(Math.random() * canvas.height) + 1;
    let random_radius = Math.floor(Math.random() * max_size) + 1;
    if (random_radius < 10) {
        random_radius = 10;
    }
    let random_speed = Math.floor(Math.random() * max_speed) + 1;

    let random_circle = new Circle(random_x, random_y, random_radius, "purple", 0, random_speed);
    circles.push(random_circle);
}


let $delete_circle = document.getElementById("delete_circle");
$delete_circle.onclick = function () { circles.pop() }


let $create_square = document.getElementById("create_square");
$create_square.onclick = function () {
    let random_x = Math.floor(Math.random() * canvas.width) + 1;
    let random_y = Math.floor(Math.random() * canvas.height) + 1;

    let random_width = Math.floor(Math.random() * max_size) + 1;
    if (random_width < 10) { random_width = 10 }
    let random_height = Math.floor(Math.random() * max_size) + 1;
    if (random_height < 10) { random_height = 10 }

    let random_speed = Math.floor(Math.random() * max_speed) + 1;

    let random_square = new object_contructor(random_x, random_y, random_width, random_height, random_speed);
    squares.push(random_square);
}

let $delete_square = document.getElementById("delete_square");

$delete_square.onclick = function () { squares.pop() }


let my_square = new object_contructor(0, 0, 200, 100, 0);
let my_circle = new Circle(0, 0, my_circle_radius, "black", 0, random_speed);

//functions here

//functions to set up figure and mouse movement

function update_my_circle() {
    my_circle.update();
    my_circle = new Circle(mouseX, mouseY, my_circle_radius, "black", 0, 0);
    update_position(my_circle);
}

function update_my_square() {
    my_square.update();
    my_square = new object_contructor(mouseX, mouseY, 100, 100, 0);
    update_position_square(my_square);
}

function update_position_square(square) {
    if (square.x <= 0) { square.x = 1, square.dx = -square.dx }
    if (square.y <= 0) { square.y = 1, square.dy = -square.dy }
    if (square.x + square.width >= canvas.width) { square.x = canvas.width - square.width - 1, square.dx = -square.dx }
    if (square.y + square.height >= canvas.height) { square.y = canvas.height - square.height - 1, square.dy = -square.dy }
}

function update_position(circle) {
    //stop the movement
    if (circle.x - circle.radius <= 0) { circle.x = circle.radius + 1, circle.hitCount++ }
    if (circle.y - circle.radius <= 0) { circle.y = circle.radius + 1, circle.hitCount++ }
    if (circle.x + circle.radius >= canvas.width) { circle.x = (canvas.width - circle.radius) - 1, circle.hitCount++ }
    if (circle.y + circle.radius >= canvas.height) { circle.y = (canvas.height - circle.radius) - 1, circle.hitCount++ }

}

function clear() {
    let copy = [circles, squares];
    let size1 = circles.length;
    let size2 = squares.length
    for (var i = 0; i < Math.max(size1, size2) + 1; i++) {
        circles.pop();
        squares.pop();
    }
    
    return copy;
}

function draw_lines(list) {
    list.forEach(element => {
        element.draw_line(list);
    })
}


//not working yet

let $square_line = document.getElementById("show_square_line");
let $circle_line = document.getElementById("show_circle_line");
let $all_line = document.getElementById("show_all_line");
let $create_my_circle = document.getElementById("create_my_circle");
let $crete_my_square = document.getElementById("create_my_square");

let $clear_canvas = document.getElementById("clear_all");
let $remake = document.getElementById("remake");




$crete_my_square.onclick = function () {
    let my_square = new object_contructor(mouseX, mouseY, 100, 100, random_speed);
    squares.push(my_square);
}

$create_my_circle.onclick = function () {
    let my_circle = new Circle(mouseX, mouseY, my_circle_radius, "black", 0, random_speed);
    circles.push(my_circle);
}


function game() {

    //update_my_square();
    update_my_circle();
    //my_square.circle_square_response(circles);
    //my_square.square_response(squares);
    my_circle.circle_square_response(squares);
    my_circle.circle_response(circles);
    //draw_lines(squares);
    //draw_lines(circles);
    let new_list = squares.concat(circles);
    draw_lines(new_list);

    //random_circle.update();

    $clear_canvas.onclick = function() { clear() }

    /*$remake.onclick = function () {
        let circles = copy[0];
        let squares = copy[1];
    }

    $square_line.onclick = function () {
        draw_lines(squares);
    }

    $circle_line.onclick =  function () {
        draw_lines(circles);
    }

    $all_line.onclick = function () {
        draw_lines(circles);
        draw_lines(squares);
    }*/

    squares.forEach(element => {
        element.square_response(squares);
        element.circle_square_response(circles);

        element.update();

        
    });

    circles.forEach(element => {
        element.circle_response(circles)

        element.update();

    });

}


let update_frame = function () {

    requestAnimationFrame(update_frame);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game();

}




//create_random_circles();
update_frame();