import { Context } from "@oak/oak";
import { getFileCategory } from "../util/helpers/fileUtils.ts";
import {
  imgToImg,
  pdfToImg,
  videoToImg,
} from "../util/conversions/fileConversions.ts";
import { supportedFileTypes } from "../util/types/fileProcessingTypes.ts";

export const generatePreviewImage = async (ctx: Context) => {
  try {
    const body = ctx.request.body;

    if (body.type() !== "form-data") {
      ctx.response.status = 400;
      ctx.response.body = { error: "Expected multipart/form-data" };
      return;
    }

    const formData = await body.formData();
    const fileEntry = formData.get("file");

    if (!fileEntry) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No file provided" };
      return;
    }

    if (typeof fileEntry === "string") {
      ctx.response.status = 400;
      ctx.response.body = { error: "Expected file, got string" };
      return;
    }

    const file = fileEntry as File;
    const fileName = file.name;
    const fileSize = file.size;
    const fileCategory = getFileCategory(file.type, file.name);
    console.log("file type: ", file.type);

    console.log(
      `Processing file: ${fileName} (${fileCategory}), Size: ${fileSize} bytes`
    );

    if (fileCategory === "image") {
      await imgToImg(file, ctx);
    } else if (fileCategory === "video") {
      await videoToImg(file, ctx);
    } else if (fileCategory === "pdf") {
      await pdfToImg(file, ctx);
    } else {
      ctx.response.status = 405;
      ctx.response.body = {
        message: "Unsupported file received",
        supportedFileTypes: supportedFileTypes,
      };
    }
  } catch (error) {
    console.error("Error in generatePreviewImage:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: `Failed to process file upload: ${error}` };
  }
};
