FROM denoland/deno

WORKDIR /app

ENV PORT=8080

EXPOSE ${PORT}

COPY . .

RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg imagemagick ghostscript && \
    rm -rf /var/lib/apt/lists/*

CMD ["deno", "task", "prod"]
