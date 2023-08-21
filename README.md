This is a fork of [Quant UX](https://github.com/KlausSchaefers/quant-ux) originally created by Klaus Schaefer.

## Data-Driven Automations for Content Designing

Read about this approach here: 

This repository contains files used to create the implementation for the Data Driven Automations approach. 

## Development setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Demo

https://github.com/LaotechLabs/data-driven-design/assets/22636983/110fee0f-1a3c-4b0a-8d2e-37e8915c3375

1. Create a CSV data file (make sure the extension is .csv, and not .xlsx or anything else).
2. First row of the CSV file will contain IDs used to map assets. Subsequent rows will contain the assets themselves. Images should be uploaded and their URLs added to the file.
3. Create a new prototype and choose a suitable template size.
4. Add label widgets for text assets, and image widget for image assets. Add the ID you created in the CSV file as the corresponding widgets name.
5. Click on Upload and upload the CSV file.
6. Click on Add.
7. Use the Next and Previous buttons to cycle through the assets.

File used:
[Formula1_data.csv](https://github.com/LaotechLabs/data-driven-design/files/12385155/Formula1_data.csv)


