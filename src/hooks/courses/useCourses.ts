// src/hooks/courses/useCourses.ts
import { useState, useEffect, useCallback } from 'react';
import { courseService, Course } from '@/services/courses/course.service';

export const useCourses = (companyUid: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!companyUid) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await courseService.getCourses(companyUid);
      setCourses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los cursos. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [companyUid]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, isLoading, error, refetch: fetchCourses };
};