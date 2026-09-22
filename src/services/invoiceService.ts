import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Invoice } from '@/types';

const STORAGE_KEY = 'gjf_invoices';

export const invoiceService = {
  // Ambil semua invoice (dari Supabase jika aktif, jika tidak dari LocalStorage)
  async getAll(): Promise<Invoice[]> {
    let localData: Invoice[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localData = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Gagal membaca invoice dari LocalStorage:', e);
    }

    if (!isSupabaseConfigured()) {
      return localData;
    }

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.warn('Gagal memuat invoice dari Supabase, menggunakan data lokal:', error?.message);
        return localData;
      }

      // Mapping data dari format database ke Interface TypeScript
      const mappedInvoices: Invoice[] = data.map((row) => ({
        id: row.id,
        number: row.number,
        date: row.date,
        due: row.due,
        paymentMethod: row.payment_method || 'Transfer Bank BCA / QRIS',
        status: row.status as Invoice['status'],
        dpAmount: Number(row.dp_amount) || 0,
        client: row.client || { name: '', business: '', phone: '', email: '', address: '' },
        items: row.items || [],
        totals: row.totals || { subtotal: 0, revisionTotal: 0, grandTotal: 0, balanceDue: 0 },
        updatedAt: row.updated_at || new Date().toISOString(),
        createdAt: row.created_at || new Date().toISOString(),
      }));

      // Update sinkronisasi ke LocalStorage sebagai cache offline
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedInvoices));
      return mappedInvoices;
    } catch (err) {
      console.warn('Supabase offline/error, menggunakan local storage:', err);
      return localData;
    }
  },

  // Simpan atau perbarui invoice
  async save(invoice: Invoice, existingInvoices: Invoice[]): Promise<Invoice[]> {
    const existingIndex = existingInvoices.findIndex(
      (i) => i.id === invoice.id || i.number === invoice.number
    );

    let updatedList: Invoice[];
    if (existingIndex >= 0) {
      updatedList = [...existingInvoices];
      updatedList[existingIndex] = invoice;
    } else {
      updatedList = [invoice, ...existingInvoices];
    }

    // Selalu simpan ke LocalStorage agar tidak kehilangan data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    // Jika Supabase aktif, lakukan upsert ke database
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          id: invoice.id,
          number: invoice.number,
          date: invoice.date,
          due: invoice.due,
          payment_method: invoice.paymentMethod,
          status: invoice.status,
          dp_amount: invoice.dpAmount,
          client: invoice.client,
          items: invoice.items,
          totals: invoice.totals,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('invoices').upsert(payload, { onConflict: 'id' });
        if (error) {
          console.warn('Gagal menyimpan invoice ke Supabase (tetap tersimpan di cache lokal):', error.message);
        }
      } catch (err) {
        console.warn('Pengecualian saat menyimpan ke Supabase:', err);
      }
    }

    return updatedList;
  },

  // Hapus invoice
  async delete(invId: string, currentInvoices: Invoice[]): Promise<Invoice[]> {
    const filtered = currentInvoices.filter((i) => i.id !== invId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('invoices').delete().eq('id', invId);
        if (error) {
          console.warn('Gagal menghapus invoice dari Supabase:', error.message);
        }
      } catch (err) {
        console.warn('Pengecualian saat menghapus dari Supabase:', err);
      }
    }

    return filtered;
  },
};
