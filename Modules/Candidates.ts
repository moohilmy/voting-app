import Joi from "joi";
import  { Document, model, models, Schema } from "mongoose";

interface ICandidates extends Document {
  name: string;
  symbol: string;
  candidateNumber: number;
  voteCount: number[];
}

const candidatesSchema: Schema = new Schema<ICandidates>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    symbol: {
      type: String,
      required: true,
    },

    candidateNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    voteCount: [
      {
        type: [Number],
        required: false,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const validateCreateCandidates = (candidates: ICandidates) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    symbol: Joi.string().required(),
    candidateNumber: Joi.number().required(),
  });

  return schema.validate(candidates);
};

const Candidates =
  models.Candidates || model<ICandidates>("candidates", candidatesSchema);

export { Candidates, validateCreateCandidates };
export type { ICandidates };
