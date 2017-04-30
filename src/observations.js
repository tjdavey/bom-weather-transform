import _ from 'lodash';
import moment from 'moment';
import Joi from 'joi';

const observationsTransform = {
  /**
   * Schema to validate the data passed into transform looks like a BomObsResult
   */
  _INPUT_SCHEMA: Joi.object().keys({
    observations: Joi.object().keys({
      data: Joi.array().items(Joi.object()).required(),
      header: Joi.array().items(Joi.object()).required(),
      notice: Joi.array().items(Joi.object()).required()
    }).required()
  }),

  /**
   * Object configuring the transformations for the observation property of a BomObsResult
   */
  _OBSERVATION_TRANSFORMS: {
    notice({value}) {
      return _.first(value);
    },
    header({value}) {
      return _.first(value);
    },
    data({value}) {
      return value.map((dataEntry) => {
        return [
          this._nullifyMissingInEntry.bind(this),
          this._transformDatesInEntry.bind(this),
          this._stripFieldsFromEntry.bind(this)
        ].reduce((thisEntry, transformFn) => {
          return transformFn(thisEntry);
        }, dataEntry);
      });
    }
  },

  /**
   * Values treated as missing or null (but not a primitive null)
   * @type {Array<String>}
   */
  _NULLY_VALUES: ['-'],

  /**
   * Mapping of  transformed output property (key) and the raw API date fields they are transformed from (value).
   * @type {Object}
   */
  _DATE_FIELDS: {
    'aifstime_utc_js': 'aifstime_utc',
    'local_date_time_full_js': 'local_date_time_full'
  },

  /**
   * Date format of raw API date fields.
   * @type {String}
   */
  _DATE_FORMAT: 'YYYYMMDDHHmmss',

  /**
   * Fields to be completely stripped from the raw API format.
   */
  _STRIP_FIELDS: [
    'sort_order'
  ],

  /**
   * Turns any missing values in an observation data entry into primative nulls.
   * @param dataEntry {Object} A single object from an Observation data array.
   * @returns {Object} dataEntry with all missing values nullified.
   * @private
   */
  _nullifyMissingInEntry(dataEntry) {
    return _.mapValues(dataEntry, (dataEntryValue) => {
      if(!this._NULLY_VALUES.includes(dataEntryValue)) {
        return dataEntryValue
      }

      return null;
    });
  },

  /**
   * Transforms BOM date objects within an observation data entry to javascript date objects.
   * @param dataEntry {object}  A single object from an Observation data array.
   * @returns {Object} dataEntry with transformed dates.
   * @private
   */
  _transformDatesInEntry(dataEntry) {
    const dateDataEntry = _.mapValues(this._DATE_FIELDS, (sourceField) => moment(dataEntry[sourceField], this._DATE_FORMAT).toDate());
    return Object.assign({}, dataEntry, dateDataEntry);
  },

  /**
   * Remove any unnecessary fields from an individual data entry.
   * @param dataEntry {object}  A single object from an Observation data array.
   * @returns {Object} dataEntry without the unnecessary fields.
   * @private
   */
  _stripFieldsFromEntry(dataEntry) {
    return _.omit(dataEntry, this._STRIP_FIELDS);
  },

  /**
   * Transform a BomObsResult object into a BomTransformObsResult object.
   * @param apiResult {object<BomObsResult>}
   * @return {object<BomTransformObsResult>}
   */
  transform(apiResult) {
    Joi.assert(apiResult, this._INPUT_SCHEMA, 'You must pass transform a valid BomObsResult object.');

    const transformedData = {
      observations: _.mapValues(this._OBSERVATION_TRANSFORMS, (transformFn, key) => transformFn.apply(this, [{
        value: apiResult.observations[key]
      }]))
    }
    return Object.assign({}, apiResult, transformedData);
  }
}

export default observationsTransform;
export const transform = observationsTransform.transform.bind(observationsTransform);