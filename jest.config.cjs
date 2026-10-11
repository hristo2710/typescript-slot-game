
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'Node',
          target: 'ES2022',
          esModuleInterop: true,
          verbatimModuleSyntax: false,
        },
      },
    ],
  },
};
