import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Note } from '../models/note.js';

export const setupSocketIO = (io) => {
  // Middleware d'authentification pour Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Non authentifié'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Utilisateur non trouvé'));
      }
      
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Erreur d\'authentification'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Utilisateur connecté: ${socket.user.name} (${socket.id})`);
    
    // Rejoindre les salles pour les notes partagées
    socket.on('joinNote', async (noteId) => {
      try {
        const note = await Note.findById(noteId);
        
        if (!note) {
          socket.emit('error', 'Note non trouvée');
          return;
        }
        
        // Vérifier si l'utilisateur a accès à cette note
        const isOwner = note.owner.toString() === socket.user._id.toString();
        const isShared = note.sharedWith.some(share => 
          share.user.toString() === socket.user._id.toString()
        );
        
        if (!isOwner && !isShared) {
          socket.emit('error', 'Non autorisé à accéder à cette note');
          return;
        }
        
        socket.join(`note:${noteId}`);
        console.log(`${socket.user.name} a rejoint la note: ${noteId}`);
      } catch (error) {
        socket.emit('error', 'Erreur lors de la connexion à la note');
      }
    });
    
    // Quitter une salle de note
    socket.on('leaveNote', (noteId) => {
      socket.leave(`note:${noteId}`);
      console.log(`${socket.user.name} a quitté la note: ${noteId}`);
    });
    
    // Recevoir les mises à jour de contenu en temps réel
    socket.on('contentUpdate', async (data) => {
      try {
        const { noteId, content, cursorPosition } = data;
        
        // Émettre la mise à jour à tous les autres utilisateurs dans la salle
        socket.to(`note:${noteId}`).emit('contentUpdate', {
          content,
          cursorPosition,
          updatedBy: {
            id: socket.user._id,
            name: socket.user.name
          }
        });
      } catch (error) {
        socket.emit('error', 'Erreur lors de la mise à jour du contenu');
      }
    });
    
    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`Utilisateur déconnecté: ${socket.user.name} (${socket.id})`);
    });
  });
};