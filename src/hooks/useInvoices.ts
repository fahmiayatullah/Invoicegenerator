import { useState, useEffect, useCallback } from 'react';
import type { Invoice } from '@/types';
import { invoiceService } from '@/services/invoiceService';
import { checkSupabaseConnection } from '@/lib/supabase';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSupabaseOnline, setIsSupabaseOnline] = useState<boolean>(false);

  const loadInvoices = useCallback(async () => {
    try {
      const isOnline = await checkSupabaseConnection();
      setIsSupabaseOnline(isOnline);
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (err) {
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([checkSupabaseConnection(), invoiceService.getAll()]).then(([isOnline, data]) => {
      if (isMounted) {
        setIsSupabaseOnline(isOnline);
        setInvoices(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const saveInvoice = async (invoice: Invoice): Promise<Invoice[]> => {
    const updated = await invoiceService.save(invoice, invoices);
    setInvoices(updated);
    return updated;
  };

  const deleteInvoice = async (invId: string): Promise<Invoice[]> => {
    const updated = await invoiceService.delete(invId, invoices);
    setInvoices(updated);
    return updated;
  };

  return {
    invoices,
    loading,
    isSupabaseOnline,
    loadInvoices,
    saveInvoice,
    deleteInvoice,
    setInvoices,
  };
};
