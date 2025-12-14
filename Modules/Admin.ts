import Joi from "joi";
import { Document, model, models, Schema } from "mongoose";

export interface IAdmin extends Document {
  userName: string;
  pass: string;
}

const AdminsSchema = new Schema<IAdmin>(
  {
    userName: {
      type: String,
      required: true,
    },
    pass: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const validateLoginUser = (obj: IAdmin) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(255).required().trim(),
    pass: Joi.string().min(8).required().trim(),
  });
  return schema.validate(obj);
};

const Admin = models.admin || model<IAdmin>("Admins", AdminsSchema);

export { Admin ,validateLoginUser};
