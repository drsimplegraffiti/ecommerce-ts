const multer = require("multer");
const path = require("path");

//multer config

export const upload= multer({
  storage: multer.diskStorage({}),
  fileFilter: (req:any, file:any, cb:any) => {
    let ext = path.extname(file.originalname);
    if (ext != ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return
    }
    cb(null, true);
  },
});
