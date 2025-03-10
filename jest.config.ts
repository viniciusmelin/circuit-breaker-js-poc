/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  collectCoverage: true,
  testMatch: ['**/*.spec.ts', '**/*.int-spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', './src/main.ts', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', './src/main.ts', '/dist/'],
};
