/* eslint-disable no-unused-vars */
// eslint-disable-next-line max-len
const axios = require("axios").default;
const ffmpeg = require("fluent-ffmpeg");
const installer = require("@ffmpeg-installer/ffmpeg");
const {createWriteStream} = require("fs");
const {dirname, resolve} = require("path");
const {removeFile} = require("./utils.js");

const path = require("path");

// eslint-disable-next-line require-jsdoc
function OggConverter() {
  ffmpeg.setFfmpegPath(installer.path);

  // eslint-disable-next-line require-jsdoc
  function toMp3(input, output) {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise((resolve, reject) => {
        ffmpeg(input)
            .inputOption("-t 30")
            .output(outputPath)
            .on("end", () => {
              removeFile(input);
              resolve(outputPath);
            })
            .on("error", (err) => reject(err.message))
            .run();
      });
    } catch (e) {
      console.log("Error while creating mp3", e.message);
    }
  }

  // eslint-disable-next-line require-jsdoc
  async function create(url, filename) {
    try {
      // eslint-disable-next-line max-len
      const oggPath = resolve(__dirname, "../voices", `${filename}.ogg`);
      const response = await axios({
        method: "get",
        url,
        responseType: "stream",
      });
      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on("finish", () => resolve(oggPath));
      });
    } catch (e) {
      console.log("Error while creating ogg", e.message);
    }
  }

  return {
    toMp3,
    create,
  };
}

// eslint-disable-next-line new-cap
module.exports = {ogg: OggConverter()};
