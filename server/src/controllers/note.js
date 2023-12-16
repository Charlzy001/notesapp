import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import Note from '../model/note.model.js';

// create a logic on how to create a note
export const createNote = async(req, res, next) => {
    const userId = req.user.id;
    const { title, description, imageUrl, tags } = req.body;
    // if there are much options use noteparams 
   try {
    if(!title && !description && !imageUrl && tags) {
        throw createHttpError(400, "Form fields cannot be empty");
    }
    const note = await Note.create ({userId, title, description, imageUrl, tags,});
    res.status(201).json(note);
   } catch (error) {
    next (error);
   }
};

// get user note
export const getUserNote = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const note = await Note.find({ userId: userId }).sort({_id: -1});
        res.status(200).json(note);  
    } catch (error) {
        next(error);
    }
};

// get a single noe/document
export const getASingleNote = async(req, res, next) => {
    const noteId = req.params.noteId; //find note by its id
    const userId = req.user.id; //find user that created the note
    try {
        if (!isValidObjectId(noteId)) {
            throw createHttpError(400, "invalid note id");
        }
        const note = await Note.findById(noteId);
    } catch (error) {
        next(error);

    }
}
// deleting a note
export const deleteAnote = async(req, res, next) => {
    const noteId = req.params.noteId;
    const userId = req.user.id;
    const { title, description, imageUrl, tags } = req.body;
    try {
        if (!isValidObjectId(noteId)) {
            throw createHttpError(400, "invalid note id");
        }
        const note =  await Note.findByIdAndDelete(noteId)
        if (!note.userId.equals(userId)) {
            throw createHttpError(401, "You cannot delete this note");
        }
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        res.status(200).send("Note deleted successfully");
    } catch (error) {
        next(error);
    }
};
//updating a note
export const updateANote = async(req, res, next) => {
    const noteId = req.params.noteId;
    const userId = req.user.id;
    try {
        if (!isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }
        if(!title && !description && !imageUrl && tags) {
            throw createHttpError(400, "Form fields cannot be empty");
        }
        const note = await Note.findById(noteId);
        if (!note.userId.equals(userId)) {
            throw createHttpError(401, "You cannot delete this note");
        }
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        note.title = title
        note.description = description;
        note.imageUrl = imageUrl;
        note.tags = tags;
        // Object.assign(note, {title, description, imageUrl, tags });
        const updatedNote = await note.save()
        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }   
};