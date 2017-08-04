import * as  mongoose from 'mongoose';

var options: mongoose.SchemaOptions = {
    minimize: false
};

export interface IWord extends mongoose.Document {
    value: string
};

export const WordSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        trim: true
    }
}, options);

export const Word: mongoose.Model<IWord> = mongoose.model<IWord>('Word', WordSchema);
