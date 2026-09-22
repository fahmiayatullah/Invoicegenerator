import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { CatalogItem } from '@/types';
import { DEFAULT_CATALOG } from '@/types';

const STORAGE_KEY = 'gjf_catalog';

export const catalogService = {
  // Ambil data katalog
  async getAll(): Promise<CatalogItem[]> {
    let localData: CatalogItem[] = DEFAULT_CATALOG;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localData = JSON.parse(stored);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATALOG));
      }
    } catch (e) {
      console.error('Gagal membaca katalog dari LocalStorage:', e);
    }

    if (!isSupabaseConfigured()) {
      return localData;
    }

    try {
      const { data, error } = await supabase
        .from('catalog')
        .select('*')
        .order('name', { ascending: true });

      if (error || !data || data.length === 0) {
        return localData;
      }

      const mapped: CatalogItem[] = data.map((row) => ({
        id: row.id,
        category: row.category,
        name: row.name,
        price: Number(row.price) || 0,
        unit: row.unit,
        desc: row.desc || '',
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    } catch (err) {
      console.warn('Supabase catalog fetch fallback to local:', err);
      return localData;
    }
  },

  // Simpan seluruh katalog
  async saveAll(items: CatalogItem[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

    if (isSupabaseConfigured()) {
      try {
        const rows = items.map((item) => ({
          id: item.id,
          category: item.category,
          name: item.name,
          price: item.price,
          unit: item.unit,
          desc: item.desc,
        }));
        await supabase.from('catalog').upsert(rows, { onConflict: 'id' });
      } catch (err) {
        console.warn('Gagal sync katalog ke Supabase:', err);
      }
    }
  },

  // Hapus item dari katalog
  async deleteItem(catId: string, currentCatalog: CatalogItem[]): Promise<CatalogItem[]> {
    const filtered = currentCatalog.filter((c) => c.id !== catId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('catalog').delete().eq('id', catId);
      } catch (err) {
        console.warn('Gagal menghapus item katalog dari Supabase:', err);
      }
    }

    return filtered;
  },
};
