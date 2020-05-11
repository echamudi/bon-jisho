# Bon Jisho

A free Japanese dictionary based on electron.

(This app is still under initial development)

## Development

Currently, the app is only supported on mac.

### Building the Database

Before compiling the app, we need to build the database.
This project uses [Japanese DB Maker](https://github.com/ezhmd/japanese-db-maker). 

1. Put all the required materials (JMdict_e, JMnedict.xml, etc) inside `db-src` folder.

1. Run following script:
    ```sh
    npm run db-build
    ```

### Watch

1. Open two separate terminal windows.

2. Run following commands:

    ```sh
    # Terminal 1
    # This command will watch Angular code changes
    yarn ng-watch 

    # Terminal 2
    # This command will start Electron Webpack
    yarn dev
    ```

## Building

To build and package a single executable app, run following command:

```sh
ng build --configuration="production" && npm run make
```

## Authors

* **Ezzat Chamudi** - [ezhmd](https://github.com/ezhmd)

## Licenses

Copyright © 2020 Ezzat Chamudi

JMdict and JMnedict License http://www.edrdg.org/edrdg/licence.html.

Libraries, dependencies, and tools used in this project are tied with their own licenses respectively.
