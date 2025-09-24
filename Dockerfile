FROM denoland/deno

WORKDIR /app

ENV PORT=8080

EXPOSE ${PORT}

COPY . .

RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg imagemagick && \
    rm -rf /var/lib/apt/lists/*

CMD ["deno", "run", "--allow-net", "--allow-run", "--allow-read", "--allow-write", "src/main.ts"]
