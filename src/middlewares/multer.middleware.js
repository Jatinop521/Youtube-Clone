import multer from "multer"
// D:\Developer\BackEnd\VideoOrganizer\public\temp
// D:\Developer\BackEnd\VideoOrganizer\src\middlewares\multer.middleware.js
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const multerUpload = multer({ storage, })

export {multerUpload}