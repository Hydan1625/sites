let $result = document.getElementById("result");

document.addEventListener('keydown', (e) => {
    if (e.key in exception) {
        exception[e.key]();
    } else {
        $result.textContent += e.key;
    }
})

let resultados = [];

let exception = {
    "ArrowLeft": () => {return},
    "ArrowRight": () => {return},
    "ArrowDown": () => {return},
    "ArrowUp": () => {return},
    "Control": () => {return},
    "Shift": () => {return},
    "Alt": () => {return},
    "AltGraph": () => {return},
    "Tab": () => {return},
    
    "Backspace": () => {exception["Del"]()},
    "Escape": () => {exception["C"]()},
    "C": () => { $result.textContent = ""; },
    
    "Pi": () => { $result.textContent += Math.PI.toFixed(2); },
    "Del": () => { $result.textContent = $result.textContent.slice(0, -1)},
    "Space": () => { $result.textContent += ` ` },

    "Calc": () => {exception["Enter"]()},
    "Enter": () => { 
        $result.textContent = eval($result.textContent); 
        resultados.push($result.textContent);
    },
}

let buttons = [...document.getElementsByTagName('button')]
buttons.forEach((el) => {
    el.addEventListener("click", inputs);
    $result.textContent = eval($result.textContent);
})

function inputs(e) {
    if (e.target.textContent in exception) {
        exception[e.target.textContent]()   
    } else {
        $result.textContent += e.target.textContent;
    }
}



//experimental area

//basic numbers

const zero = '+[]';
const one = '+!![]';

//number converter

const number = n => {
    if (n === 0) {return zero}
    return Array.from({length: n}, () => one).join(' + ')
}

const seven = number(7);

// fromChadeSingcup[space][backslash]

//for storing the letters above here
const map = {};

const fromString = s =>s.split('').map (x => {
    if (!(x in map)) {
        const charCode = x.charCodeAt(0)
        return `([]+[])[${fromString('constructor')}][${fromString('fromCharCode')}](${number(charCode)})`;
    }
    return map[x];
}).join('+');

//Nan = (+{}[])
map.a = `(+{}+[])[${number(1)}]`;

//['Object Object'] = ({}+[])
map.b = `({}+[])[${number(2)}]`;
map.o = `({}+[])[${number(1)}]`;
map.e = `({}+[])[${number(4)}]`;
map.c = `({}+[])[${number(5)}]`;
map.t = `({}+[])[${number(6)}]`;
map[' '] = `({}+[])[${number(7)}]`;


//false = ![]+[]
map.f = `(![]+[])[${number(0)}]`;
map.s = `(![]+[])[${number(3)}]`;

//true !![]+[]
map.r = `(!![]+[])[${number(1)}]`;
map.u = `(!![]+[])[${number(2)}]`;


//Infinity (+!![]/+[])+[] = n / 0
map.i = `((+!![]/+[])+[])[${number(3)}]`;
map.n = `((+!![]/+[])+[])[${number(4)}]`;

map.S = `([]+([]+[])[${fromString('constructor')}])[${number(9)}]`;
map.g = `([]+([]+[])[${fromString('constructor')}])[${number(14)}]`;

map.p = `([]+(/-/)[${fromString('constructor')}])[${number(14)}]`;
map['\\'] = `(/\\\\/+[])[${number(1)}]`;

map.d = `(${number(13)})[${fromString('toString')}](${number(14)})`;
map.h = `(${number(17)})[${fromString('toString')}](${number(18)})`;
map.m = `(${number(22)})[${fromString('toString')}](${number(23)})`;

map.C = `(()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']})[${number(2)}]`;

const compile = code => `(()=>{})[${fromString('constructor')}](${fromString(code)})()`;
const compile_and_run = code => { eval(`compile(${code})`)}

//updating the display
let loop = () => {
    requestAnimationFrame(loop);
    $result.textContent = $result.textContent;
}
loop();