import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest';

import { compilerOptions } from "./tsconfig.json";

const tsJestTransformOptions = {
  diagnostics: {
    ignoreCodes: [1343]
  },
  astTransformers: {
    before: [
      {
        path: 'ts-jest-mock-import-meta',
        options: { metaObjectReplacement: { url: `file://${__dirname}/` } }
      }
    ]
  }
};

const config: JestConfigWithTsJest = {
  coverageProvider: "v8",
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>" }),
  modulePaths: ['<rootDir>'],

  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", tsJestTransformOptions],
  },
  collectCoverageFrom: [
    "src/**"
  ],
};

export default config;
