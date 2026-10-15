# Application plugin

A surface that shows an application inside a soksak card: the application draws into shared buffers through the embed kit, the application sidecar hands its frames to the image region of the card, and the card passes its pointer, wheel, keyboard and input method events to the application.

- [Checklist](docs/features.md)
- [Changelog](CHANGELOG.md)

```sh
make hooks
make test
```
