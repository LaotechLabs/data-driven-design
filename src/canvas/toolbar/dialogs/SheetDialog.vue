<template>
    <div class="main">
        <div class="toolbar">
            <div class="left">
                <input class="btn" type="file" @change="onFileChange" />
            </div>
            <div class="right">
                <button @click="applyChange">Apply</button>
                <button @click="exportBook">Export</button>
            </div>
        </div>
        <div id="grid"></div>
    </div>
</template>
  
<script>
import Spreadsheet from "x-data-spreadsheet";
import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
XLSX.set_fs(fs);
import { stox, xtos } from "./xlsxspread";

export default {
    name: "SpreadSheet",
    data() {
        return {
            s: {},
            grid: {},
            options: {
                col: {
                    len: 100
                },
                view: {
                    height: () => document.documentElement.clientHeight - document.getElementsByClassName("toolbar")[0].clientHeight,
                },
                showToolbar: false
            }
        };
    },
    methods: {
        initSpreadSheet() {
            const s = new Spreadsheet("#grid", this.options);
            this.s = s;
        },
        onFileChange(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
                let csv = e.target.result;
                this.s.loadData(stox(XLSX.read(csv)));
            };
        },
        exportBook() {
            XLSX.writeFile(xtos(this.s.getData()), "SheetJS.xlsx");
        },
        applyChange() {
            let workBook = xtos(this.s.getData());
            let sheet = workBook.Sheets[workBook.SheetNames[0]]
            let data = XLSX.utils.sheet_to_json(sheet);
            console.log(data);
        }
    },
    components: {},
    async mounted() {
        this.initSpreadSheet();
    }
};
</script>
  
<style>
.main {
    height: 100%;
    width: 100%;
}

.toolbar {
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3em;
}

.right {
    display: flex;
    gap: 2em;
}

button {
    border: 1px solid black;
    border-radius: 0%;
    padding: 0.5em 1em;
}


input::file-selector-button {
    border: 1px solid black;
    border-radius: 0%;
    padding: 0.5em 1em;
}
</style>