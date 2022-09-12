let newCustomData = {};
let workBook;
let cellSize = 0;

function addNewData(obj) {
    newCustomData = obj;
}

function setWorkBook(obj) {
    workBook = obj;
}

function setCellSize() {
    cellSize += 1;
    if (cellSize == 3) {
        cellSize = 0;
    }
}

export {newCustomData, addNewData, workBook, setWorkBook, cellSize, setCellSize}