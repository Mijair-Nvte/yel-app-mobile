// src/hooks/courses/useCourses.ts
import { useState, useEffect, useCallback } from 'react';
import { courseService, Course } from '@/services/courses/course.service';

export const useCourses = (companyUid: string, type: 'explore' | 'enrolled' = 'explore') => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!companyUid) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (type === 'explore') {
        // Llama al catálogo general
        const response = await courseService.getCourses(companyUid);
        setCourses(response.data);
      } else {
        // Llama a los cursos del usuario (My Courses endpoint)
        const response = await courseService.getMyCourses(companyUid);
        // Mapeamos para asegurar variables visuales que no vienen en este endpoint
        const myCoursesMapped = response.data.map(c => ({
          ...c,
          is_enrolled: true,
          is_free: c.is_free ?? true,
          price: c.price ?? 0
        }));
        setCourses(myCoursesMapped);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los cursos. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [companyUid, type]); 
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, isLoading, error, refetch: fetchCourses };
};