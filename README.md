# Corona Virus Tracker

Showing count of confirmed COVID19 patient (infected, deaths and recovered) in regional or globally with pie chart and map support.

## Application Demo

<img src="https://github.com/iqbalsyamhad/corona-tracker/blob/master/apk/demo.gif?raw=true" width="250px">

## Built With

* [native-base](https://www.npmjs.com/package/native-base) - UI library for React Native
* [react-native-animated-loader](https://www.npmjs.com/package/react-native-animated-loader) - Loading view
* [react-native-maps](https://www.npmjs.com/package/react-native-maps) - Displaying maps and marker with callouts
* [react-native-svg-charts](https://www.npmjs.com/package/react-native-svg-charts) - Chart used

## API

```
http://coronavirus-tracker-api.herokuapp.com/
```

## Testing

Unit Testing for API with mock jest

## Download

<a href="https://github.com/iqbalsyamhad/corona-tracker/blob/master/apk/coronatracker.apk">Here</a> is debug apk.

## Disclaimer

This API always return 0 for recovered COVID19 patient during development, but this app tested with dummy data. And this app doesnt have pull to refresh because this app implement map to be background, other than that this app always fetch new data every user switch region.
