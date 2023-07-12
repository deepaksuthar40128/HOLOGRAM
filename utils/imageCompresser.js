import sharp from "sharp";
import AWS from "aws-sdk"
import dotenv from "dotenv"
dotenv.config({ path: ".env" });
import multer from "multer";
import multerS3 from "multer-s3"

const s3 = new AWS.S3({
    accessKeyId: process.env.AWSKEY,
    secretAccessKey: process.env.AWSPASSWORD,
    region: 'us-west-2'
});

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'mydbms',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    })
})
const calculateImageDimensions = async (buffer) => {
    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();
        const orientation = metadata.orientation || 1;
        let { width, height } = metadata;
        if (orientation >= 5 && orientation <= 8) {
            [width, height] = [height, width];
        }
        return [width, height];
    } catch (error) {
        //console.error('Error calculating image dimensions:', error);
        throw error;
    }
};
export const compressAndOverwrite = async (req, res, next, imgquality, imgmaintaineRatio, imgheight, imgwidth, imgmaxWidth) => {
    if (req.file) {
        try {
            const fileData = await s3.getObject({ Bucket: 'mydbms', Key: req.file.key }).promise();
            const maxWidth = imgmaxWidth;
            let targetWidth = imgwidth, targetHeight = imgheight;
            if (imgmaintaineRatio) {
                const [originalWidth, originalHeight] = await calculateImageDimensions(fileData.Body);
                const originalAspectRatio = originalWidth / originalHeight;
                if (originalAspectRatio > 1) {
                    targetWidth = maxWidth;
                    targetHeight = Math.floor(maxWidth / originalAspectRatio);
                } else {
                    targetHeight = maxWidth;
                    targetWidth = Math.floor(maxWidth * originalAspectRatio);
                }
            }

            const compressedBuffer = await sharp(fileData.Body)
                .rotate()
                .resize(targetWidth, targetHeight)
                .jpeg({ quality: imgquality })
                .toBuffer();

            await s3.putObject({
                Bucket: 'mydbms',
                Key: req.file.key,
                Body: compressedBuffer,
                ContentType: req.file.contentType,
            }).promise();
        } catch (error) { 
            return next(genError(500, 'File compression and overwrite error'));
        }
    }
    next();
};