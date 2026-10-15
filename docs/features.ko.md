# Features

[English](features.md)

- [o] P1 — P1: 버전 0.0.1의 애플리케이션 plugin.
  - [o] P1.1 — P1: 시험·exposure·event·기록 검사, README, 체크리스트, 체인지로그를 가진 저장소.
  - [o] P1.2 — P1: page: 애플리케이션 sidecar가 공급하는 image region 하나, mount 때 설정 `program`의 프로그램을 연다, view의 pointer와 wheel event와 region의 키보드, input method, focus event를 embed 입력으로 보낸다, 애플리케이션의 cursor, caret, 상태를 반영한다, 오류는 오류 표시로 보고한다.
  - [o] P1.3 — P1: 웹 경로: 웹 주소인 프로그램은 document region에 보이고 sidecar를 시작하지 않는다.
- [o] P2 — P1: 첫 page 뒤의 수정.
  - [o] P2.1 — P1: plugin id는 core의 어떤 단어와도 겹치지 않는 `appview`이고, 모든 command, status, dom 항목, event가 그것을 쓴다.
  - [o] P2.2 — P1: workspace registry가 요구하는 저장소를 `package.json`이 이름한다.
  - [o] P2.3 — P1: host는 보이는 image region의 첫 frame 뒤에야 composition을 끝내므로, page는 composition을 만들기 전에 애플리케이션을 열고, 애플리케이션이 없으면 image region을 숨긴다.
- [o] P3 — P2: 프로그램의 인자.
  - [o] P3.1 — P2: 설정 `arguments`는 프로그램의 인자를 문자열의 JSON 배열로 가진다. 다른 값은 그것을 이름하는 오류다.
- [~] P4 — P2: 연결된 애플리케이션.
  - [o] P4.1 — P2: 설정 `program`의 값 `application:<id>`는 연결 plugin이 연결한 애플리케이션을 core 0.0.15의 `runtime.applications`가 기록한 경로로 시작한다. 연결되지 않은 id는 그것을 이름하는 오류이고, 아무것도 시작하지 않는다.
  - [ ] P4.2 — P2: core 0.0.15가 게시되면 `engines.soksak`과 core 0.0.15의 `@soksak/plugin-api`로 core 0.0.15를 요구하는 0.0.2를 release한다. 이것이 P4.2를 완료한다.
- [~] P5 — P1: 애플리케이션마다 plugin 하나: 각 연결 plugin은 자기 애플리케이션의 이름과 자기 surface를 가지고, 이 plugin은 자기 surface 대신 extension point `appview.surface`의 공유 module `surface`로 embed page를 준다.
  - [o] P5.1 — P1: `ui/appview.js`가 `mount(root, context, { application })`을 내보낸다. 그것은 그 id의 연결된 애플리케이션을 연결 plugin composition의 image region `view`에서 시작하고, status, 명령, dom 항목, event는 그 plugin의 id로 이름한다. 설정 `program`, 웹 경로, 문서 region은 없어지고, manifest는 module `surface`, `input`, `events`를 가진 `extends.surface`만 선언한다.
  - [ ] P5.2 — P1: surface 없는 제공자를 받는 core 0.0.15의 `@soksak/plugin-api`로 0.0.2를 release한다. 이것이 P4.2를 완료한다.
- [o] P6 — P2: release 경로: release workflow가 tag마다 core의 sok로 plugin을 묶고, ci workflow가 `make test`와 commit message 검사를 실행한다.
