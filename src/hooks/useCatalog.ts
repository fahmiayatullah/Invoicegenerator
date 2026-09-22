import { useState, useEffect, useCallback } from 'react';
import type { CatalogItem } from '@/types';
import { DEFAULT_CATALOG } from '@/types';
import { catalogService } from '@/services/catalogService';

export const useCatalog = () => {
  const [catalog, setCatalog] = useState<CatalogItem[]>(DEFAULT_CATALOG);
  const [loading, setLoading] = useState<boolean>(true);

  const loadCatalog = useCallback(async () => {
    try {
      const data = await catalogService.getAll();
      setCatalog(data);
    } catch (err) {
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    catalogService.getAll().then((data) => {
      if (isMounted) {
        setCatalog(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const saveCatalogItem = async (item: CatalogItem): Promise<CatalogItem[]> => {
    const idx = catalog.findIndex((c) => c.id === item.id);
    let updated: CatalogItem[];
    if (idx >= 0) {
      updated = [...catalog];
      updated[idx] = item;
    } else {
      updated = [...catalog, item];
    }
    setCatalog(updated);
    await catalogService.saveAll(updated);
    return updated;
  };

  const deleteCatalogItem = async (catId: string): Promise<CatalogItem[]> => {
    const updated = await catalogService.deleteItem(catId, catalog);
    setCatalog(updated);
    return updated;
  };

  return {
    catalog,
    loading,
    loadCatalog,
    saveCatalogItem,
    deleteCatalogItem,
    setCatalog,
  };
};
