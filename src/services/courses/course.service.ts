import { api } from '@/services/api';

export interface Course {
  uid: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  is_free?: boolean;
  price?: number;
  modules_count: number;
  is_enrolled?: boolean;

  progress_percentage?: number;
}

export interface Resource {
  uid: string;
  title: string;
  file_name: string;
  public_url?: string;
  file_size?: number;
  mime_type?: string;
}

export interface Lesson {
  uid: string;
  title: string;
  duration_seconds: number;
  is_free_preview: boolean;
  video_url: string | null;
  can_watch: boolean;
  is_completed?: boolean;
  resources?: Resource[];
}

export interface Module {
  uid: string;
  title: string;
  description: string | null;
  lessons: Lesson[];
  resources?: Resource[];
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
  price: number;
  resources?: Resource[];
}

export const courseService = {

  getCourses: async (companyUid: string): Promise<{ data: Course[] }> => {
    const response = await api.get(`/academy/companies/${companyUid}/courses`);
    return response.data;
  },


  getMyCourses: async (companyUid: string): Promise<{ data: Course[] }> => {
    const response = await api.get(`/academy/companies/${companyUid}/my-courses`);
    return response.data;
  },

  getCourseDetail: async (companyUid: string, slug: string): Promise<{ data: CourseDetail }> => {
    const response = await api.get(`/academy/companies/${companyUid}/courses/${slug}`);
    return response.data;
  },

  getMyCourseDetail: async (companyUid: string, courseUid: string): Promise<{ data: CourseDetail }> => {
    const response = await api.get(`/academy/companies/${companyUid}/my-courses/${courseUid}`);
    return response.data;
  },

  // Inscripción gratuita
  enrollCourse: async (companyUid: string, courseUid: string) => {
    const response = await api.post(`/academy/companies/${companyUid}/courses/${courseUid}/enroll`);
    return response.data;
  },
  
  toggleLessonCompletion: async (companyUid: string, courseUid: string, lessonUid: string) => {
    const response = await api.post(`/academy/companies/${companyUid}/my-courses/${courseUid}/lessons/${lessonUid}/toggle-completion`);
    return response.data;
  }
  
};