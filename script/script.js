const gridContainer = document.getElementById("grid-container");
const root = document.documentElement;

var sizeSlider = document.getElementById("size-slider");
var gridItems = [];
var gridSize = sizeSlider.value;
var colorPicker = document.querySelector('input[type="color"]');
var fragment = document.createDocumentFragment();

var buttons = document.querySelectorAll("button");

var color = colorPicker.value;
var action = "color";

function createGrid(size) {
    root.style.setProperty("--grid-size", size);
    for (let i = 1; i <= size ** 2; i++) {
        gridItems[i] = document.createElement("div");
        gridItems[i].__id = i;
        gridItems[i].className = "grid-item";
        fragment.appendChild(gridItems[i]);
    }
    gridContainer.appendChild(fragment);        //minimize reflows, fastest approach so far
}

function removeGrid() {
    gridContainer.replaceChildren();
}

function getGridItem(event) {
    var coloredGrid = event.target;
    var id;
    while (coloredGrid!=gridContainer) {
        if (coloredGrid.__id) {
            id = coloredGrid.__id;     //the idea is to minimize event listeners by using propagation
            break;                     //instead of event listener for every node, just make 1 for parent
        }                              //event listener initializes only once, then check id and return correct one
        coloredGrid = coloredGrid.parentElement;
    }
    return coloredGrid;
}

function hover(e) {
    switch(action) {
        case "color": getGridItem(e).style = `background-color: ${color}`; break;
        case "magic": getGridItem(e).style = `background-color: ${randomColor()}`; break;
        case "erase": getGridItem(e).style = `background-color: white`; break;
    }
}

function randomColor() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + b + "," + g + ")";
}

function chooseAction(e) {
    if (e.target.id === "clear") {
        removeGrid();
        createGrid(sizeSlider.value);
    } 
        else action = e.target.id;
}

gridContainer.addEventListener("mouseover", hover);
colorPicker.addEventListener("input", (e) => {color = e.target.value; action = "color";})
buttons.forEach((button) => {button.addEventListener("click", chooseAction)});
sizeSlider.addEventListener("input", (e) => {removeGrid()});
sizeSlider.addEventListener("mouseup", (e) => {removeGrid(), createGrid(e.target.value)});


createGrid(gridSize);