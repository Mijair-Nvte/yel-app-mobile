import { useState, useEffect, useCallback } from 'react';
import { courseService, CourseDetail } from '@/services/courses/course.service';
import { router } from 'expo-router'; // 👈 Importamos el router

// 👇 Quitamos initialIsEnrolled y courseUid, ya no los necesitamos aquí
export const useCourseDetail = (companyUid: string, slug: string) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await courseService.getCourseDetail(companyUid, slug);
      setCourse(response.data);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading course details');
    } finally {
      setIsLoading(false);
    }
  }, [companyUid, slug]);

  useEffect(() => {
    if (companyUid && slug) {
      fetchCourse();
    }
  }, [fetchCourse]);

  const enroll = async () => {
    if (!course) return;
    
    try {
      setIsEnrolling(true);
      await courseService.enrollCourse(companyUid, course.uid);
      
      router.replace({
        pathname: '/(app)/course-player',
        params: { courseUid: course.uid }
      });
      
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al inscribirse');
    } finally {
      setIsEnrolling(false);
    }
  };

  return { course, isLoading, isEnrolling, error, enroll, refetch: fetchCourse };
};