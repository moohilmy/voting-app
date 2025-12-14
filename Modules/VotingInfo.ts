import { Document, model, models, Schema } from "mongoose";

export interface IVotingInfo extends Document {
  voterHaveRight: number;
  votersWhoVotting: number;
  adminPassKey: string;
}

const VotingInfoSchema = new Schema<IVotingInfo>(
  {
    voterHaveRight: {
      type: Number,
      required: true,
      default: 0,
    },
    votersWhoVotting: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const VotingInfo =
  models.VotingInfo || model<IVotingInfo>("VotingInfo", VotingInfoSchema);

export { VotingInfo };
