import { Context } from "@oak/oak";

export const imgToImg = async (file: File, ctx: Context) => {
  try {
    const fileName = file.name;
    const fileBuffer = await file.arrayBuffer();
    const inputData = new Uint8Array(fileBuffer);

    console.log(`Processing image in memory: ${fileName}`);

    const magickCommand = new Deno.Command("magick", {
      args: [
        "-",
        "-resize",
        "1200x800>",
        "-quality",
        "85",
        "-define",
        "webp:method=4",
        "webp:-",
      ],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });

    const process = magickCommand.spawn();

    const writer = process.stdin.getWriter();
    await writer.write(inputData);
    await writer.close();

    const { code, stdout, stderr } = await process.output();

    if (code !== 0) {
      const errorMsg = new TextDecoder().decode(stderr);
      console.error("ImageMagick error:", errorMsg);
      throw new Error(`ImageMagick failed: ${errorMsg}`);
    }

    const outputData = stdout;
    console.log(
      `WebP conversion successful. Output size: ${outputData.length} bytes`
    );

    const baseFileName = fileName.replace(/\.[^/.]+$/, "");
    const outputFileName = `preview-${baseFileName}.webp`;

    ctx.response.status = 200;
    ctx.response.headers.set("Content-Type", "image/webp");
    ctx.response.headers.set(
      "Content-Disposition",
      `inline; filename="${outputFileName}"`
    );
    ctx.response.body = outputData;
  } catch (error) {
    console.error("ImageMagick processing error:", error);
    throw new Error(`ImageMagick processing error: ${error}`);
  }
};

async function runCommandWithInput(
  cmd: string,
  args: string[],
  inputBuffer: Uint8Array
): Promise<Uint8Array> {
  const command = new Deno.Command(cmd, {
    args,
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  const process = command.spawn();

  const stdinPromise = (async () => {
    try {
      const writer = process.stdin.getWriter();
      await writer.write(inputBuffer);
      await writer.close();
    } catch {
      console.warn("");
    }
  })();

  const { code, stdout, stderr } = await process.output();

  await stdinPromise;

  if (code !== 0) {
    const errorDetails = new TextDecoder().decode(stderr);
    console.error(
      `Error executing '${cmd}':`,
      errorDetails || "No stderr output."
    );
    throw new Error(
      `'${cmd}' exited with code ${code}. Details: ${errorDetails}`
    );
  }

  return stdout;
}

export const videoToImg = async (file: File, ctx: Context) => {
  try {
    const fileName = file.name;
    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    console.log(`Processing video in memory: ${fileName}`);

    let duration = 0;
    try {
      const ffprobeArgs = [
        "-v",
        "error", // Only log errors
        "-show_entries",
        "format=duration", // Show only the duration
        "-of",
        "default=noprint_wrappers=1:nokey=1", // Format output to be just the value
        "-i",
        "-", // Read input from stdin
      ];
      const probeOutputBytes = await runCommandWithInput(
        "ffprobe",
        ffprobeArgs,
        fileBuffer
      );
      const probeOutput = new TextDecoder().decode(probeOutputBytes).trim();
      duration = parseFloat(probeOutput) || 0; // Default to 0 if parsing fails
    } catch (probeErr) {
      console.warn("ffprobe failed, falling back to 0s duration.", probeErr);
    }

    const seekTime = duration > 0 ? Math.min(3, duration * 0.08) : 0;
    console.log(
      `Video duration: ${duration.toFixed(
        2
      )}s, extracting frame at: ${seekTime.toFixed(2)}s`
    );

    const ffmpegArgs = [
      "-ss",
      seekTime.toFixed(4), // Seek to the calculated time
      "-i",
      "-", // Input from stdin
      "-vframes",
      "1", // Extract exactly one frame
      // Filter to scale down to 800x800 max, preserving aspect ratio
      "-vf",
      "scale='min(1200,iw)':min'(630,ih)':force_original_aspect_ratio=decrease",
      "-f",
      "webp", // Set the output format to WebP
      "-quality",
      "85", // Set WebP quality (0-100)
      "-", // Output to stdout
    ];
    const webpData = await runCommandWithInput(
      "ffmpeg",
      ffmpegArgs,
      fileBuffer
    );

    if (!webpData || webpData.length === 0) {
      throw new Error("ffmpeg produced empty output when generating WebP.");
    }
    console.log(
      `WebP conversion successful. Output size: ${webpData.length} bytes`
    );

    const baseFileName = fileName.replace(/\.[^/.]+$/, "");
    const outputFileName = `preview-${baseFileName}.webp`;

    ctx.response.status = 200;
    ctx.response.headers.set("Content-Type", "image/webp");
    ctx.response.headers.set(
      "Content-Disposition",
      `inline; filename="${outputFileName}"`
    );
    ctx.response.body = webpData;
  } catch (error) {
    console.error("Video processing failed:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Failed to process video.",
      details: error,
    };
  }
};

export const pdfToImg = async (file: File, ctx: Context) => {
  try {
    const fileName = file.name;
    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    console.log(`Processing PDF in memory: ${fileName}`);

    const magickArgs = [
      "pdf:-[0]", // Read PDF from stdin (-), select the first page ([0])
      "-background",
      "white", // Set a background color
      "-alpha",
      "remove", // Remove any alpha channel to prevent transparency issues
      "-alpha",
      "off",
      "-quality",
      "95", // Set WebP quality
      "-resize",
      "1200x630>", // Resize to fit within 1200x630, preserving aspect ratio
      "webp:-", // Output WebP format to stdout (-)
    ];
    const webpData = await runCommandWithInput(
      "magick",
      magickArgs,
      fileBuffer
    );

    if (!webpData || webpData.length === 0) {
      throw new Error("ImageMagick produced empty output when converting PDF.");
    }
    console.log(
      `PDF to WebP conversion successful. Output size: ${webpData.length} bytes`
    );

    const baseFileName = fileName.replace(/\.[^/.]+$/, "");
    const outputFileName = `preview-${baseFileName}.webp`;

    ctx.response.status = 200;
    ctx.response.headers.set("Content-Type", "image/webp");
    ctx.response.headers.set(
      "Content-Disposition",
      `inline; filename="${outputFileName}"`
    );
    ctx.response.body = webpData;
  } catch (error) {
    console.error("PDF processing failed:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Failed to process PDF.",
      details: error,
    };
  }
};
