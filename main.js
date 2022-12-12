//variables here

let update_game_time = 1000 / 60;
let max_size = 100; // 100
let max_quantity = 2;
let my_circle_radius = 20; // 20
let max_speed = 12;
let circles = [];
let squares = [];
let light_sources = [];
let copy = [];
let new_list = [];
let controled_object;

let background_color = "#d87093";

//switches

let state_draw_lines = false;
let lines_toggle = false;
let square_toggle = false;
let circle_toggle = false;

//canvas objects here

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = innerWidth - 350; // -400
canvas.height = innerHeight - 50; // -100

//mouse objects here

window.addEventListener("mousemove", setMousePosition, true);
window.addEventListener("resize", resizeing, true);

let mouseX = Math.floor(canvas.width / 2);
let mouseY = Math.floor(canvas.height / 2);

function resizeing(event) {
	canvas.width = innerWidth - 400;
	canvas.height = innerHeight - 100;
	$div_table.style.height = canvas.height + "px";
}

function setMousePosition(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}


//random values for objects contralable by the user

let random_x = Math.floor(Math.random() * canvas.width) + 1;
let random_y = Math.floor(Math.random() * canvas.height) + 1;
let random_radius = Math.floor(Math.random() * max_size) + 1;
let random_speed = Math.floor(Math.random() * max_speed) + 1;

//background customisation

let $color_picker = document.getElementById("color_value");
let $div_table = document.querySelector(".table");
$div_table.style.height = canvas.height + "px";
$color_picker.value = background_color;

let $reset_background = document.getElementById("reset_background");
$reset_background.onclick = () => {
	$color_picker.value = background_color;
};

//classes

class object_contructor {
	constructor(
		type,
		x,
		y,
		speed,
		color = "black",
		radius = null,
		width = null,
		height = null
	) {
		//type of object
		this.type = type;
		this.light_souce = false;
		this.enable_shadows = true;

		//speed and position atributes
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.text = 0; //0
		this.dx = 2 * this.speed;
		this.dy = this.speed;

		//miscelaneous
		this.color = color;
		this.grd = this.color;
		this.linew_width = 3; //3
		this.shadow_color = "black";
		this.shadow_blur = 20; //20
		this.outline = false; //false
		this.mouse_on_me = false;

		//this.image_path = "792632.png";

		//object constructor
		if (this.type === "square") {
			this.width = width;
			this.height = height;
			this.mass = this.width * this.height * 0.01; // + 0.12
			this.half_sizeW = this.width * 0.5;
			this.half_sizeH = this.height * 0.5;

			this.centerX = this.x + this.width * 0.5;
			this.centerY = this.y + this.height * 0.5;
			this.wall_absortion_force = 0.85;
			this.gravity_force = this.mass * 0.001;


		} else if (this.type == "circle") {
			this.radius = radius;
			this.mass = this.radius * Math.PI ** 2 * 0.01 * 0.12; // * 0.12
			this.light_constant = this.mass ** 2 * this.radius;
			this.half_size = this.radius * 0.5;

			this.centerX = this.x;
			this.centerY = this.y;
			// 0.6
			this.wall_absortion_force = 0.4; // 0.6 0.7 0.35
			this.gravity_force = this.mass * 0.05;
		}

		//this.speed = this.speed * this.mass

	}

	//defining boundaries for rectangle like objects
	get bottom() {
		return this.y + this.height;
	}
	get left() {
		return this.x;
	}
	get right() {
		return this.x + this.width;
	}
	get top() {
		return this.y;
	}

	//generator of random colors
	random_color() {
		let letters = "0123456789ABCDEF";
		let color = "#";
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		this.color = color;
	}

	//object drawer and shadow definer (needs to be refactor and change the shadow part)
	draw(ctx) {
		let element;

		if (this.enable_shadows === true) {
			if (this.light_souce === false) {

				ctx.shadowBlur = this.shadow_blur;
				ctx.lineWidth = this.linew_width;
				ctx.shadowColor = this.shadow_color;

			} else {
				ctx.shadowBlur = 100;
				ctx.lineWidth = this.linew_width;
				ctx.shadowColor = null;
			}
		}

		switch (this.type) {
			case "square":
				ctx.beginPath();

				if (this.light_souce === false) {
					if (light_sources.length > 0) {
						//light_sources.forEach(element => {
						element = light_sources[light_sources.length - 1];

						this.grd = ctx.createRadialGradient(
							element.x,
							element.y,
							element.radius * element.mass,
							element.x,
							element.y,
							canvas.width
						);
						//this.grd = ctx.createRadialGradient(element.x, element.y, element.radius * 0.5, element.x, element.y, element.light_constant * 2);

						this.grd.addColorStop(0, "white");
						this.grd.addColorStop(0.05, element.color);
						this.grd.addColorStop(0.15, this.color);
						this.grd.addColorStop(0.5, "black");
						this.grd.addColorStop(1, "black");

						if (this.display_shadow === true) {
							this.display_shadow(element);
						}

					} else {
						this.grd = this.color;
					}
				} else {
					this.grd = this.color;
				}

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
						//light_sources.forEach(element => {
						element = light_sources[light_sources.length - 1];

						this.grd = ctx.createRadialGradient(
							element.x,
							element.y,
							element.radius * element.mass,
							element.x,
							element.y,
							canvas.width * 0.5
						);

						//this.grd = ctx.createRadialGradient(element.x, element.y, element.radius, element.x, element.y, element.light_constant);

						this.grd.addColorStop(0, "white");
						this.grd.addColorStop(0.15, element.color);
						this.grd.addColorStop(0.5, this.color);
						this.grd.addColorStop(1, "black");

						if (this.enable_shadows === true) {
							this.display_shadow(element);
						}

					} else {
						this.grd = this.color;
					}
				} else {
					this.grd = this.color;
				}

				ctx.fillStyle = this.grd;
				ctx.strokeStyle = this.color;

				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font = `${Math.floor(this.radius * 0.5)}px Arial`;
				ctx.fillText(this.text, this.x, this.y);

				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
				ctx.fillStyle = this.grd;

				if (this.outline === true) {
					ctx.stroke();
				}

				//ctx.stroke();
				ctx.fill();
				ctx.closePath();
				break;
		}
	}

	display_shadow(element) {

		if (this.light_souce === true) {
			return
		}

		let distanceX = this.centerX - element.centerX;
		let distanceY = this.centerY - element.centerY;


		if (this.type === "square") {
			if (distanceY >= this.half_sizeH) {
				(distanceY = this.half_sizeH);
			}
			else if (distanceY <= -this.half_sizeH) {
				(distanceY = -this.half_sizeH);
			}
			if (distanceX >= this.half_sizeW) {
				(distanceX = this.half_sizeW);
			}
			else if (distanceX <= -this.half_sizeW) {
				(distanceX = -this.half_sizeW);
			}
		} else {
			if (distanceY >= this.radius) {
				distanceY = this.radius;
			}
			else if (distanceY <= -this.radius) {
				distanceY = -this.radius;
			}
			if (distanceX >= this.radius) {
				distanceX = this.radius;
			}
			else if (distanceX <= -this.radius) {
				distanceX = -this.radius;
			}
		}

		ctx.shadowOffsetX = distanceX;
		ctx.shadowOffsetY = distanceY;
	}

	//not working but it's suppose to render a image inside the object
	create_image(ctx) {
		let myImage = document.createElement("img");
		myImage.src = this.image_path;
		myImage.width = this.width;
		myImage.height = this.height;
		myImage.onload = function () {
			ctx.drawImage(myImage, this.x, this.y, this.width, this.height);
		};
	}

	mouse_on_here(e) {
		mouseX = e.clientX;
		mouseY = e.clientY;

		switch (this.type) {
			case "square":
				if (mouseX <= this.x + this.width &&
					mouseX >= this.x &&
					mouseY <= this.y + this.height &&
					mouseY >= this.y) {

					this.x = mouseX;
					this.y = mouseY;
					this.mouse_on_me = true;
					return true;

				}

				break;
			case "circle":
				if (mouseX <= this.x + this.radius &&
					mouseX >= this.x - this.radius &&
					mouseY <= this.y + this.radius &&
					mouseY >= this.y - this.radius) {

					this.x = mouseX;
					this.y = mouseY;
					this.mouse_on_me = true;
					return true;

				}
				break;
		}
	}

	//this makes the object move and prevent for leaving the screen
	update() {
		this.draw(ctx);

		switch (this.type) {
			case "square":
				if (this.x <= 0) {
					(this.x = 1), (this.dx = -this.dx);
					this.dx *= this.wall_absortion_force;
				}
				if (this.y <= 0) {
					(this.y = 1), (this.dy = -this.dy);
					this.dy *= this.wall_absortion_force;
				}
				if (this.x + this.width >= canvas.width) {
					(this.x = canvas.width - this.width - 1), (this.dx = -this.dx);
					this.dx *= this.wall_absortion_force;
				}
				if (this.y + this.height >= canvas.height) {
					(this.y = canvas.height - this.height - 1), (this.dy = -this.dy);
					this.dy *= this.wall_absortion_force;
				}

				this.centerX = this.x + this.width * 0.5;
				this.centerY = this.y + this.height * 0.5;

				//this.create_image(ctx);
				break;

			case "circle":
				if (this.x - this.radius <= 0) {
					(this.dx = this.speed), (this.x = 1 + this.radius);
					this.dx *= this.wall_absortion_force;
				}
				if (this.y - this.radius <= 0) {
					(this.dy = this.speed), (this.y = 1 + this.radius);
					this.dy *= this.wall_absortion_force;//**2  0.5
				}
				if (this.x + this.radius >= canvas.width) {
					(this.dx = -this.speed), (this.x = canvas.width - this.radius - 1);
					this.dx *= this.wall_absortion_force;
				}
				if (this.y + this.radius >= canvas.height) {
					(this.dy = -this.speed), (this.y = canvas.height - this.radius - 1);
					this.dy *= this.wall_absortion_force;//**2
				}

				this.centerX = this.x;
				this.centerY = this.y;
				break;
		}

		let minimum_value = 0.1;

		if (this.dx > -minimum_value && this.dx < minimum_value) {
			this.dx = 0
		} else {
			this.dx > 0 ? this.dx += -this.gravity_force : this.dx += this.gravity_force;
		}

		if (this.dy > -minimum_value && this.dy < minimum_value) {
			this.dy = 0
		} else {
			this.dy > 0 ? this.dy += -this.gravity_force : this.dy += this.gravity_force;
		}


		this.x += this.dx;
		this.y += this.dy;
	}

	energy_lost(obj) {
		//this cost can be altered to make the colision more or less efective

		//cool values for the cost:
		// 0.5, 0.69, 0.82 and 0.95

		let cost = 0.95;
		let initial_dx = this.dx, initial_dy = this.dy;

		if (this.dx < 0 && obj.dx > 0 || this.dx > 0 && obj.dx < 0) {
			this.dx -= (this.dx + obj.dx) * cost;
			obj.dx -= (initial_dx + obj.dx) * cost;
		}
		else {
			this.dx += (-obj.dx - this.dx) * cost;  //this.dx += (-obj.dx - this.dx) * cost;
			obj.dx += (-initial_dx - obj.dx) * cost; //obj.dx += (-initial_dx - obj.dx) * cost;
		}

		if (this.dy < 0 && obj.dy > 0 || this.dy > 0 && obj.dy < 0) {
			this.dy -= (this.dy + obj.dy) * cost;
			obj.dy -= (initial_dy + obj.dy) * cost;
		}

		else {
			this.dy += (-obj.dy - this.dy) * cost; //this.dy += (-obj.dy - this.dy) * cost;
			obj.dy += (-initial_dy - obj.dy) * cost; //(-initial_dy - obj.dy) * cost;
		}
	}

	//used for drawing lines from the center of this objct to the other inside the object_or_array
	//the object_or_array must be inserted as [object] for single object or a list with a bunch of objects
	draw_line(object_or_array) {
		object_or_array.forEach((element) => {
			ctx.beginPath();

			//remove this { //for stopping the lines to have shadows
			ctx.shadowBlur = null;
			ctx.shadowColor = null;
			//}

			ctx.moveTo(this.centerX, this.centerY);
			ctx.lineTo(element.centerX, element.centerY);
			ctx.lineWidth = 3;
			ctx.strokeStyle = this.color;
			ctx.stroke();
		});
	}

	//colision detection beteween squares or rectangles
	square_square_colision(obj2) {
		return this.x + this.width >= obj2.x &&
			this.x <= obj2.x + obj2.width &&
			this.y + this.height >= obj2.y &&
			this.y <= obj2.y + obj2.height
			? true
			: false;
	}

	//colision detection for interacting circle and rectangles
	circle_rectangle_colision(circle) {
		return this.x + this.width >= circle.x - circle.radius &&
			this.x <= circle.x + circle.radius &&
			this.y + this.height >= circle.y - circle.radius &&
			this.y <= circle.y + circle.radius
			? true
			: false;
	}

	//colision detection for circle to circle
	circle_colision(circle) {
		let distanceX = circle.x - this.x;
		let distanceY = circle.y - this.y;
		let radius_distance = this.radius + circle.radius;

		return radius_distance * radius_distance >=
			distanceX * distanceX + distanceY * distanceY ? true : false;
	}

	//don't really know if this here works in practice but, it used for return the closes point in this object
	//in relation to another
	boundaring_distance(element) {
		let varx = element.x;
		let vary = element.y;

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

	//response to the colision between squares
	//values must be a list containg the squares
	square_response(values) {
		//colision_response_with_squares

		values.forEach((element) => {
			if (this.x == element.x && element.y == this.y) {
				return;
			} else if (this.square_square_colision(element)) {
				// if you add a "!" to the beggining of the if, will make them just stop

				let vector_x = this.centerX - element.centerX;
				let vector_y = this.centerY - element.centerY;

				if (vector_y * vector_y > vector_x * vector_x) {
					this.y = vector_y > 0 ? element.bottom : element.y - this.height;
					element.dy = -element.dy;
				} else {
					this.x = vector_x > 0 ? element.right : element.x - this.width;
					element.dx = -element.dx;
				}
				//uncomment the following line for making the objects stop
				//this.dx = element.dx = this.dy = element.dy = 0;
				this.energy_lost(element);
			}
		});
	}

	//colision response for circles and square
	//can and will accept a list containg squares or circles
	//needs to be a list
	//it has two types of response, they are determined by the type of the object on wich is determined by this.type
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
						varx = element.x >= this.x + this.width ? this.x + this.width : element.x;

						if (element.y <= this.y) {
							varx = this.y;
						}
						vary = element.y >= this.y + this.height ? this.y + this.height : element.y;

						square_radius = Math.sqrt(
							(this.centerX - varx) * (this.centerX - varx) +
							(this.centerY - vary) * (this.centerY - vary)
						);

						let radius_distance = square_radius + element.radius;
						let distance =
							radius_distance -
							Math.sqrt(vectorX * vectorX + vectorY * vectorY);

						if (vectorY * vectorY > vectorX * vectorX) {
							element.y = vectorY > 0 ? this.top - element.radius - 1 : this.bottom + element.radius + 1;
							this.dy = -this.dy;
							element.dy = -element.dy;
						} else {
							element.x = vectorX > 0 ? this.left - element.radius - 1 : this.right + element.radius + 1;
							this.dx = -this.dx;
							element.dx = -element.dx;
						}
						this.energy_lost(element);
					}

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
						varx = element.x >= this.x + this.width ? this.x + this.width : element.x;

						if (element.y <= this.y) {
							varx = this.y;
						}
						vary = element.y >= this.y + this.height ? this.y + this.height : element.y;

						square_radius = Math.sqrt(
							(this.centerX - varx) * (this.centerX - varx) +
							(this.centerY - vary) * (this.centerY - vary)
						);

						let radius_distance = square_radius + element.radius;
						let distance =
							radius_distance -
							Math.sqrt(vectorX * vectorX + vectorY * vectorY);

						if (vectorY * vectorY > vectorX * vectorX) {
							element.y = vectorY > 0 ? this.top - element.radius - 1 : this.bottom + element.radius + 1;
							this.dy = -this.dy;
							element.dy = -element.dy;
						} else {
							element.x = vectorX > 0 ? this.left - element.radius - 1 : this.right + element.radius + 1;
							this.dx = -this.dx;
							element.dx = -element.dx;
						}

						this.energy_lost(element);

						break;
					}
			}
		});
	}

	//colision responde between circles
	//must be a list
	//cannot accept a list with squares
	circle_response(list) {
		list.forEach((element) => {
			if (element.x == this.x && element.y == this.y) {
				return;
			} else if (this.circle_colision(element)) {
				let distanceX = this.x - element.x;
				let distanceY = this.y - element.y;

				let radius_distance = this.radius + element.radius;
				let distance =
					radius_distance -
					Math.sqrt(distanceX * distanceX + distanceY * distanceY);

				if (distanceY * distanceY > distanceX * distanceX) {
					if (distanceY > 0) {
						this.y += distance;
					} else {
						this.y -= distance;
					}
					//this.dy = -this.dy;
					element.dy = -element.dy;
				} else {
					if (distanceX < 0) {
						this.x -= distance;
					} else {
						this.x += distance;
					}
					//this.dx = -this.dx;
					element.dx = -element.dx;
				}

				if (distanceX == 0 && distanceY == 0) {
					this.x += radius_distance;
					this.y += radius_distance;
				}

				this.energy_lost(element);

				//uncomment the following line for making the objects stop when colision
				//this.dx = element.dx = this.dy = element.dy = 0
			}
		});
	}
}

//classes objects and buttons

//toggles functions
change_toggle_all = () => {
	return (lines_toggle = !lines_toggle);
};
change_toggle_square = () => {
	return (square_toggle = !square_toggle);
};
change_toggle_circle = () => {
	return (circle_toggle = !circle_toggle);
};

let toggle_shadow = document.getElementById("toggle_shadows")

let $all_line = (document.getElementById("show_all_line").onclick = () => {
	change_toggle_all();
});
let $square_line = (document.getElementById("show_square_line").onclick =
	() => {
		change_toggle_square();
	});
let $circle_line = (document.getElementById("show_circle_line").onclick =
	() => {
		change_toggle_circle();
	});

//button tha create a luminous object on the canvas
//create and destroy light
let $create_light = (document.getElementById("create_light").onclick = () => {
	generate_random_objects("circle", true);
});
let $delete_light = (document.getElementById("delete_light").onclick = () => {
	light_sources.pop();
});

//create and destroy an circle
let $create_circle = (document.getElementById("create_circle").onclick = () => {
	generate_random_objects("circle");
});
let $delete_circle = (document.getElementById("delete_circle").onclick = () => {
	circles.pop();
});

//create and destroy a square
let $create_square = (document.getElementById("create_square").onclick = () => {
	generate_random_objects("square");
});
let $delete_square = (document.getElementById("delete_square").onclick = () => {
	squares.pop();
});

//make the objects stop and move again and for cleaning the canvas and outline toggle
let $stop = (document.getElementById("stop").onclick = () => {
	stop_movement();
});
let $start = (document.getElementById("start").onclick = () => {
	start_movement();
});
let $clear_canvas = (document.getElementById("clear_all").onclick = () => {
	clear([squares, circles, light_sources]);
});

let $show_outline = (document.getElementById("show_outline").onclick = () => {
	new_list = squares.concat(circles, light_sources);
	new_list.forEach((i) => {
		i.outline = !i.outline;
	});
});

//controlables by mouse
let $create_my_circle = (document.getElementById("create_my_circle").onclick =
	() => {
		let my_circle = new object_contructor(
			"circle",
			mouseX,
			mouseY,
			random_speed,
			"black",
			my_circle_radius
		);
		my_circle.random_color();
		circles.push(my_circle);
	});
let $crete_my_square = (document.getElementById("create_my_square").onclick =
	() => {
		let my_square = new object_contructor(
			"square",
			mouseX,
			mouseY,
			random_speed,
			"black",
			0,
			80,
			80
		);
		my_square.random_color();
		squares.push(my_square);
	});
let $create_my_light = (document.getElementById("create_my_light").onclick =
	() => {
		let my_light = new object_contructor(
			"circle",
			mouseX,
			mouseY,
			0,
			"white",
			30
		);
		my_light.light_souce = true;
		light_sources.push(my_light);
	});

let my_square = new object_contructor(
	"square",
	0,
	0,
	Math.floor(Math.random() * max_speed) + 1,
	"black",
	null,
	100,
	100
);
let my_circle = new object_contructor(
	"circle",
	0,
	0,
	Math.floor(Math.random() * max_speed) + 1,
	"black",
	my_circle_radius
);
let my_light = new object_contructor("circle", mouseX, mouseY, 0, "white", 20);

//let my_circle, my_light, my_square;

//functions here

generate_random_objects = (object_type, light_property = false) => {
	if (object_type === "square") {
		let random_x = Math.floor(Math.random() * canvas.width) + 1;
		let random_y = Math.floor(Math.random() * canvas.height) + 1;

		let random_width = Math.floor(Math.random() * max_size) + 1;
		if (random_width < 20) {
			random_width = 20;
		}

		let random_height = Math.floor(Math.random() * max_size) + 1;
		if (random_height < 20) {
			random_height = 20;
		}

		let random_speed = Math.floor(Math.random() * max_speed) + 1;

		let random_square = new object_contructor(
			"square",
			random_x,
			random_y,
			random_speed,
			"black",
			null,
			random_width,
			random_height
		);
		random_square.random_color();
		squares.push(random_square);
	}
	if (object_type === "circle") {
		let random_x = Math.floor(Math.random() * canvas.width) + 1;
		let random_y = Math.floor(Math.random() * canvas.height) + 1;

		let random_radius = Math.floor(Math.random() * max_size) + 1;
		if (random_radius < 20) {
			random_radius = 20;
		}

		let random_speed = Math.floor(Math.random() * max_speed) + 1;

		let random_circle = new object_contructor(
			"circle",
			random_x,
			random_y,
			random_speed,
			"purple",
			random_radius
		);
		random_circle.random_color();

		if (light_property === true) {
			random_circle.light_souce = true;
			light_sources.push(random_circle);
		} else {
			circles.push(random_circle);
		}
	}
};

function update_object(object_type, element, light = false) {


	if (object_type === "circle") {
		element.circle_square_response(squares);
		element.circle_response(circles);
		element.circle_response(light_sources);

		if (light === true) {
			my_light = new object_contructor(
				"circle",
				mouseX,
				mouseY,
				0,
				"white",
				30
			);
			my_light.light_souce = true;
			light_sources[0] = my_light;
		}
	}

	if (object_type === "square") {
		element.square_response(squares);
	}

	update_position(object_type, element);
	element.update();
}

function update_position(object_type, object) {
	//stop the movement
	if (object_type === "circle") {
		if (object.x - object.radius <= 0) {
			object.x = object.radius + 1;
		}
		if (object.y - object.radius <= 0) {
			object.y = object.radius + 1;
		}
		if (object.x + object.radius >= canvas.width) {
			object.x = canvas.width - object.radius - 1;
		}
		if (object.y + object.radius >= canvas.height) {
			object.y = canvas.height - object.radius - 1;
		}
	} else if (object_type === "square") {
		if (object.x <= 0) {
			(object.x = 1), (object.dx = -object.dx);
		}
		if (object.y <= 0) {
			(object.y = 1), (object.dy = -object.dy);
		}

		if (object.x + object.width >= canvas.width) {
			(object.x = canvas.width - object.width - 1), (object.dx = -object.dx);
		}
		if (object.y + object.height >= canvas.height) {
			(object.y = canvas.height - object.height - 1), (object.dy = -object.dy);
		}
	}
}

function clear(list) {
	let sizes = [];
	for (i of list) {
		sizes.push(i.length);
	}
	let condition_loop;
	sizes.forEach((i) => {
		if (i != 0) {
			condition_loop = true;
		}
	});

	if (condition_loop) {
		for (var i = 0; i < Math.max(...sizes) + 1; i++) {
			list.forEach((i) => {
				i.pop();
			});
		}
	} else {
		return;
	}
}

function draw_lines(list) {
	for (element of list) {
		element.draw_line(list);
	}
}

function stop_movement() {
	for (square of squares) {
		square.dx = square.dy = 0;
	}
	for (circle of circles) {
		circle.dx = circle.dy = 0;
	}
	for (circle of light_sources) {
		circle.dx = circle.dy = 0;
	}
}

function start_movement() {
	let len1 = circles.length;
	let len2 = squares.length;
	let len3 = light_sources.length;
	for (element of circles) {
		let random_speed = Math.floor(Math.random() * max_speed) + 1;
		element.dx = element.dy = random_speed;
	}
	for (element of squares) {
		let random_speed = Math.floor(Math.random() * max_speed) + 1;
		element.dx = element.dy = random_speed;
	}
	for (element of light_sources) {
		let random_speed = Math.floor(Math.random() * max_speed) + 1;
		element.dx = element.dy = random_speed;
	}
}

function render_objects(squares, circles) {
	squares.forEach((i) => {
		i.forEach((element) => {
			for (c of squares) {
				element.square_response(c);
			}
			for (a of circles) {
				element.circle_square_response(a);
			}
			element.update();
		});
	});

	circles.forEach((i) => {
		i.forEach((element) => {
			for (b of circles) {
				element.circle_response(b);
			}
			element.update();
		});
	});
}

function render_light(list) {
	//list.forEach((element) => {
	if (list.length > 0) {
		let element = list[list.length - 1];
		let grd;

		switch (element.type) {
			case "circle":
				grd = ctx.createRadialGradient(
					element.x,
					element.y,
					element.radius * element.mass,
					element.x,
					element.y,
					canvas.width * 0.5
				);
				//grd = ctx.createRadialGradient(element.x, element.y, element.radius * 0.5, element.x, element.y, element.light_constant);
				break;
			case "square":
				grd = ctx.createRadialGradient(
					element.x,
					element.y,
					(element.width + element.height) * 0.5,
					element.x,
					element.y,
					canvas.width * 0.5
				);
				//grd = ctx.createRadialGradient(element.x, element.y, (element.width + element.height) * 0.5, element.x, element.y, (element.width + element.height) * 5);
				break;
		}
		grd.addColorStop(0, element.color);
		grd.addColorStop(0.3, $color_picker.value);
		grd.addColorStop(0.85, $color_picker.value);
		grd.addColorStop(1, "black");

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		if (element.type === "circle") {
			element.circle_response(light_sources);
			element.circle_response(circles);
		} else {
			element.square_response(squares);
			element.circle_square_response(circles);
			element.circle_square_response(light_sources);
		}
		element.update();
		//element.random_color();
	}
}

//not working yet {

const move_object = (list) => {

	document.addEventListener("mousemove", (e) => {

		for (i of list) {
			if (i.mouse_on_here(e)) {
				controled_object = i;
				update_object(controled_object.type, controled_object, controled_object.light_souce)
			}
		}
	})
}

//}



function game() {

	canvas.style.background = $color_picker.value;
	let new_list = squares.concat(circles, light_sources);
	//console.log(new_list);

	render_light(light_sources);
	//render_light(squares)
	//update_object("circle", my_light, true);

	if (lines_toggle === true) {
		draw_lines(new_list);
	}
	if (circle_toggle === true) {
		draw_lines(circles);
	}
	if (square_toggle === true) {
		draw_lines(squares);
	}

	/*
	toggle_shadow.onclick = () => {
		for (i of new_list) {
			i.enable_shadows = !i.enable_shadows
		}
	}
	*/

	document.addEventListener("mousedown", () => { move_object(new_list) })

	render_objects([squares], [circles, light_sources]);
}

let update_frame = () => {
	requestAnimationFrame(update_frame);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	game();
};

update_frame();
