# bom-weather-transform

[![Build Status](https://travis-ci.org/tjdavey/bom-weather-transform.svg?branch=master)](https://travis-ci.org/tjdavey/bom-weather-transform)

A set of output transforms for the [bom-weather](https://github.com/tjdavey/bom-weather) module to provide useful native javascript representations of Australian Bureau of Meteorology data. This library normalises data, removing superfluous structures, converting dates and times appropriately.

## Usage

Distributions of `bom-weather` automatically transform output data using `bom-weather-transform`. If you would like to utilise a different version of `bom-weather-transform` with your installation of `bom-weather` you can do so as such:

```
import BomWeather from 'bom-weather';
import customBomWeatherTransform from `bom-weather-transform-custom`;

const weather = BomWeather({transforms: customBomWeatherTransform});
```

## Transforms

The module exports a series of transforms which can be automatically utilised by `bom-weather`. The following transform functions are available.

### `observations(apiResult: Object<BOMObsRawResult>)` - Coastal, Weather and Capital City Observations

Returns a BOMObsResult object ingesting a BOMObsRawResult object (A parsed representation of the BOM observation JSON) by transforming unix timestamps to Javascript dates, nullifying any fields which contain empty values, and normalising the `header` and `notice` properties.

## Running Tests

`bom-weather-transform` has a series of built-in tests to validate the expected output of data structures transformed. These also perform unit testing on individual functions of these transforms.

These tests can be run using:
```
npm test
```

## Custom Transforms

You can use this module as a base or template for building custom transformations for the `bom-weather` module.

