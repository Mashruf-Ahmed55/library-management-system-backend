import app from './src/app';
import { config } from './src/config/config';
import connectDb from './src/db/dbConfig';

const startServer = async () => {
  await connectDb();
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
};

startServer();
