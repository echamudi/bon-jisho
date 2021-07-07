# Bon Jisho

<img src="https://raw.githubusercontent.com/echamudi/bon-jisho/master/ng-src/assets/bon-jisho-logo.svg" alt="Bon Jisho Logo" height="100" width="100">

An open source Japanese dictionary desktop app based on electron.

## Development

Currently, the app is only supported on mac.

### Download and Install Dependencies

```sh
yarn
npx electron-builder install-app-deps

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

# Build the database using Japanese-DB (https://github.com/ezhmd/japanese-db)
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
