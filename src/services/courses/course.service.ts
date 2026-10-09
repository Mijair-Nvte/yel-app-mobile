
import { api } from '@/services/api';

export interface Course {
  uid: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  is_free: boolean;
  price: number;
  modules_count: number;
  is_enrolled: boolean;
}
export interface Lesson {
  uid: string;
  title: string;
  duration_seconds: number;
  is_free_preview: boolean;
  video_url: string | null;
  can_watch: boolean;
}

export interface Module {
  uid: string;
  title: string;
  description: string | null;
  lessons: Lesson[];
}

export interface CourseDetail {
  uid: string;
  title: string;
  description: string;
  cover_url: string | null;
  preview_url: string | null;
  is_free: boolean;
  is_enrolled: boolean;
  modules: Module[];
  price:number;
}

export const courseService = {
  // Catálogo (El que ya teníamos)
  getCourses: async (companyUid: string): Promise<{ data: Course[] }> => {
    const response = await api.get(`/academy/companies/${companyUid}/courses`);
    return response.data;
  },
  
  // Detalle del curso
  getCourseDetail: async (companyUid: string, courseUid: string): Promise<{ data: CourseDetail }> => {
    const response = await api.get(`/academy/companies/${companyUid}/courses/${courseUid}`);
    return response.data;
  },

  // Inscripción gratuita
  enrollCourse: async (companyUid: string, courseUid: string) => {
    const response = await api.post(`/academy/companies/${companyUid}/courses/${courseUid}/enroll`);
    return response.data;
  }
};