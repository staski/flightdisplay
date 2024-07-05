# flight-display

flight-display is a Vue component to display any number of flight tracks in one Google map. The tracks can be filtered by year of flight. This component can be useful for creating an overview, where you have been in which year. A demo can be seen here: [https://flight-display.venus-flytrap.de](https://flight-display.venus-flytrap.de).

## Project Setup

You will need a valid google maps api key in order to use this component. See [https://developers.google.com/maps/documentation/javascript/get-api-key](https://developers.google.com/maps/documentation/javascript/get-api-key) on how to get such an API key. The API key has to be stored in a file 'mapsapikey.js'.   
```sh
git clone https://github.com/staski/flightdisplay.git cd flight-display
cd flight-display
npm install
cp <LOCATION OF YOU APIKEY>/mapsapikey.js src
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
