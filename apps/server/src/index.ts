import express from 'express';
import { PrismaClient } from '@prisma/client';
import apiRoutes from './routes/api.routes';
import errorHandler from './middleware/errorHandler';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api', apiRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});