const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/upload/',
    filename: function(req, file, cb) {
        cb(null,file.fieldname + '-' + Date.now() +
        path.extname(file.originalname))
    }
})


//  initialize Upload
const upload = multer({
    storage: storage,
    limit:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).single('myimage')


// check file
function checkFileType(file, cb){
    // allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname
    (file.originalname).toLowerCase())
    // check mime
    const mimetype = filetypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null, true)
    } else {
        cb('Error: Image Only')
    }

}


const app = express()

app.set('view engine', 'ejs')

// public folder for css and other 
app.use(express.static('./public'))


app.get('/', (req,res) => res.render('index'))

app.post('/upload', (req,res) => {
    upload(req, res, (err) => {
        if(err) {
            res.render('index', {
                msg: err
            })
        } else {
           if(req.file == undefined){
            res.render('index', {
                msg: 'Error: No file selected'
            })
           } else {
            res.render('index', {
                msg: 'File Uploaded!',
                file: `upload/${req.file.filename}`
            })
           }
        }
    })
})

const port = 3300;

app.listen(port, () => {
    console.log(`Server is on port http://localhost:${port}`)
})