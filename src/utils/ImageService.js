const { envConfig } = require("../config/config");
import { Buffer } from "buffer";
const BUCKET_NAME = envConfig.BUCKET_NAME;

if (!BUCKET_NAME) {
  console.error("BUCKET_NAME is not defined in envConfig.");
}

const s3Url = `https://${BUCKET_NAME}.s3.eu-west-2.amazonaws.com/`;
const serviceUrl = "https://img.zoul.app/";

const encodeToBase64 = (input) => {
  return Buffer.from(input, "utf-8").toString("base64");
};

export const getTransformedUrl = (path) => {
  if (path && typeof path === "string" && path?.startsWith(s3Url)) {
    const urlObject = JSON.stringify({
      bucket: BUCKET_NAME,
      key: path.replace(s3Url, ""),
      edits: {
        resize: {
          width: 600,
        },
      },
    });
    const url = `${serviceUrl}${encodeToBase64(urlObject)}`;
    return url;
  }
  return path;
};
