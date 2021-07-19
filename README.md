# Bon Jisho

<img src="https://raw.githubusercontent.com/echamudi/bon-jisho/master/ng-src/assets/bon-jisho-logo.svg" alt="Bon Jisho Logo" height="100" width="100">

A free and open source Japanese dictionary desktop app based on electron.

[📥 Download Bon Jisho for Mac & Windows](https://github.com/echamudi/bon-jisho/releases)

## Development

### Install Dependencies

Install Node modules:

```sh
yarn
npx electron-builder install-app-deps
```

Download the require materials:

```sh
# In Windows, you may use WSL to run the following commands OR you can download and extract the files manually

# Download DB materials
mkdir -p ./db-src
(cd ./db-src \
  && curl -o "JMdict_e.zip" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/443711d6fab8072f7ec23cdd00f47e8f4d51aa71/EDRDG%20-%202021-06-30/JMdict_e.zip \
  && curl -o "JMnedict.xml.zip" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/443711d6fab8072f7ec23cdd00f47e8f4d51aa71/EDRDG%20-%202021-06-30/JMnedict.xml.zip \
  && curl -o "kanjidic2.xml.zip" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/443711d6fab8072f7ec23cdd00f47e8f4d51aa71/EDRDG%20-%202021-06-30/kanjidic2.xml.zip \
  && curl -o "ka_data.csv" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/443711d6fab8072f7ec23cdd00f47e8f4d51aa71/kanji-data-media/ka_data.csv )
(cd ./db-src \
  && unzip "JMdict_e.zip" \
  && unzip "JMnedict.xml.zip" \
  && unzip "kanjidic2.xml.zip")

# Download KanjiStrokeOrders
mkdir -p ./ng-src/assets/fonts
(cd ./ng-src/assets/fonts \
  && curl -o "KanjiStrokeOrders.ttf" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/34a3254dc9ed46ba2dfbf64cf62156c1077fb673/KanjiStrokeOrders_v4.004.ttf \
  && curl -o "KanjiStrokeOrders_v4.004 - copyright.txt" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/34a3254dc9ed46ba2dfbf64cf62156c1077fb673/KanjiStrokeOrders_v4.004%20-%20copyright.txt)

# Download Noto Fonts
mkdir -p ./ng-src/assets/fonts
(cd ./ng-src/assets/fonts \
  && curl -o "NotoSansJP-Regular.otf" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/443711d6fab8072f7ec23cdd00f47e8f4d51aa71/Noto_Sans_JP/NotoSansJP-Regular.otf \
  && curl -o "NotoSansJP-Bold.otf" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/443711d6fab8072f7ec23cdd00f47e8f4d51aa71/Noto_Sans_JP/NotoSansJP-Bold.otf \
  && curl -o "NotoSerifJP-Regular.otf" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/443711d6fab8072f7ec23cdd00f47e8f4d51aa71/Noto_Serif_JP/NotoSerifJP-Regular.otf \
  && curl -o "NotoSerifJP-Bold.otf" https://raw.githubusercontent.com/echamudi/jp-resources-mirror/443711d6fab8072f7ec23cdd00f47e8f4d51aa71/Noto_Serif_JP/NotoSerifJP-Bold.otf )
```

Build the database using Japanese-DB (https://github.com/ezhmd/japanese-db)

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
# Build Database, skip this if you already built japanese.db
yarn db-build

# Build Preload Asar
npx asar pack ./src/preload ./static/pre.asar

# Build Angular Asar
npx ng build --configuration="production"
npx asar pack ./static/ng-dist ./static/ng.asar
rm -rf ./static/ng-dist

# Build Angular App
yarn dist
```

## Testing

Automated Test

```
npx jest
```

After running the automated test, please do the manual test as listed in [this file](test/manual-testing.md).

## Authors

* **Ezzat Chamudi** - [echamudi](https://github.com/echamudi)

## Licenses

Copyright © 2020 Ezzat Chamudi

JMdict and JMnedict License http://www.edrdg.org/edrdg/licence.html.

Libraries, dependencies, and tools used in this project are tied with their own licenses respectively.
