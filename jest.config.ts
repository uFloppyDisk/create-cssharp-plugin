import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest';

import { compilerOptions } from "./tsconfig.json";

const config: JestConfigWithTsJest = {
  coverageProvider: "v8",
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>" }),
  modulePaths: ['<rootDir>'],

  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", {}],
  },
};

export default config;
