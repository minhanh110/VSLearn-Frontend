import axios from "./axios.config";

export const SubtopicService = {
  async getSubtopicsByTopicId(topicId: string | number) {
    return axios.get(`/api/v1/flashcards/topic/${topicId}/subtopics`);
  },
}; 