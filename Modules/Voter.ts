import Joi from "joi";
import mongoose, { Document, model, models, Schema } from "mongoose";

interface IVoter extends Document {
  clubHouseID: string;
  telegramID: string;
  hasVoted: boolean;
  voterId: string;
  isVerified: boolean;
  OTP: string | null;
  whoVotedFor: string[] | null;
  telegramFingerprint: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const VoterSchema: Schema = new Schema<IVoter>(
  {
    clubHouseID: { type: String, required: true, unique: true },
    telegramID: { type: String, required: true, unique: true },
    voterId: { type: String, required: true, },
    OTP: { type: String, default: null },
    telegramFingerprint: {type: Number, default: null},
    hasVoted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    whoVotedFor: { type: [String], default: [] },
  },
  { timestamps: true }
);

const validateCreateVoter = (voter: IVoter) => {
  const schema = Joi.object({
    clubHouseID: Joi.string().required(),
    telegramID: Joi.string().required(),
  });
  return schema.validate(voter);
};

const Voter = models.Voters || model<IVoter>("Voters", VoterSchema);

export { Voter, validateCreateVoter };
export type { IVoter };
