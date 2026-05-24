import { User } from '../models/user.js';

// Inscription d'un utilisateur
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cet email est déjà utilisé' 
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password
    });

    // Générer le token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Valider email et mot de passe
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez fournir un email et un mot de passe' 
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants invalides' 
      });
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants invalides' 
      });
    }

    // Générer le token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Obtenir l'utilisateur actuel
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données utilisateur',
      error: error.message
    });
  }
};