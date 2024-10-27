import express from 'express';
import cors from 'cors';
import multer from 'multer';

const storage = multer.memoryStorage()
const upload = multer({ storage: storage }) // guardar imagen en memoria y no en disco

const app = express();
app.use(cors()); 

app.get('/', (req, res) => {
    res.send('Hola nena');
});

app.post('/api/posts', upload.single('image') ,async (req, res) => {
    console.log(req .body)
    console.log(req.file)
    res.json({ message: 'Post created' });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});