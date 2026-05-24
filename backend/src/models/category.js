import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom pour la catégorie'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  color: {
    type: String,
    default: '#4A6FA5'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Category = mongoose.model('Category', CategorySchema);