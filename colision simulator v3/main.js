//variables here

let update_game_time = 1000 / 60;
let max_size = 100;
let max_quantity = 2;
let my_circle_radius = 20;
let max_speed = 12;
let circles = [];
let squares = [];
let light_sources = [];
let copy = [];
let new_list = [];
let lines_toggle = false;
let square_toggle = false;
let circle_toggle = false;
let background_color = "#d87093";


//switches

let state_draw_lines = false;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
window.addEventListener("mousemove", setMousePosition, true);
window.addEventListener("resize", resizeing, true);

canvas.width = innerWidth - 350; // -400
canvas.height = innerHeight - 50; // -100

let mouseX = Math.floor(canvas.width / 2);
let mouseY = Math.floor(canvas.height / 2);

let random_x = Math.floor(Math.random() * canvas.width) + 1;
let random_y = Math.floor(Math.random() * canvas.height) + 1;
let random_radius = Math.floor(Math.random() * max_size) + 1;
let random_speed = Math.floor(Math.random() * max_speed) + 1;

//testes

let $color_picker = document.getElementById('color_value');
let $div_table = document.querySelector('.table');

//manipulação de variavel aqui

$div_table.style.height = canvas.height + "px";
//$color_picker.style.height = $div_table - ($div_table * 0.35) + "px";
$color_picker.value = background_color;


let $reset_background = document.getElementById("reset_background").addEventListener('click', () => {
	$color_picker.value = background_color;
});

function resizeing(event) {
	canvas.width = innerWidth - 400;
	canvas.height = innerHeight - 100;
	$div_table.style.height = canvas.height + "px";
}

function setMousePosition(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

//classes

class object_contructor {
	constructor(type, x, y, speed, color = "black", radius = null, width = null, height = null) {
		this.type = type;
		this.light_souce = false;

		this.x = x;
		this.y = y;

		this.color = color;
		this.grd = this.color;

		this.speed = speed;
		this.text = 0;
		this.dx = 2 * this.speed;
		this.dy = this.speed;

		this.linew_width = 3;
		this.shadow_color = "black";
		this.shadow_blur = 20;
		this.outline = false;

		//this.image_path = "792632.png";

		if (this.type === "square") {
			this.width = width;
			this.height = height;
			this.mass = ((this.width * this.height) * 0.01) * 0.12;

			this.centerX = this.x + this.width * 0.5;
			this.centerY = this.y + this.height * 0.5;

		} else if (this.type == "circle") {
			this.radius = radius;
			this.mass = ((this.radius * (Math.PI ** 2)) * 0.01) * 0.12;

			this.centerX = this.x;
			this.centerY = this.y;
		}

		//this.speed = this.speed * this.mass
	}

	get bottom() { return this.y + this.height }
	get left() { return this.x }
	get right() { return this.x + this.width }
	get top() { return this.y }

	random_color() {
		let letters = "0123456789ABCDEF";
		let color = "#";
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		this.color = color;
	}

	draw(ctx) {
		ctx.shadowBlur = this.shadow_blur;
		ctx.lineWidth = this.linew_width;

		this.light_souce === true ? ctx.shadowColor = this.color : ctx.shadowColor = this.shadow_color;



		switch (this.type) {
			case "square":
				ctx.beginPath();

				if (this.light_souce === false) {

					if (light_sources.length > 0) {

						light_sources.forEach(element => {
							this.grd = ctx.createRadialGradient(element.x, element.y, element.radius * element.mass, element.x, element.y, canvas.width);

							this.grd.addColorStop(0, "white")
							this.grd.addColorStop(0.05, element.color);
							this.grd.addColorStop(0.15, this.color);
							this.grd.addColorStop(0.5, "black");
							this.grd.addColorStop(1, "black");

							element.x > this.x + this.width ? ctx.shadowOffsetX = - 20 : ctx.shadowOffsetX = 20;
							element.y > this.y + this.height ? ctx.shadowOffsetY = - 20 : ctx.shadowOffsetY = 20;

						});
					} else { this.grd = this.color }

				} else { this.grd = this.color }
				//ctx.fillStyle = this.color

				ctx.fillStyle = this.grd;
				ctx.fillRect(this.x, this.y, this.width, this.height);

				if (this.outline === true) {
					ctx.strokeStyle = this.color;
					ctx.rect(this.x, this.y, this.width, this.height);
					ctx.stroke();
					//ctx.fill();
				}
				ctx.closePath();
				break;

			case "circle":
				ctx.beginPath();

				if (this.light_souce === false) {

					if (light_sources.length > 0) {

						light_sources.forEach(element => {
							this.grd = ctx.createRadialGradient(element.x, element.y, element.radius * element.mass, element.x, element.y, canvas.width * 0.5);

							this.grd.addColorStop(0, "white")
							this.grd.addColorStop(0.15, element.color);
							this.grd.addColorStop(0.5, this.color);
							this.grd.addColorStop(1, "black");

							element.x > this.x + this.radius ? ctx.shadowOffsetX = - 20 : ctx.shadowOffsetX = 20;
							element.y > this.y + this.radius ? ctx.shadowOffsetY = - 20 : ctx.shadowOffsetY = 20;

						});
					} else { this.grd = this.color }

				} else { this.grd = this.color }

				ctx.fillStyle = this.grd;
				ctx.strokeStyle = this.color;

				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font = Math.floor(this.radius * 0.5) + "px" + " Arial";
				ctx.fillText(this.text, this.x, this.y);

				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
				ctx.fillStyle = this.grd;

				if (this.outline === true) {			
					ctx.stroke();
					ctx.fill();
				} else {
					//ctx.stroke();
					ctx.fill();
				}
				ctx.closePath();
				break;
		}
	}

	create_image(ctx) {
		let myImage = document.createElement("img");
		myImage.src = this.image_path;
		myImage.width = this.width;
		myImage.height = this.height;
		myImage.onload = function () {
			ctx.drawImage(myImage, this.x, this.y, this.width, this.height);
		};
	}

	update() {
		this.draw(ctx);

		switch (this.type) {
			case "square":
				if (this.x <= 0) {
					(this.x = 1), (this.dx = -this.dx);
				}
				if (this.y <= 0) {
					(this.y = 1), (this.dy = -this.dy);
				}
				if (this.x + this.width >= canvas.width) {
					(this.x = canvas.width - this.width - 1), (this.dx = -this.dx);
				}
				if (this.y + this.height >= canvas.height) {
					(this.y = canvas.height - this.height - 1), (this.dy = -this.dy);
				}

				this.centerX = this.x + this.width * 0.5;
				this.centerY = this.y + this.height * 0.5;

				//this.create_image(ctx);

				break;

			case "circle":
				if (this.x - this.radius <= 0) {
					(this.dx = this.speed), (this.x = 1 + this.radius);
				}
				if (this.y - this.radius <= 0) {
					(this.dy = this.speed), (this.y = 1 + this.radius);
				}
				if (this.x + this.radius >= canvas.width) {
					(this.dx = -this.speed), (this.x = canvas.width - this.radius - 1);
				}
				if (this.y + this.radius >= canvas.height) {
					(this.dy = -this.speed), (this.y = canvas.height - this.radius - 1);
				}

				this.centerX = this.x;
				this.centerY = this.y;

		}

		this.x += this.dx;
		this.y += this.dy;
	}

	draw_line(object_or_array) {
		object_or_array.forEach((element) => {
			ctx.beginPath();
			ctx.moveTo(this.centerX, this.centerY);
			ctx.lineTo(element.centerX, element.centerY);
			ctx.lineWidth = 3;
			ctx.strokeStyle = this.color;
			ctx.stroke();
		});
	}

	square_square_colision(obj2) {
		if (
			this.x + this.width >= obj2.x &&
			this.x <= obj2.x + obj2.width &&
			this.y + this.height >= obj2.y &&
			this.y <= obj2.y + obj2.height
		) {
			return true;
		} else {
			return false;
		}
	}

	circle_rectangle_colision(circle) {
		if (
			this.x + this.width >= circle.x - circle.radius &&
			this.x <= circle.x + circle.radius &&
			this.y + this.height >= circle.y - circle.radius &&
			this.y <= circle.y + circle.radius
		) {
			return true;
		} else {
			return false;
		}
	}

	circle_colision(circle) {
		let distanceX = circle.x - this.x;
		let distanceY = circle.y - this.y;
		let radius_distance = this.radius + circle.radius;

		if (
			radius_distance * radius_distance >=
			distanceX * distanceX + distanceY * distanceY
		) {
			return true;
		} else {
			return false;
		}
	}

	boundaring_distance(element) {
		let varx = element.x, vary = element.y;

		if (element.x < this.x) {
			varx = this.x;
		}

		if (element.y < this.y) {
			varx = this.y;
		}

		if (element.x > this.x + this.width) {
			varx = this.x + this.width;
		}

		if (element.y > this.y + this.height) {
			vary = this.y + this.height;
		}

		return [varx, vary];
	}



	square_response(values) {
		//colision_response_with_squares

		values.forEach((element) => {
			if (this.x == element.x && element.y == this.y) {
				return;
			} else {
				if (this.square_square_colision(element)) {
					// if you add a "!" to the beggining of the if, will make them just stop

					let vector_x = this.centerX - element.centerX;
					let vector_y = this.centerY - element.centerY;

					if (vector_y * vector_y > vector_x * vector_x) {
						if (vector_y > 0) {
							this.y = element.bottom;
							element.dy = -element.dy;
						} else {
							this.y = element.y - this.height;
							element.dy = -element.dy;
						}
					} else {
						if (vector_x > 0) {
							this.x = element.right;
							element.dx = -element.dx;
						} else {
							this.x = element.x - this.width;
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
		circles.forEach((element) => {
			switch (this.type) {
				case "square":
					if (this.circle_rectangle_colision(element)) {
						let vectorX = this.centerX - element.x;
						let vectorY = this.centerY - element.y;
						let square_radius = 0;

						let varx = 0;
						let vary = 0;

						if (element.x <= this.x) {
							varx = this.x;
						}
						if (element.x >= this.x + this.width) {
							varx = this.x + this.width;
						} else {
							varx = element.x;
						}

						if (element.y <= this.y) {
							varx = this.y;
						}
						if (element.y >= this.y + this.height) {
							vary = this.y + this.height;
						} else {
							vary = element.y;
						}

						square_radius = Math.sqrt(
							(this.centerX - varx) * (this.centerX - varx) +
							(this.centerY - vary) * (this.centerY - vary)
						);

						let radius_distance = square_radius + element.radius;
						let distance =
							radius_distance -
							Math.sqrt(vectorX * vectorX + vectorY * vectorY);

						if (vectorY * vectorY > vectorX * vectorX) {
							if (vectorY > 0) {
								//this.y += distance;
								element.y = this.top - element.radius - 1;
								this.dy = -this.dy;
								element.dy = -element.dy;

							} else {
								//this.y -= distance;
								element.y = this.bottom + element.radius + 1;
								this.dy = -this.dy;
								element.dy = -element.dy;

							}
						} else {
							if (vectorX > 0) {
								element.x = this.left - element.radius - 1;
								//this.x += distance;
								this.dx = -this.dx;
								element.dx = -element.dx;

							} else {
								//this.x -= distance;
								element.x = this.right + element.radius + 1;
								this.dx = -this.dx;
								element.dx = -element.dx;

							}
						}
					}

					//if (vectorX == 0 && vector_y == 0) { element.x = this.right + element.radius }
					break;

				case "circles":
					if (this.circle_rectangle_colision(element)) {
						let vectorX = this.centerX - element.x;
						let vectorY = this.centerY - element.y;
						let square_radius = 0;

						let varx = 0;
						let vary = 0;

						if (element.x <= this.x) {
							varx = this.x;
						}
						if (element.x >= this.x + this.width) {
							varx = this.x + this.width;
						} else {
							varx = element.x;
						}

						if (element.y <= this.y) {
							varx = this.y;
						}
						if (element.y >= this.y + this.height) {
							vary = this.y + this.height;
						} else {
							vary = element.y;
						}

						square_radius = Math.sqrt(
							(this.centerX - varx) * (this.centerX - varx) +
							(this.centerY - vary) * (this.centerY - vary)
						);

						let radius_distance = square_radius + element.radius;
						let distance =
							radius_distance -
							Math.sqrt(vectorX * vectorX + vectorY * vectorY);

						if (vectorY * vectorY > vectorX * vectorX) {
							if (vectorY > 0) {
								//this.y += distance;
								element.y = this.top - element.radius - 1;
								this.dy = -this.dy;
								element.dy = -element.dy;

							} else {
								//this.y -= distance;
								element.y = this.bottom + element.radius + 1;
								this.dy = -this.dy;
								element.dy = -element.dy;

							}
						} else {
							if (vectorX > 0) {
								element.x = this.left - element.radius - 1;
								//this.x += distance;
								this.dx = -this.dx;
								element.dx = -element.dx;

							} else {
								//this.x -= distance;
								element.x = this.right + element.radius + 1;
								this.dx = -this.dx;
								element.dx = -element.dx;

							}
						}

						//if (vectorX == 0 && vector_y == 0) { element.x = this.right + element.radius }
						break;
					}
			}
		});
	}

	circle_response(list) {
		list.forEach((element) => {
			if (element.x == this.x && element.y == this.y) {
				return;
			} else {

				if (this.circle_colision(element)) {

					let distanceX = this.x - element.x;
					let distanceY = this.y - element.y;

					let radius_distance = this.radius + element.radius;
					let distance =
						radius_distance -
						Math.sqrt(distanceX * distanceX + distanceY * distanceY);

					if (distanceY * distanceY > distanceX * distanceX) {
						if (distanceY > 0) {
							this.y += distance;
							//this.dy = -this.dy;
							element.dy = -element.dy;
						} else {
							this.y -= distance;
							//this.dy = -this.dy;
							element.dy = -element.dy;
						}
					} else {
						if (distanceX < 0) {
							this.x -= distance;
							//this.dx = -this.dx;
							element.dx = -element.dx;
						} else {
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

change_toggle_all = () => { return lines_toggle = !lines_toggle }
change_toggle_square = () => { return square_toggle = !square_toggle }
change_toggle_circle = () => { return circle_toggle = !circle_toggle }

let $all_line = document.getElementById("show_all_line").addEventListener('click', change_toggle_all);
let $square_line = document.getElementById("show_square_line").addEventListener('click', change_toggle_square);
let $circle_line = document.getElementById("show_circle_line").addEventListener('click', change_toggle_circle);

let $creat_light = document.getElementById("create_light");

let $create_circle = document.getElementById("create_circle");
$create_circle.onclick = () => {
	let random_x = Math.floor(Math.random() * canvas.width) + 1;
	let random_y = Math.floor(Math.random() * canvas.height) + 1;
	let random_radius = Math.floor(Math.random() * max_size) + 1;
	if (random_radius < 20) { random_radius = 20 }
	let random_speed = Math.floor(Math.random() * max_speed) + 1;

	let random_circle = new object_contructor("circle", random_x, random_y, random_speed, "purple", random_radius);
	random_circle.random_color();
	circles.push(random_circle);
};

$creat_light.onclick = () => {
	let random_x = Math.floor(Math.random() * canvas.width) + 1;
	let random_y = Math.floor(Math.random() * canvas.height) + 1;
	let random_radius = Math.floor(Math.random() * max_size) + 1;
	if (random_radius < 20) { random_radius = 20 }
	let random_speed = Math.floor(Math.random() * max_speed) + 1;

	let random_circle = new object_contructor("circle", random_x, random_y, random_speed, "purple", random_radius);
	random_circle.random_color();
	random_circle.light_souce = true;
	light_sources.push(random_circle);
};



let $create_square = document.getElementById("create_square");
$create_square.onclick = function () {
	let random_x = Math.floor(Math.random() * canvas.width) + 1;
	let random_y = Math.floor(Math.random() * canvas.height) + 1;

	let random_width = Math.floor(Math.random() * max_size) + 1;
	if (random_width < 20) { random_width = 20; }

	let random_height = Math.floor(Math.random() * max_size) + 1;
	if (random_height < 20) { random_height = 20 }

	let random_speed = Math.floor(Math.random() * max_speed) + 1;

	let random_square = new object_contructor("square", random_x, random_y, random_speed, "black", null, random_width, random_height);
	random_square.random_color();
	squares.push(random_square);
};

let $delete_square = document.getElementById("delete_square");
$delete_square.onclick = function () { squares.pop() };

let $delete_circle = document.getElementById("delete_circle");
$delete_circle.onclick = function () { circles.pop() };

let $delete_light = document.getElementById("delete_light").onclick = () => {
	light_sources.pop()
}

let $stop = document.getElementById("stop").addEventListener('click', stop_movement);
let $start = document.getElementById("start").addEventListener('click', start_movement);

//controlables

let my_square = new object_contructor("square", 0, 0, Math.floor(Math.random() * max_speed) + 1, "black", null, 100, 100);
let my_circle = new object_contructor("circle", 0, 0, Math.floor(Math.random() * max_speed) + 1, "black", my_circle_radius);
let my_light = new object_contructor("circle", mouseX, mouseY, 0, "white", 20)


//functions here
//functions to set up figure and mouse movement

function update_my_circle(element) {
	element.update();

	my_light = new object_contructor("circle", mouseX, mouseY, 0, "white", 30);
	my_light.light_souce = true;
	light_sources[0] = my_light;
	update_position(element);
}

function update_my_square() {
	my_square.update();
	//my_square = new object_contructor(mouseX, mouseY, 80, 80, 0);
	update_position_square(my_square);
}

function update_position_square(square) {
	if (square.x <= 0) { (square.x = 1), (square.dx = -square.dx); }
	if (square.y <= 0) { (square.y = 1), (square.dy = -square.dy); }

	if (square.x + square.width >= canvas.width) {
		(square.x = canvas.width - square.width - 1), (square.dx = -square.dx);
	}
	if (square.y + square.height >= canvas.height) {
		(square.y = canvas.height - square.height - 1), (square.dy = -square.dy);
	}
}

function update_position(circle) {
	//stop the movement
	if (circle.x - circle.radius <= 0) { (circle.x = circle.radius + 1) }
	if (circle.y - circle.radius <= 0) { (circle.y = circle.radius + 1) }
	if (circle.x + circle.radius >= canvas.width) { (circle.x = canvas.width - circle.radius - 1) }
	if (circle.y + circle.radius >= canvas.height) { (circle.y = canvas.height - circle.radius - 1) }
}

function clear() {
	if (squares.length != 0 || circles.length != 0 || light_sources.length != 0) {
		let size1 = circles.length;
		let size2 = squares.length;
		let size3 = light_sources.length
		for (var i = 0; i < Math.max(size1, size2, size3) + 1; i++) {
			circles.pop();
			squares.pop();
			light_sources.pop();
		}
	} else { return }
}

function draw_lines(list) {
	for (element of list) {
		element.draw_line(list);
	};
}



function stop_movement() {
	for (square of squares) {
		square.dx = square.dy = 0;
	} for (circle of circles) {
		circle.dx = circle.dy = 0;
	} for (circle of light_sources) {
		circle.dx = circle.dy = 0;
	}
}

function start_movement() {
	let len1 = circles.length
	let len2 = squares.length
	let len3 = light_sources.length
	for (element of circles) {
		let random_speed = Math.floor(Math.random() * max_speed) + 1
		element.dx = element.dy = random_speed
	}
	for (element of squares) {
		let random_speed = Math.floor(Math.random() * max_speed) + 1
		element.dx = element.dy = random_speed
	}
	for (element of light_sources) {
		let random_speed = Math.floor(Math.random() * max_speed) + 1
		element.dx = element.dy = random_speed
	}
}



//not working yet

let $create_my_circle = document.getElementById("create_my_circle");
let $crete_my_square = document.getElementById("create_my_square");
let $create_my_light = document.getElementById('create_my_light');
let $show_outline = document.getElementById("show_outline").onclick = () => {
	circles.forEach(i => {
		i.outline = !i.outline
	});
	squares.forEach(i => {
		i.outline = !i.outline
	});
}

let $clear_canvas = document.getElementById("clear_all");

$crete_my_square.onclick = function () {
	let my_square = new object_contructor("square", mouseX, mouseY, random_speed, "black", 0, 80, 80);
	my_square.random_color();
	squares.push(my_square);
};

$create_my_circle.onclick = function () {
	let my_circle = new object_contructor("circle", mouseX, mouseY, random_speed, "black", my_circle_radius);
	my_circle.random_color();
	circles.push(my_circle);
};

$create_my_light.onclick = function () {
	let my_circle = new object_contructor("circle", mouseX, mouseY, 0, "white", 30);
	my_light.light_souce = true;
	light_sources.push(my_circle);
};

function game() {

	canvas.style.background = $color_picker.value;


	//update_my_circle(my_light);

	light_sources.forEach((element) => {

		let grd = ctx.createRadialGradient(element.x, element.y, element.radius * element.mass, element.x, element.y, canvas.width * 0.5);

		grd.addColorStop(0, element.color);
		grd.addColorStop(0.3, $color_picker.value);
		grd.addColorStop(0.85, $color_picker.value);
		grd.addColorStop(1, "black");

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		element.circle_response(light_sources);
		element.circle_response(circles);
		element.update();
		//element.random_color();
	});

	my_circle.circle_square_response(squares);
	my_circle.circle_response(circles);

	let new_list = squares.concat(circles);
	//draw_lines(new_list)

	if (lines_toggle === true) { draw_lines(new_list) }
	if (circle_toggle === true) { draw_lines(circles) }
	if (square_toggle === true) { draw_lines(squares) }


	$clear_canvas.onclick = () => { clear() };


	squares.forEach((element) => {

		element.square_response(squares);
		element.circle_square_response(circles);
		element.circle_square_response(light_sources);
		element.update();
		//element.random_color();
	});

	circles.forEach((element) => {

		element.circle_response(circles);
		element.circle_response(light_sources);
		element.update();
		//element.random_color();
	});


}

let update_frame = function () {
	requestAnimationFrame(update_frame);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	game();
};

update_frame();