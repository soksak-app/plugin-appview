# Changelog

[한국어](CHANGELOG.ko.md)

## Unreleased

- P2.1: the plugin id is `appview` and the package is `@soksak/plugin-appview`, because the id `app` is a word of the sources of core, whose boundary check refuses a source that names a declared plugin; every command, status, dom entry and event is renamed with it.
- P1.3: a program that is an http or https address is shown in the document region `page` of the card, the image region is hidden and no sidecar starts; a program that is a path hides the document region. Red: 2 of 10 page tests failed. Green: 10 of 10.
- P1.2: the page opens the program of the setting `program` in the application sidecar, sends pointer and wheel events of the view and keyboard, input method and focus events of its image region as embed input in points of the region, applies the cursor, caret and state of the application, and reports a missing program and every error of the sidecar or the host. Red: the page tests failed without the module. Green: 6 of 6.
- P1.1: the application plugin repository starts at version 0.0.1 with its test, exposure, event and record checks, a README, its checklist and this changelog.
