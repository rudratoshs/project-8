import { PrismaClient } from '@prisma/client';
import Course, { ICourse } from '../models/mongodb/Course';
import { CreateCourseData, UpdateCourseData } from '../types/course';
import prisma from '../config/prisma';
import geminiService from './gemini.service';

export class CourseService {
    async createCourse(userId: string, data: CreateCourseData): Promise<ICourse> {
        let mongoCourse: ICourse | null = null;

        try {
            // Create course in MongoDB
            mongoCourse = await Course.create({
                title: data.title,
                description: data.description,
                type: data.type,
                accessibility: data.accessibility,
                topics: [], // Initialize empty topics array
            });

            if (!mongoCourse._id) {
                throw new Error('MongoDB Course creation failed: Missing _id');
            }

            console.log('Creating course with data:', {
                title: data.title,
                description: data.description,
                type: data.type,
                accessibility: data.accessibility,
                userId: userId,
                mongoId: mongoCourse._id.toString(),
            });

            // Create course reference in MySQL using Prisma
            try {
                await prisma.course.create({
                    data: {
                        title: data.title,
                        description: data.description,
                        type: data.type,
                        accessibility: data.accessibility,
                        userId: userId,
                        mongoId: mongoCourse._id.toString(),
                    },
                });
            } catch (prismaError) {
                console.error('Error creating course in MySQL:', prismaError);
                throw prismaError;
            }

            return mongoCourse;
        } catch (error) {
            // If MySQL creation fails, delete the MongoDB document
            if (mongoCourse) {
                try {
                    await Course.findByIdAndDelete(mongoCourse._id);
                } catch (deleteError) {
                    console.error('Error cleaning up MongoDB document:', deleteError);
                }
            }
            throw error;
        }
    }

    async getUserCourses(userId: string): Promise<ICourse[]> {
        const userCourses = await prisma.course.findMany({
            where: { userId },
            select: { mongoId: true },
        });

        const mongoIds = userCourses.map(course => course.mongoId);
        return Course.find({ _id: { $in: mongoIds } });
    }

    async getCourseById(courseId: string): Promise<ICourse | null> {
        return Course.findById(courseId);
    }

    async updateCourse(courseId: string, data: UpdateCourseData): Promise<ICourse | null> {
        try {
            // Update course in MongoDB
            const course = await Course.findByIdAndUpdate(
                courseId,
                data,
                { new: true }
            );

            if (course) {
                // Update course reference in MySQL
                await prisma.course.update({
                    where: { mongoId: courseId },
                    data: {
                        title: data.title,
                        description: data.description,
                        type: data.type,
                        accessibility: data.accessibility,
                    },
                });
            }

            return course;
        } catch (error) {
            throw error;
        }
    }

    async deleteCourse(userId: string, courseId: string): Promise<void> {
        try {
            // Delete course from MongoDB
            await Course.findByIdAndDelete(courseId);

            // Delete course reference from MySQL
            await prisma.course.delete({
                where: {
                    mongoId: courseId,
                    userId: userId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async previewCourse(data: CreateCourseData) {
        return geminiService.generatePreview(data);
      }
}

export default new CourseService();
