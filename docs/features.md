# Features

[한국어](features.ko.md)

- [o] P1 — P1: The application plugin at version 0.0.1.
  - [o] P1.1 — P1: The repository with its test, exposure, event and record checks, a README, a checklist and a changelog.
  - [o] P1.2 — P1: The page: one image region supplied by the application sidecar, the program of the setting `program` opened at mount, pointer and wheel events of the view and keyboard, input method and focus events of the region sent as embed input, the cursor, caret and state of the application applied, and errors reported through the display of errors.
  - [o] P1.3 — P1: The web path: a program that is a web address is shown in a document region, and no sidecar starts.
- [o] P2 — P1: Corrections after the first page.
  - [o] P2.1 — P1: The plugin id is `appview`, which names no word of core, and every command, status, dom entry and event uses it.
  - [o] P2.2 — P1: `package.json` names its repository, which the workspace registry requires.
  - [o] P2.3 — P1: The page opens the application before it creates the composition, and hides the image region without an application, because the host finishes the composition only after the first frame of a shown image region.
- [o] P3 — P2: Arguments of the program.
  - [o] P3.1 — P2: The setting `arguments` holds the arguments of the program as a JSON array of strings; another value is an error that names it.
- [~] P4 — P2: Connected applications.
  - [o] P4.1 — P2: The setting `program` value `application:<id>` starts the application that a connector plugin connected, from the path that `runtime.applications` of core 0.0.15 records; an id that is not connected is an error that names it, and nothing starts.
  - [ ] P4.2 — P2: Release 0.0.2 that requires core 0.0.15 through `engines.soksak` and `@soksak/plugin-api` of core 0.0.15 once core 0.0.15 is published.
