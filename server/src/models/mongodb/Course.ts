import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  type: 'image_theory' | 'video_theory';
  accessibility: 'free' | 'paid' | 'limited';
  topics: Array<{
    id: string;
    title: string;
    content: string;
    order: number;
    subtopics?: Array<{
      id: string;
      title: string;
      content: string;
      order: number;
    }>;
  }>;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['image_theory', 'video_theory'], required: true },
    accessibility: { type: String, enum: ['free', 'paid', 'limited'], required: true },
    topics: [
      {
        id: { type: String },
        title: { type: String },
        content: { type: String },
        order: { type: Number },
        subtopics: [
          {
            id: { type: String },
            title: { type: String },
            content: { type: String },
            order: { type: Number },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export default Course;