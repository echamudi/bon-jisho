# Bon Jisho

<img src="https://raw.githubusercontent.com/echamudi/bon-jisho/master/ng-src/assets/bon-jisho-logo.svg" alt="Bon Jisho Logo" height="100" width="100">

An open source Japanese dictionary desktop app based on electron.

## Development

Currently, the app is only supported on mac.

### Download and Install Dependencies

```sh
yarn
npx electron-builder install-app-deps

mkdir -p ./ng-src/assets/fonts
(cd ./ng-src/assets/fonts \
  && curl -o KanjiStrokeOrders.ttf https://raw.githubusercontent.com/echamudi/jp-resources-mirror/34a3254dc9ed46ba2dfbf64cf62156c1077fb673/KanjiStrokeOrders_v4.004.ttf \
  && curl -o "KanjiStrokeOrders_v4.004 - copyright.txt" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/34a3254dc9ed46ba2dfbf64cf62156c1077fb673/KanjiStrokeOrders_v4.004%20-%20copyright.txt)
```

### Building the Database

Before compiling the app, we need to build the database.
This project uses [Japanese DB](https://github.com/ezhmd/japanese-db) tool to build the database. 

1. Download the required materials from the following sources:
  - JMdict_e: http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz
  - JMnedict.xml: http://ftp.edrdg.org/pub/Nihongo/JMnedict.xml.gz
  - kanjidic2.xml: http://www.edrdg.org/kanjidic/kanjidic2.xml.gz
  - ka_data.csv: https://raw.githubusercontent.com/echamudi/kanji-data-media/master/language-data/ka_data.csv

1. Extract and put all the required materials inside `db-src` folder. Make sure the file names are exactly `JMdict_e`, `JMnedict.xml`, `kanjidic2.xml`, and `ka_data.csv` respectively.

1. Run following script:
    ```sh
    yarn db-build
    ```

### Watch

1. Open two separate terminal windows.

2. Run following commands:

    ```sh
    # Terminal 1
    # This command will watch Angular code changes
    yarn ng-start 

    # Terminal 2
    # This command will start Electron Webpack
    yarn dev
    ```

## Building

To build and package a single executable app, run following command:

```sh
# Build Database
yarn db-build

# Build Preload Asar
npx asar pack ./src/preload ./static/pre.asar

# Build Angular Asar
ng build --configuration="production"
npx asar pack ./static/ng-dist ./static/ng.asar
rm -rf ./static/ng-dist

# Build Angular App
yarn dist
```

## Authors

* **Ezzat Chamudi** - [ezhmd](https://github.com/ezhmd)

## Licenses

Copyright © 2020 Ezzat Chamudi

JMdict and JMnedict License http://www.edrdg.org/edrdg/licence.html.

Libraries, dependencies, and tools used in this project are tied with their own licenses respectively.
