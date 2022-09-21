let newCustomData = {};
let allCanvas = [];
let workBook;
let gridWidgets = [];

function addNewData(obj) {
    newCustomData = obj;
}

function setWorkBook(obj) {
    workBook = obj;
}

function setCanvas(canvas) {
    allCanvas = canvas;
}

function setGridWidgets(widget) {
    gridWidgets.push(widget);
    console.log(gridWidgets);
} 

export {newCustomData, addNewData, workBook, setWorkBook, allCanvas, setCanvas, gridWidgets, setGridWidgets}