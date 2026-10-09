// src/hooks/events/useEvents.ts
import { useState, useEffect, useCallback } from 'react';
import { eventService, EventItem } from '@/services/events/event.service';

export const useEvents = (companyUid: string, type: 'explore' | 'enrolled' = 'explore') => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!companyUid) return;
    try {
      setIsLoading(true);
      setError(null);
      
      const res = type === 'enrolled' 
        ? await eventService.getMyEnrolledEvents(companyUid) 
        : await eventService.getEvents(companyUid);

      setEvents(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los eventos.');
    } finally {
      setIsLoading(false);
    }
  }, [companyUid, type]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refetch: fetchEvents };
};