import axios from "./axios.config";

export const TopicService = {
  async createTopic(data: { 
    topicName: string; 
    isFree: boolean;
    sortOrder: number;
    subtopics: string[] 
  }) {
    return axios.post("/api/v1/topics/create", data);
  },
  async updateTopic(id: string, data: { 
    topicName: string; 
    isFree: boolean;
    sortOrder: number;
    subtopics: string[] 
  }) {
    return axios.put(`/api/v1/topics/${id}`, data);
  },
  async deleteTopic(id: string) {
    return axios.delete(`/api/v1/topics/${id}`);
  },
  async getTopicDetail(id: string) {
    return axios.get(`/api/v1/topics/${id}`);
  },
  async getTopicList(params?: any) {
    return axios.get(`/api/v1/topics/list`, { params });
  },
  async updateTopicStatus(id: number, status: string) {
    return axios.put(`/api/v1/topics/${id}/status`, { status });
  },
}; 