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
