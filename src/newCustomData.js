let newCustomData = {};
let allCanvas = [];
let workBook;
let gridWidgets = [];
let konvaObj = [];
let sourceModel;

function addNewData(obj) {
    newCustomData = obj;
}

function setWorkBook(obj) {
    workBook = obj;
}

function setCanvas(canvas) {
    allCanvas = canvas;
}

function setKonvaObj(obj) {
    konvaObj.push(obj);
}

function setGridWidgets(widget) {
    gridWidgets.push(widget);
}

function setSourceModel(model) {
    sourceModel = model;
}

export { newCustomData, addNewData, workBook, setWorkBook, allCanvas, setCanvas, gridWidgets, setGridWidgets, konvaObj, setKonvaObj, sourceModel, setSourceModel }