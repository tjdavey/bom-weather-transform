import _ from 'lodash';
import moment from 'moment';
import JasmineExpect from 'jasmine-expect'; //eslint-disable-line no-unused-vars

import observationsTransforms from '../src/observations';

describe('Observation Transforms', () => {

  function getDataEntry(observationsApiResult) {
    return _.first(observationsApiResult.observations.data);
  }

  const observationsApiResult = require('./assets/observations.asset.input.json');
  const observationDataEntry = getDataEntry(observationsApiResult);

  describe('_nullifyMissingInEntry', () => {
    test('should not modify source object', () => {
      const transformedDataEntry = observationsTransforms._nullifyMissingInEntry(observationDataEntry);
      expect(transformedDataEntry).not.toBe(observationDataEntry);
    });

    observationsTransforms._NULLY_VALUES.forEach((nullyValue) => {
      test(`should set all ${nullyValue} values to null in a data entry`, () => {
        // Extract the value keys and validate there are values in the source asset to transform.
        const valuePropertyKeys = Object.keys(_.pickBy(observationDataEntry, (value) => value === nullyValue));
        expect(valuePropertyKeys).not.toHaveLength(0);

        // Transform and validate
        const transformedDataEntry = observationsTransforms._nullifyMissingInEntry(observationDataEntry);
        valuePropertyKeys.forEach((valuePropertyKey) => {
          expect(transformedDataEntry[valuePropertyKey]).toBeNull();
        });
      });
    });
  });

  describe('_transformDatesInEntry', () => {
    test('should not modify source object', () => {
      const transformedDataEntry = observationsTransforms._transformDatesInEntry(observationDataEntry);
      expect(transformedDataEntry).not.toBe(observationDataEntry);
    });

    _.forOwn(observationsTransforms._DATE_FIELDS, (inputField, outputField) => {
      test(`should transform ${inputField} value to a valid date in ${outputField} in a data entry`, () => {
        // Transform and validate
        const transformedDataEntry = observationsTransforms._transformDatesInEntry(observationDataEntry);
        const transformedDate = moment(observationDataEntry[inputField], observationsTransforms._DATE_FORMAT).toDate();
        expect(transformedDataEntry[outputField]).toBeValidDate();
        expect(transformedDataEntry[outputField]).toEqual(transformedDate);
      });
    });
  });

  describe('_stripFieldsFromEntry', () => {
    test('should not modify source object', () => {
      const transformedDataEntry = observationsTransforms._stripFieldsFromEntry(observationDataEntry);
      expect(transformedDataEntry).not.toBe(observationDataEntry);
    });

    observationsTransforms._STRIP_FIELDS.forEach((stripField) => {
      test(`should strip ${stripField} property from a data entry`, () => {
        // Transform and validate
        const transformedDataEntry = observationsTransforms._stripFieldsFromEntry(observationDataEntry);
        expect(transformedDataEntry[stripField]).not.toBeDefined();
      });
    });
  });

  describe('transform', () => {
    test('should not modify source object', () => {
      const transformedApiResult = observationsTransforms.transform(observationsApiResult);
      expect(transformedApiResult).not.toBe(observationsApiResult);
    });

    test('should transform data to the expected format', () => {
      const expectedTransformedApiResult = require('./assets/observations.asset.output.js').default;
      const transformedApiResult = observationsTransforms.transform(observationsApiResult);
      expect(transformedApiResult).toEqual(expectedTransformedApiResult);
    });

    test('should error if passed an invalid data structure', () => {
      expect(observationsTransforms.transform.bind(observationsTransforms, {}))
        .toThrowError(/You must pass transform a valid BomObsResult object/);
    });
  });
});
