let newCustomData = {};
let allCanvas = {};
let workBook;

function addNewData(obj) {
    newCustomData = obj;
}

function setWorkBook(obj) {
    workBook = obj;
}

function setCanvas(canvas) {
    allCanvas = canvas;
}

export {newCustomData, addNewData, workBook, setWorkBook, allCanvas, setCanvas}