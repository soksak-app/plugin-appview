# Changelog

[한국어](CHANGELOG.ko.md)

## Unreleased

- P3.1: the setting `arguments` holds the arguments of the program as a JSON array of strings, which follow the program in the command, so an application opens a project or a file at its start; a value that is not such an array is an error that names it, and nothing starts. Red: the arguments were not passed and an invalid value was not reported. Green: 12 of 12.
- P2.3: the page subscribes to the sidecar and opens the application before it creates the composition, and hides the image region when no application is chosen. Input: the host finishes the composition only after the first frame of a shown image region, and the page opened the application only after the composition, so no frame came and the presentation failed after 10 seconds in the gate check. Red: open was not sent before composition.create. Green: 10 of 10.
- P2.2: `package.json` names its repository, which the workspace registry reads for every release.
- P2.1: the plugin id is `appview` and the package is `@soksak/plugin-appview`, because the id `app` is a word of the sources of core, whose boundary check refuses a source that names a declared plugin; every command, status, dom entry and event is renamed with it.
- P1.3: a program that is an http or https address is shown in the document region `page` of the card, the image region is hidden and no sidecar starts; a program that is a path hides the document region. Red: 2 of 10 page tests failed. Green: 10 of 10.
- P1.2: the page opens the program of the setting `program` in the application sidecar, sends pointer and wheel events of the view and keyboard, input method and focus events of its image region as embed input in points of the region, applies the cursor, caret and state of the application, and reports a missing program and every error of the sidecar or the host. Red: the page tests failed without the module. Green: 6 of 6.
- P1.1: the application plugin repository starts at version 0.0.1 with its test, exposure, event and record checks, a README, its checklist and this changelog.
