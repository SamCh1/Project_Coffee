const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

//Cloudinary
cloudinary.config({
    cloud_name: 'dt7opubpk',
    api_key: '427913698997955',
    api_secret: 'w9aER4EejmoV-4146JVtyDwJlb4',
});
//end Cloudinary

module.exports.uploadSingle = (req, res, next) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            req.body[req.file.fieldname] = result.url;
            next();
        }
        upload(req);
    } else {
        next();
    }
};