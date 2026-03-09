import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import organizationRoutes from './routes/organization';
import userRoutes from './routes/user';
import imageRoutes from './routes/image';
import paymentRoutes from './routes/payment';
import notificationRoutes from './routes/notification';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
