# fgapi

helper api for [filegilla](https://github.com/adam-gill/filegilla)

## dependencies
- imagemagick
- ffmpeg

## docker commands
- build = docker build -t fgapi . (git clone repo -> cd fgapi (before))
- docker run --rm -it --env-file ./.env -p 8000:8000 -v .:/app my-deno-app