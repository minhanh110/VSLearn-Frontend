import axios from "./axios.config";

export const VocabService = {
  async createVocab(data: { 
    vocab: string; 
    topicId: number; 
    subTopicId: number; 
    region?: string; 
    description?: string; 
    videoLink?: string;
    meaning?: string;
  }) {
    return axios.post("/api/v1/vocab/create", data);
  },
  async updateVocab(id: string, data: { 
    vocab: string; 
    subTopicId: number; 
    region?: string; 
    description?: string; 
    videoLink?: string;
    meaning?: string;
  }) {
    return axios.put(`/api/v1/vocab/${id}`, data);
  },
  async deleteVocab(id: string) {
    return axios.delete(`/api/v1/vocab/${id}`);
  },
  async getVocabDetail(id: string) {
    return axios.get(`/api/v1/vocab/${id}`);
  },
  async getVocabList(params?: any) {
    return axios.get(`/api/v1/vocab/list`, { params });
  },
  async updateVocabStatus(id: number, status: string) {
    return axios.put(`/api/v1/vocab/${id}/status`, { status });
  },
}; 