import { access } from "fs";
import mongoose from "mongoose";

const { Schema } = mongoose;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrml: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  access: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    required: true,
  },
});

export default mongoose.model("Article", ArticleSchema);
