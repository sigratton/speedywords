import * as mongoose from 'mongoose';
import { WordSchema, IWord } from './Word';

var options: mongoose.SchemaOptions = {
    minimize: false
};

var definition: mongoose.SchemaDefinition = {
    name: {
        type: String,
        required: true,
        trim: true
    },
    words: [WordSchema]
};

export interface IWordList extends mongoose.Document {
    name: string;
    words: IWord[]
};

export const WordListSchema: mongoose.Schema = new mongoose.Schema(definition, options);

export const WordList: mongoose.Model<IWordList> = mongoose.model<IWordList>('WordList', WordListSchema);