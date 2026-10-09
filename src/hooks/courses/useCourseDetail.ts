import { useState, useEffect, useCallback } from 'react';
import { courseService, CourseDetail } from '@/services/courses/course.service';
import { Alert } from 'react-native';

export const useCourseDetail = (companyUid: string, courseUid: string) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!companyUid || !courseUid) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await courseService.getCourseDetail(companyUid, courseUid);
      setCourse(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading course detail.');
    } finally {
      setIsLoading(false);
    }
  }, [companyUid, courseUid]);

  const enroll = async () => {
    try {
      setIsEnrolling(true);
      await courseService.enrollCourse(companyUid, courseUid);
      // Refrescamos los datos para que is_enrolled cambie a true y se desbloqueen los videos
      await fetchDetail(); 
      Alert.alert('Success!', 'You are now enrolled in this course.');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Could not enroll in course.');
    } finally {
      setIsEnrolling(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { course, isLoading, isEnrolling, error, enroll, refetch: fetchDetail };
};