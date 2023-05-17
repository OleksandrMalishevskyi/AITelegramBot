const {unlink} = require("fs").promises;

// eslint-disable-next-line require-jsdoc
async function removeFile(path) {
  try {
    await unlink(path);
  } catch (e) {
    console.log("Error while removing file", e.message);
  }
}

module.exports = {removeFile};
