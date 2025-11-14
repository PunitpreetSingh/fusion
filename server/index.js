import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import spacesRouter from './routes/spaces.js';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';
import uploadRouter from './routes/upload.js';
import etlRouter from './routes/etl.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/users', usersRouter);
app.use('/api/spaces', spacesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/etl', etlRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
