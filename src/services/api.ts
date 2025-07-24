import axios from 'axios';
import { Lecture, CreateLectureRequest, UpdateLectureRequest } from '../types/lecture';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const lectureApi = {
  // Get all lectures
  getAllLectures: async (): Promise<Lecture[]> => {
    const response = await api.get('/lectures');
    return response.data;
  },

  // Get lecture by ID
  getLectureById: async (id: string): Promise<Lecture> => {
    const response = await api.get(`/lectures/${id}`);
    return response.data;
  },

  // Create new lecture
  createLecture: async (lecture: CreateLectureRequest): Promise<Lecture> => {
    const response = await api.post('/lectures', lecture);
    return response.data;
  },

  // Update lecture
  updateLecture: async (lecture: UpdateLectureRequest): Promise<Lecture> => {
    const response = await api.put(`/lectures/${lecture.id}`, lecture);
    return response.data;
  },

  // Delete lecture
  deleteLecture: async (id: string): Promise<void> => {
    await api.delete(`/lectures/${id}`);
  },

  // Get lectures by date range
  getLecturesByDateRange: async (start: string, end: string): Promise<Lecture[]> => {
    const response = await api.get(`/lectures?start=${start}&end=${end}`);
    return response.data;
  },
};

export default api;