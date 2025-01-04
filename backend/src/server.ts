import express from 'express';
import cors from 'cors';
import { config } from './config/database';
import databaseRoutes from './routes/database.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', databaseRoutes);

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});