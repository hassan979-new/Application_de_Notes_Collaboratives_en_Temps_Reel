import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Non autorisé à accéder à cette ressource' 
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur à la requête
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Non autorisé à accéder à cette ressource' 
    });
  }
};