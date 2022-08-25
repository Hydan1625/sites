let $result = document.getElementById("result");

//to add new funcionalities, just put it's name here in quotes and add it's function
let exception = {
    "C": () => { $result.textContent = ""; },
    "=": () => { 
        $result.textContent = eval($result.textContent); 
        resultados.push($result.textContent);
    },
    "Pi": () => { $result.textContent += Math.PI.toFixed(2); },
    "Del": () => { $result.textContent = $result.textContent.slice(0, -1)},
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