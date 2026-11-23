// src/hooks/courses/useCourseDetail.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { courseService, CourseDetail } from '@/services/courses/course.service';
import { purchaseProduct } from '@/services/purchases/purchases';

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string }>(err)) return err.response?.data?.message ?? fallback;
  if (err instanceof Error) return err.message;
  return fallback;
};

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
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error al cargar el curso'));
    } finally {
      setIsLoading(false);
    }
  }, [companyUid, slug]);

  useEffect(() => {
    if (companyUid && slug) {
      fetchCourse();
    }
  }, [fetchCourse]);

  // Registra la inscripción en Laravel y abre el reproductor
  const processBackendEnrollment = async (courseUid: string): Promise<void> => {
    await courseService.enrollCourse(companyUid, courseUid);
    router.replace({
      pathname: '/(app)/course-player',
      params: { courseUid },
    });
  };

  const enroll = async (): Promise<void> => {
    if (!course) return;

    try {
      setIsEnrolling(true);

      // FLUJO 1: curso gratis
      if (course.is_free) {
        await processBackendEnrollment(course.uid);
        return;
      }

      // FLUJO 2: curso de pago (RevenueCat)
      // Nota: aunque se llame "entitlement_id", aquí viene el ID del producto en la tienda
      const productId = course.revenuecat_entitlement_id;
      if (!productId) {
        Alert.alert('Error', 'Este curso no tiene un producto configurado para pagos.');
        return;
      }

      const result = await purchaseProduct(productId);

      switch (result.status) {
        case 'success':
          await processBackendEnrollment(course.uid);
          break;
        case 'cancelled':
          break;
        case 'unavailable':
          Alert.alert('Compras no disponibles', result.message);
          break;
        case 'error':
          Alert.alert('Error en la compra', result.message);
          break;
      }
    } catch (err: unknown) {
      Alert.alert('Error', getErrorMessage(err, 'No se pudo completar la inscripción.'));
    } finally {
      setIsEnrolling(false);
    }
  };

  return { course, isLoading, isEnrolling, error, enroll, refetch: fetchCourse };
};