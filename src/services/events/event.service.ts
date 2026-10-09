// src/services/events/event.service.ts
import { api } from '@/services/api';

export interface EventItem {
  uid: string;
  slug: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  banner_image_url: string | null;
  starts_at: string;
  ends_at: string | null;
  is_all_day: boolean;
  location: string;
  status: string;
  resources: any[];
}

export const eventService = {
  getEvents: async (companyUid: string): Promise<{ success: boolean; data: EventItem[] }> => {
    // Usamos la ruta pública de eventos que ya tienes configurada
    const response = await api.get(`/public/org-companies/${companyUid}/events`);
    return response.data;
  },

  getMyEnrolledEvents: async (companyUid: string) => {
    const response = await api.get(`/org-companies/${companyUid}/events/my-registrations`);
    return response.data;
  },


  registerToEvent: async (companyUid: string, slug: string, data: { first_name: string; last_name?: string; email: string; phone?: string }) => {
    const response = await api.post(`/public/org-companies/${companyUid}/events/${slug}/register`, data);
    return response.data;
  }
};