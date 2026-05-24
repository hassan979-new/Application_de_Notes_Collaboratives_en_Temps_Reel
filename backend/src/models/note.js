import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Veuillez fournir un titre'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu ne peut pas être vide']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'write'],
      default: 'read'
    }
  }],
  version: {
    type: Number,
    default: 1
  },
  history: [{
    content: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Middleware pour indexer le contenu pour la recherche
NoteSchema.index({ title: 'text', content: 'text' });

export const Note = mongoose.model('Note', NoteSchema);