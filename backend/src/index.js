import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import { setupSocketIO } from './services/socketService.js';

// Chargement des variables d'environnement
dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Configuration de l'application Express
const app = express();
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Création du serveur HTTP et Socket.IO
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*' }
});

// Configuration de Socket.IO
setupSocketIO(io);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});