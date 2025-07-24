import { useState, useEffect, useCallback } from 'react';
import { Lecture, CreateLectureRequest, UpdateLectureRequest } from '../types/lecture';
import { lectureApi } from '../services/api';

export const useLectures = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLectures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lectureApi.getAllLectures();
      setLectures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lectures');
    } finally {
      setLoading(false);
    }
  }, []);

  const createLecture = useCallback(async (lectureData: CreateLectureRequest) => {
    try {
      const newLecture = await lectureApi.createLecture(lectureData);
      setLectures(prev => [...prev, newLecture]);
      return newLecture;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lecture');
      throw err;
    }
  }, []);

  const updateLecture = useCallback(async (lectureData: UpdateLectureRequest) => {
    try {
      const updatedLecture = await lectureApi.updateLecture(lectureData);
      setLectures(prev => prev.map(lecture => 
        lecture.id === updatedLecture.id ? updatedLecture : lecture
      ));
      return updatedLecture;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lecture');
      throw err;
    }
  }, []);

  const deleteLecture = useCallback(async (id: string) => {
    try {
      await lectureApi.deleteLecture(id);
      setLectures(prev => prev.filter(lecture => lecture.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lecture');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  return {
    lectures,
    loading,
    error,
    fetchLectures,
    createLecture,
    updateLecture,
    deleteLecture,
  };
};