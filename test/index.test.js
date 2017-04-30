import transforms from '../src/index';
import JasmineExpect from 'jasmine-expect'; //eslint-disable-line no-unused-vars

describe('Transform Exports', () => {
  const EXPECTED_TRANSFORM_KEYS = [
    'observations'
  ];

  test('should export an object', () => {
    expect(transforms).toBeObject();
  });

  EXPECTED_TRANSFORM_KEYS.forEach((transform) => {
    describe(`${transform} transform key`, () => {
      test('should export a property for this transform key', () => {
        expect(transforms[transform]).toBeDefined();
      });

      test('should export a a transform function for this transform key', () => {
        expect(transforms[transform]).toBeFunction();
      });
    });
  });
});
