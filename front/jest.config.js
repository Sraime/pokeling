module.exports = {
    globals: {
      'ts-jest': {
        tsConfig: '<rootDir>/src/tsconfig.spec.json'
      }
    },

    preset: "jest-preset-angular",

    snapshotSerializers: [
      "jest-preset-angular/AngularNoNgAttributesSnapshotSerializer.js",
      "jest-preset-angular/AngularSnapshotSerializer.js",
      "jest-preset-angular/HTMLCommentSerializer.js"
    ],

    moduleNameMapper: {
      "\\.(jpg|jpeg|png)$": "<rootDir>/__mocks__/image.js",
      "^@lib/(.*)$": "<rootDir>/src/lib/$1"
    }
}