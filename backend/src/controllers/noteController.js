import { Note } from '../models/note.js';
import { Category } from '../models/category.js';
import { User } from '../models/user.js';

// Obtenir toutes les notes de l'utilisateur
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [
        { owner: req.user.id },
        { 'sharedWith.user': req.user.id }
      ]
    }).populate('category', 'name color');

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notes',
      error: error.message
    });
  }
};

// Obtenir une note spécifique
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('category', 'name color')
      .populate('owner', 'name email')
      .populate('sharedWith.user', 'name email');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }

    // Vérifier si l'utilisateur a accès à cette note
    const isOwner = note.owner._id.toString() === req.user.id;
    const isShared = note.sharedWith.some(share => 
      share.user._id.toString() === req.user.id
    );

    if (!isOwner && !isShared) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à cette note'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la note',
      error: error.message
    });
  }
};

// Créer une nouvelle note
export const createNote = async (req, res) => {
  try {
    // Ajouter l'utilisateur comme propriétaire
    req.body.owner = req.user.id;

    // Vérifier si la catégorie existe et appartient à l'utilisateur
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category || category.user.toString() !== req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Catégorie invalide'
        });
      }
    }

    const note = await Note.create(req.body);

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la note',
      error: error.message
    });
  }
};

// Mettre à jour une note
export const updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }

    // Vérifier si l'utilisateur est autorisé à modifier la note
    const isOwner = note.owner.toString() === req.user.id;
    const isSharedWithWrite = note.sharedWith.some(share => 
      share.user.toString() === req.user.id && share.permission === 'write'
    );

    if (!isOwner && !isSharedWithWrite) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette note'
      });
    }

    // Si le contenu est modifié, ajouter à l'historique
    if (req.body.content && req.body.content !== note.content) {
      note.history.push({
        content: note.content,
        updatedBy: req.user.id,
        updatedAt: Date.now()
      });
      note.version += 1;
    }

    // Mettre à jour la note
    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la note',
      error: error.message
    });
  }
};

// Supprimer une note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }

    // Vérifier si l'utilisateur est le propriétaire
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette note'
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la note',
      error: error.message
    });
  }
};

// Partager une note
export const shareNote = async (req, res) => {
  try {
    const { email, permission } = req.body;

    // Trouver l'utilisateur avec qui partager
    const userToShare = await User.findOne({ email });
    if (!userToShare) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }

    // Vérifier si l'utilisateur est le propriétaire
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à partager cette note'
      });
    }

    // Vérifier si la note est déjà partagée avec cet utilisateur
    const alreadyShared = note.sharedWith.find(
      share => share.user.toString() === userToShare._id.toString()
    );

    if (alreadyShared) {
      // Mettre à jour les permissions
      alreadyShared.permission = permission;
    } else {
      // Ajouter le nouvel utilisateur
      note.sharedWith.push({
        user: userToShare._id,
        permission
      });
    }

    await note.save();

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du partage de la note',
      error: error.message
    });
  }
};

// Rechercher des notes
export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un terme de recherche'
      });
    }

    const notes = await Note.find({
      $and: [
        { $text: { $search: query } },
        {
          $or: [
            { owner: req.user.id },
            { 'sharedWith.user': req.user.id }
          ]
        }
      ]
    }).populate('category', 'name color');

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message
    });
  }
};