# Changelog

[English](CHANGELOG.md)

## 0.0.2

- P5.2: core 0.0.15를 요구하고 공유 embed page를 주는 버전 0.0.2. P4.2를 완료한다.
- P6: release workflow가 tag마다 core 0.0.15의 sok로 plugin을 묶고, ci workflow가 시험과 commit message 검사를 실행한다. Green: `make pack`이 plugin release를 만들었다.
- P5.1: page가 extension point `appview.surface`의 공유 module `surface`다. `mount(root, context, { application })`이 그 id의 연결된 애플리케이션을 연결 plugin의 composition에서 그 plugin의 이름으로 시작한다. 설정 `program`, 웹 경로, 문서 region은 없어지고, plugin은 자기 surface를 가지지 않는다. Red: plugin-api 0.0.14에서 manifest 검사가 surface 없는 제공자를 거부했다. Green: plugin-api 0.0.15로 10개 중 10개. core의 연결 창 검사가 두 host에서 그 module을 import하는 연결 plugin을 열었다.
- P4.1: 설정 `program`의 값 `application:<id>`는 연결 plugin이 연결한 애플리케이션을 `runtime.applications`가 기록한 경로로 시작한다. 연결되지 않은 id는 그것을 이름하는 오류이고 아무것도 시작하지 않는다. Red: page가 `application:sketcher`를 프로그램으로 보냈고, 연결되지 않은 id에 오류를 보고하지 않았다. Green: 14개 중 14개.
- P3.1: 설정 `arguments`가 프로그램의 인자를 문자열의 JSON 배열로 가지고, 그 인자는 command에서 프로그램 뒤에 오므로 애플리케이션이 시작할 때 프로젝트나 파일을 연다. 그런 배열이 아닌 값은 그것을 이름하는 오류이고 아무것도 시작하지 않는다. Red: 인자가 넘어가지 않았고 잘못된 값이 보고되지 않았다. Green: 12개 중 12개.
- P2.3: page가 composition을 만들기 전에 sidecar를 구독하고 애플리케이션을 열며, 애플리케이션이 정해지지 않으면 image region을 숨긴다. 입력: host는 보이는 image region의 첫 frame 뒤에야 composition을 끝내는데 page는 composition 뒤에야 애플리케이션을 열었으므로, frame이 오지 않아 관문 검사에서 10초 뒤 present가 실패했다. Red: composition.create 전에 open이 가지 않았다. Green: 10개 중 10개.
- P2.2: workspace registry가 모든 release에서 읽는 저장소를 `package.json`이 이름한다.
- P2.1: id `app`은 core 소스의 단어이고 core의 boundary 검사는 선언된 plugin을 이름하는 소스를 거부하므로, plugin id는 `appview`, package는 `@soksak/plugin-appview`다. 모든 command, status, dom 항목, event가 함께 바뀐다.
- P1.3: http나 https 주소인 프로그램은 카드의 document region `page`에 보이고, image region은 숨으며 sidecar는 시작하지 않는다. 경로인 프로그램은 document region을 숨긴다. Red: page 시험 10개 중 2개가 실패했다. Green: 10개 중 10개.
- P1.2: page가 설정 `program`의 프로그램을 애플리케이션 sidecar에서 열고, view의 pointer와 wheel event와 image region의 키보드, input method, focus event를 region의 point 단위 embed 입력으로 보내며, 애플리케이션의 cursor, caret, 상태를 반영하고, 없는 프로그램과 sidecar나 host의 모든 오류를 보고한다. Red: 모듈 없이 page 시험이 실패했다. Green: 6개 중 6개.
- P1.1: 애플리케이션 plugin 저장소가 시험·exposure·event·기록 검사, README, 체크리스트, 이 체인지로그를 가지고 버전 0.0.1로 시작한다.
