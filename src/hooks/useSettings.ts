import { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import { settingsService } from '@/services/settingsService';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSettings = useCallback(async () => {
    try {
      const data = await settingsService.get();
      setSettings(data);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    settingsService.get().then((data) => {
      if (isMounted) {
        setSettings(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const updateSettings = async (newSettings: AppSettings): Promise<void> => {
    setSettings(newSettings);
    await settingsService.save(newSettings);
  };

  return {
    settings,
    loading,
    loadSettings,
    updateSettings,
    setSettings,
  };
};
