import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { AppSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

const STORAGE_KEY = 'gjf_settings';

export const settingsService = {
  // Ambil pengaturan usaha
  async get(): Promise<AppSettings> {
    let localData: AppSettings = DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localData = JSON.parse(stored);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (e) {
      console.error('Gagal membaca pengaturan dari LocalStorage:', e);
    }

    if (!isSupabaseConfigured()) {
      return localData;
    }

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error || !data) {
        return localData;
      }

      const mapped: AppSettings = {
        bizName: data.biz_name || localData.bizName,
        bizContact: data.biz_contact || localData.bizContact,
        bizPhone: data.biz_phone || localData.bizPhone,
        bizEmail: data.biz_email || localData.bizEmail,
        bizAddress: data.biz_address || localData.bizAddress,
        logoBase64: data.logo_base64 || localData.logoBase64,
        qrisBase64: data.qris_base64 || localData.qrisBase64,
        bankName: data.bank_name || localData.bankName,
        bankAcc: data.bank_acc || localData.bankAcc,
        bankHolder: data.bank_holder || localData.bankHolder,
        freeRevisions: Number(data.free_revisions) || localData.freeRevisions,
        revisionPercent: Number(data.revision_percent) || localData.revisionPercent,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    } catch (err) {
      console.warn('Supabase settings fetch fallback to local:', err);
      return localData;
    }
  },

  // Simpan pengaturan
  async save(newSettings: AppSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));

    if (isSupabaseConfigured()) {
      try {
        const payload = {
          id: 'default',
          biz_name: newSettings.bizName,
          biz_contact: newSettings.bizContact,
          biz_phone: newSettings.bizPhone,
          biz_email: newSettings.bizEmail,
          biz_address: newSettings.bizAddress,
          logo_base64: newSettings.logoBase64,
          qris_base64: newSettings.qrisBase64,
          bank_name: newSettings.bankName,
          bank_acc: newSettings.bankAcc,
          bank_holder: newSettings.bankHolder,
          free_revisions: newSettings.freeRevisions,
          revision_percent: newSettings.revisionPercent,
          updated_at: new Date().toISOString(),
        };
        await supabase.from('settings').upsert(payload, { onConflict: 'id' });
      } catch (err) {
        console.warn('Gagal menyimpan settings ke Supabase:', err);
      }
    }
  },
};
