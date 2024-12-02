import { model } from '../config/gemini';
import { CreateCourseData } from '../types/course';
import { generateCoursePrompt, generatePreviewPrompt } from '../utils/prompts';

export class GeminiService {
  async generateCourseContent(data: CreateCourseData) {
    try {
      const prompt = generateCoursePrompt(data);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        // Clean the response text by removing markdown code blocks if present
        const cleanedText = text.replace(/```json\n?|\n?```/g, '');
        const parsedContent = JSON.parse(cleanedText);

        // Transform the response to match our MongoDB schema
        const topics = parsedContent[data.title.toLowerCase()].map((topic: any, index: number) => ({
          title: topic.title,
          content: '', // Content will be generated separately
          order: index + 1,
          subtopics: topic.subtopics.map((subtopic: any, subIndex: number) => ({
            title: subtopic.title,
            content: '', // Content will be generated separately
            order: subIndex + 1
          }))
        }));

        return { topics };
      } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        throw new Error('Invalid response format from AI model');
      }
    } catch (error) {
      console.error('Error generating course content:', error);
      throw error;
    }
  }

  async generatePreview(data: CreateCourseData) {
    try {
      const prompt = generatePreviewPrompt(data);
      console.log(prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      console.log(text);

      try {
        // Clean the response text
        const cleanedText = text.replace(/```json\n?|\n?```/g, '');
        const parsedContent = JSON.parse(cleanedText);

        // Transform to match our preview format
        const topics = parsedContent[data.title.toLowerCase()].map((topic: any) => ({
          title: topic.title,
          content: '', // Content will be generated separately
          subtopics: topic.subtopics.map((subtopic: any) => ({
            title: subtopic.title,
            content: '' // Content will be generated separately
          })),
        }));

        return { topics }; // Return all topics
      } catch (error) {
        console.error('Failed to parse Gemini preview response:', error);
        throw new Error('Invalid preview response format from AI model');
      }
    } catch (error) {
      console.error('Error generating course preview:', error);
      throw error;
    }
  }
}

export default new GeminiService();