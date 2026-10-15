# Changelog

[English](CHANGELOG.md)

## Unreleased

- P3.1: 설정 `arguments`가 프로그램의 인자를 문자열의 JSON 배열로 가지고, 그 인자는 command에서 프로그램 뒤에 오므로 애플리케이션이 시작할 때 프로젝트나 파일을 연다. 그런 배열이 아닌 값은 그것을 이름하는 오류이고 아무것도 시작하지 않는다. Red: 인자가 넘어가지 않았고 잘못된 값이 보고되지 않았다. Green: 12개 중 12개.
- P2.3: page가 composition을 만들기 전에 sidecar를 구독하고 애플리케이션을 열며, 애플리케이션이 정해지지 않으면 image region을 숨긴다. 입력: host는 보이는 image region의 첫 frame 뒤에야 composition을 끝내는데 page는 composition 뒤에야 애플리케이션을 열었으므로, frame이 오지 않아 관문 검사에서 10초 뒤 present가 실패했다. Red: composition.create 전에 open이 가지 않았다. Green: 10개 중 10개.
- P2.2: workspace registry가 모든 release에서 읽는 저장소를 `package.json`이 이름한다.
- P2.1: id `app`은 core 소스의 단어이고 core의 boundary 검사는 선언된 plugin을 이름하는 소스를 거부하므로, plugin id는 `appview`, package는 `@soksak/plugin-appview`다. 모든 command, status, dom 항목, event가 함께 바뀐다.
- P1.3: http나 https 주소인 프로그램은 카드의 document region `page`에 보이고, image region은 숨으며 sidecar는 시작하지 않는다. 경로인 프로그램은 document region을 숨긴다. Red: page 시험 10개 중 2개가 실패했다. Green: 10개 중 10개.
- P1.2: page가 설정 `program`의 프로그램을 애플리케이션 sidecar에서 열고, view의 pointer와 wheel event와 image region의 키보드, input method, focus event를 region의 point 단위 embed 입력으로 보내며, 애플리케이션의 cursor, caret, 상태를 반영하고, 없는 프로그램과 sidecar나 host의 모든 오류를 보고한다. Red: 모듈 없이 page 시험이 실패했다. Green: 6개 중 6개.
- P1.1: 애플리케이션 plugin 저장소가 시험·exposure·event·기록 검사, README, 체크리스트, 이 체인지로그를 가지고 버전 0.0.1로 시작한다.
