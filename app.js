import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import crypto from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const prisma = new PrismaClient()

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

app.get('/api/posts', async (req, res) => {
    const posts = await prisma.posts.findMany();

    for (const post of posts) {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: post.imgName
        };

        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hora de expiración
        post.imgUrl = url;
    }

    res.json(posts);
});

app.post('/api/posts', upload.single('image') ,async (req, res) => {
    console.log(req .body)
    console.log(req.file)

    // guardar la imagen en el bucket
    const imgName = randonImgName();

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imgName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const post = await prisma.posts.create({
        data: {
            imgName: imgName,
            caption: req.body.caption
        }
    })

    res.json({ message: 'Post created', 'post': post });
})

app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;

    const post = await prisma.posts.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
    }

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: post.imgName
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    await prisma.posts.delete({
        where: {
            id: parseInt(id)
        }
    });

    res.json({ message: 'Post deleted' });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});