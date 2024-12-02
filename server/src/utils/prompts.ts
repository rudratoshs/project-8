import { CreateCourseData } from '../types/course';

export function generateCoursePrompt(data: CreateCourseData): string {
    const basePrompt = `
    Generate a comprehensive course structure for "${data.title}" with exactly ${data.numTopics} main topics.
    The course is about: ${data.description}
    Course type: ${data.type}
    
    Format the response as a JSON object with this structure:
    {
      "${data.title.toLowerCase()}": [
        {
          "title": "Main Topic Title",
          "subtopics": [
            {
              "title": "Subtopic Title",
              "theory": "",
              "youtube": "",
              "image": "",
              "done": false
            }
          ]
        }
      ]
    }

    Requirements:
    - Generate exactly ${data.numTopics} main topics
    - Each topic should have 2-4 subtopics
    - Topics should follow a logical learning progression
    - Content should be appropriate for ${data.type} format
    - Keep all media fields empty (theory, youtube, image)
    - Set done to false for all subtopics
    - Ensure topics are relevant to the course description
  `;

    // Add specific subtopics if provided
    if (data.subtopics?.length) {
        return `${basePrompt}
      Important: Include these specific subtopics across the course:
      ${data.subtopics.join(', ')}
    `;
    }

    return basePrompt;
}

export function generatePreviewPrompt(data: CreateCourseData): string {
    return `
      Generate a preview with ${data.numTopics} unique topics, each containing subtopics related to the course "${data.title}".
      The course is about: ${data.description}.
      
      Format the response as a JSON object with this structure:
      {
        "${data.title.toLowerCase()}": [
          {
            "title": "Sample Topic Title",
            "subtopics": [
              {
                "title": "Sample Subtopic Title",
                "theory": "",
                "youtube": "",
                "image": "",
                "done": false
              }
            ]
          }
        ]
      }

      Requirements:
      - Generate ${data.numTopics} unique topics relevant to the course description.
      - Each topic should contain diverse subtopics relevant to the topic itself.
      - Include the following subtopics somewhere across all topics: ${data.subtopics.join(", ")}.
      - Keep all media fields (theory, youtube, image) empty.
      - Ensure the content structure is suitable for the ${data.type} format.
      - Set "done" to false for all subtopics.
    `;
}