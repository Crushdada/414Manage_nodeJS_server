const fs = require("fs");
fs.stat("./node_modules", (err, data) => {
  if (err) {
    console.error("err!");
    return;
  }
  if (data.isDirectory()) {
    console.log("is directory");
  } else if (data.isFile()) {
    console.log("is file");
  }
});
