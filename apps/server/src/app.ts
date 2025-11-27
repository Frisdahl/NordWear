import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import apiRoutes from './routes/api.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;