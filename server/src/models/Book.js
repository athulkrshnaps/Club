import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    isbn: {
      type: String,
      trim: true
    },
    coverUrl: String,
    description: String,
    totalCopies: {
      type: Number,
      default: 1,
      min: 0
    },
    availableCopies: {
      type: Number,
      default: 1,
      min: 0
    },
    shelf: String,
    tags: [String]
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', author: 'text', category: 'text', tags: 'text', isbn: 'text' });

const Book = mongoose.model('Book', bookSchema);

export default Book;
