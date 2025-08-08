import axios from "./axios.config";

export const VocabService = {
  async createVocab(data: { 
    vocab: string; 
    topicId?: number; 
    subTopicId?: number; 
    region?: string; 
    description?: string; 
    videoLink?: string;
    meaning?: string;
    videoSize?: number;
    videoDuration?: string;
    videoFileName?: string;
    videoContentType?: string;
  }) {
    return axios.post("/vocab/create", data);
  },
  async updateVocab(id: string, data: { 
    vocab: string; 
    subTopicId: number; 
    region?: string; 
    description?: string; 
    videoLink?: string;
    meaning?: string;
  }) {
    return axios.put(`/vocab/${id}`, data);
  },
  async deleteVocab(id: string) {
    return axios.delete(`/vocab/${id}`);
  },
  async getVocabDetail(id: string) {
    return axios.get(`/vocab/${id}`);
  },
  async getVocabList(params?: any) {
    return axios.get(`/vocab/list`, { params });
  },
  async updateVocabStatus(id: number, status: string) {
    return axios.put(`/vocab/${id}/status`, { status });
  },
}; 