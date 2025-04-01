# Changelog

## [0.4.0](https://github.com/uFloppyDisk/create-cssharp-plugin/compare/v0.3.1...v0.4.0) (2025-04-01)


### Features

* add author/description/initialVersion flags; ([0e632e0](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/0e632e0923826189bc009b13ce95697937b66320))
* add forced/preanswered interactive mode flags; ([ed16060](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/ed160604a42c143b56377d68999624b5b6b7b1fc))
* add git init step; ([bca2a50](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/bca2a503209826abfda1d558509de5e83143168d))
* allow skip prompts for setup tasks with flag; ([0c21829](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/0c2182935cf952c55db7d54e45cd3afb53b0ebf0))
* ingest cli args and options; ([375ac73](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/375ac739e397f21b0187dea54cbe31d19fa8a831))
* merge cli args into prompt initial values; ([9f71787](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/9f71787ad834d3354b0c2bb516ca1100c1a521b6))
* override prompts with cli args; ([32a21e5](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/32a21e54d1a41207cafcc072407aa84ec1c52e1b))
* validate args and options; ([9af1002](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/9af1002b1b4eb68199128f773706b32ab1ebecb7))


### Bug Fixes

* **cli:** accept string for pluginName flag; ([1f6b824](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/1f6b824a2673e1e741d04d8ee56c8229ffb30d3d))
* **cli:** skip prompts only when required args are set; ([abc9691](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/abc96914830a4908e1950b7b54246e1f67c4adf6))
* pluginName option implies pluginSameName is false; ([1e7cc71](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/1e7cc71fcebe1abb6c5c5885b6752ce00ce895d9))
* prompt preanswer regression when no args passed; ([5a8b508](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/5a8b50889f0b9c80737fa8de52e17319a4ae457f))
* validate positional arguments; ([4eaad64](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/4eaad648bec6d676be18187870541fdccffef299))

## [0.3.1](https://github.com/uFloppyDisk/create-cssharp-plugin/compare/v0.3.0...v0.3.1) (2025-02-25)


### Bug Fixes

* ignore project-level build directories; ([bcfe972](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/bcfe972c8cca1ee96e19f993abe18a3360c2b751))

## [0.3.0](https://github.com/uFloppyDisk/create-cssharp-plugin/compare/v0.2.1...v0.3.0) (2025-02-23)


### Features

* allow paths in containing directory prompt; ([8fa744a](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/8fa744a0cf83f7ea940689ca8777a742ea936749))
* build/publish to project-level directory; ([5efe0cf](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/5efe0cf1efbc9fe96371ee2a188062fe0192766e))

## [0.2.1](https://github.com/uFloppyDisk/create-cssharp-plugin/compare/v0.2.0...v0.2.1) (2025-02-21)


### Bug Fixes

* template .gitignore not packaged by npm; ([af8d681](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/af8d681dc80813b2dbbe975295bffabc550e734d))

## [0.2.0](https://github.com/uFloppyDisk/create-cssharp-plugin/compare/v0.1.0...v0.2.0) (2025-02-21)


### Features

* add bug report CTA; ([571dc1d](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/571dc1d47ab1cd8319930b09708cddd84700fc3e))
* add plugin template readme; ([9ebc440](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/9ebc4400f17f21bb1b02f90b1d53bc78f98225aa))


### Bug Fixes

* four-space indenting in .cs files; ([17266f5](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/17266f5cd4cd99f13d523e566aafd39c21e30ba4))

## [0.1.0](https://github.com/uFloppyDisk/create-cssharp-plugin/compare/0.0.2...v0.1.0) (2025-02-19)


### Features

* add github repo contribution CTA; ([a0e9749](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/a0e9749e581fdf33de9fde158f85b7a100f40609))
* show CLI name and version under header; ([9fe95ee](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/9fe95eefe24ec17166e4b6fbbda65a3269300ea2))
* spinners for async tasks; ([#7](https://github.com/uFloppyDisk/create-cssharp-plugin/issues/7)) ([eb6a025](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/eb6a02559b1331a62a74d77def95d22c5e8a6ed4))


### Bug Fixes

* remove newline above header; ([add1cc2](https://github.com/uFloppyDisk/create-cssharp-plugin/commit/add1cc2fc83e642cd47abf46d7722dd599be6f29))
