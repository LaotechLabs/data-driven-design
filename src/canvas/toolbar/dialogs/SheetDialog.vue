
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
import DojoWidget from 'dojo/DojoWidget'
import Logger from 'common/Logger'
import Util from 'core/Util'

import Spreadsheet from "x-data-spreadsheet";
import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
XLSX.set_fs(fs);
import { stox, xtos } from "./xlsxspread";

import { addNewData, setWorkBook, workBook } from 'src/newCustomData';

export default {
    name: 'SheetDialog',
    mixins: [Util, DojoWidget],
    data: function () {
        return {
            model: null,
            jwtToken: '',
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
        }
    },
    components: {},
    computed: {
    },
    methods: {
        
        // Methods to make it work 
        setModel(m) {
            this.model = m;
        },

        setJwtToken(t) {
            this.jwtToken = t
        },
        

        // Main methods
        // 1. stox converts spreadsheet library object to XLSX library object. 
        // 2. xtos converts XLSX library object to spreadsheet library object. 
        // 3. to load data to grid, we need spreadsheet library object.
        // 4. to convert data to JSON and export as file, we need XLSX library object. 
        // 5. Apply button adds data to newCustomData.js
        // 6. DataBinding functions on the toolbar access this data. These functions are present in the
        // _Dialogs.vue file.

        initSpreadSheet() {
            const s = new Spreadsheet("#grid", this.options);
            this.s = s;
        },

        initExistingSheet(data) {
            const s = new Spreadsheet("#grid", this.options)
                            .loadData(stox(data));
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
            addNewData(data);
            setWorkBook(workBook);
        }

    },
    mounted() {
        this.logger = new Logger("SheetDialog");

        // setTimeout ensures the library is completely imported before initialising grid, I think
        setTimeout(() => {
            if (workBook == undefined) {
                this.initSpreadSheet();
            }
            else {
                this.initExistingSheet(workBook);
            }
        }, 500)  // Can experiment with time 
    }
}
</script>

<style>
.main {
    width: 1200px;
    height: 650px;
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