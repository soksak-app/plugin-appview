# Changelog

[English](CHANGELOG.md)

## Unreleased

- P1.3: http나 https 주소인 프로그램은 카드의 document region `page`에 보이고, image region은 숨으며 sidecar는 시작하지 않는다. 경로인 프로그램은 document region을 숨긴다. Red: page 시험 10개 중 2개가 실패했다. Green: 10개 중 10개.
- P1.2: page가 설정 `program`의 프로그램을 애플리케이션 sidecar에서 열고, view의 pointer와 wheel event와 image region의 키보드, input method, focus event를 region의 point 단위 embed 입력으로 보내며, 애플리케이션의 cursor, caret, 상태를 반영하고, 없는 프로그램과 sidecar나 host의 모든 오류를 보고한다. Red: 모듈 없이 page 시험이 실패했다. Green: 6개 중 6개.
- P1.1: 애플리케이션 plugin 저장소가 시험·exposure·event·기록 검사, README, 체크리스트, 이 체인지로그를 가지고 버전 0.0.1로 시작한다.
