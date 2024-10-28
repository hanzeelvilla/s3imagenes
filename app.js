import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import crypto from 'node:crypto'

const randonImgName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

dotenv.config();

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    region: process.env.BUCKET_REGION
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); // guardar imagen en memoria y no en disco

const app = express();
app.use(cors()); 

app.get('/', (req, res) => {
    res.send('Hola nena');
});

app.post('/api/posts', upload.single('image') ,async (req, res) => {
    console.log(req .body)
    console.log(req.file)

    // guardar la imagen en el bucket
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: randonImgName(),
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    res.json({ message: 'Post created' });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});