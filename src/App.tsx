import type React from 'react';
import { useState, useMemo, useCallback } from 'react';
import type {
  ActiveTab,
  CatalogItem,
  ConfirmModalState,
  Invoice,
  InvoiceClient,
  InvoiceItem,
  InvoiceStatus,
  ToastItem,
} from '@/types';
import { DEFAULT_CATALOG } from '@/types';
import { useInvoices } from '@/hooks/useInvoices';
import { useCatalog } from '@/hooks/useCatalog';
import { useSettings } from '@/hooks/useSettings';
import { useInvoiceCalculations } from '@/hooks/useInvoiceCalculations';
import { generateInvoiceNumber, incrementInvoiceCounter } from '@/utils/invoiceNumber';
import { getTodayDateString, getFutureDateString } from '@/utils/formatters';

// Layout & Feedback Components
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastContainer } from '@/components/common/ToastContainer';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { CatalogModal } from '@/components/catalog/CatalogModal';
import type { CatalogModalData } from '@/components/catalog/CatalogModal';

// Pages
import { DashboardPage } from '@/pages/DashboardPage';
import { CreateInvoicePage } from '@/pages/CreateInvoicePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { CatalogPage } from '@/pages/CatalogPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const App: React.FC = () => {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Data Hooks
  const { invoices, isSupabaseOnline, saveInvoice, deleteInvoice } = useInvoices();
  const { catalog, saveCatalogItem, deleteCatalogItem } = useCatalog();
  const { settings, updateSettings } = useSettings();

  // Current Invoice Form State
  const [currentEditingInvId, setCurrentEditingInvId] = useState<string | null>(null);
  const [formInvNumber, setFormInvNumber] = useState<string>(() => generateInvoiceNumber());
  const [formPaymentMethod, setFormPaymentMethod] = useState<string>('Transfer Bank BCA / QRIS');
  const [formInvDate, setFormInvDate] = useState<string>(() => getTodayDateString());
  const [formInvDue, setFormInvDue] = useState<string>(() => getFutureDateString(7));
  const [formInvStatus, setFormInvStatus] = useState<InvoiceStatus>('Belum Lunas');
  const [formInvDp, setFormInvDp] = useState<number>(0);
  const [formClient, setFormClient] = useState<InvoiceClient>({
    name: '',
    business: '',
    phone: '',
    email: '',
    address: '',
  });
  const [currentItems, setCurrentItems] = useState<InvoiceItem[]>(() => [
    {
      id: 'item_' + Date.now(),
      serviceName: DEFAULT_CATALOG[0].name,
      description: DEFAULT_CATALOG[0].desc,
      qty: 1,
      unit: DEFAULT_CATALOG[0].unit,
      price: DEFAULT_CATALOG[0].price,
      hasRevisionFee: false,
    },
  ]);

  // Calculations Hook
  const calculations = useInvoiceCalculations(
    currentItems,
    settings.revisionPercent,
    formInvDp,
    formInvStatus
  );

  // Catalog Modal State
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [catalogModalData, setCatalogModalData] = useState<CatalogModalData>({
    id: '',
    category: 'DESAIN PEMASARAN & PERIKLANAN',
    name: '',
    price: '',
    unit: 'desain',
    desc: '',
  });

  // Helper Toast
  const showToast = useCallback(
    (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  // Reset / Start New Invoice
  const startNewInvoice = useCallback(() => {
    setCurrentEditingInvId(null);
    setFormInvNumber(generateInvoiceNumber());
    setFormInvDate(getTodayDateString());
    setFormInvDue(getFutureDateString(7));
    setFormPaymentMethod('Transfer Bank BCA / QRIS');
    setFormInvStatus('Belum Lunas');
    setFormInvDp(0);
    setFormClient({ name: '', business: '', phone: '', email: '', address: '' });

    const firstCat = catalog[0] || DEFAULT_CATALOG[0];
    setCurrentItems([
      {
        id: 'item_' + Date.now(),
        serviceName: firstCat ? firstCat.name : 'Poster',
        description: firstCat ? firstCat.desc : 'Pembuatan materi visual',
        qty: 1,
        unit: firstCat ? firstCat.unit : 'desain',
        price: firstCat ? firstCat.price : 60000,
        hasRevisionFee: false,
      },
    ]);
  }, [catalog]);

  // Handlers untuk Item Invoice
  const handleAddItem = () => {
    const firstCat = catalog[0] || DEFAULT_CATALOG[0];
    const newItem: InvoiceItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      serviceName: firstCat ? firstCat.name : 'Poster',
      description: firstCat ? firstCat.desc : 'Pembuatan materi visual',
      qty: 1,
      unit: firstCat ? firstCat.unit : 'desain',
      price: firstCat ? firstCat.price : 60000,
      hasRevisionFee: false,
    };
    setCurrentItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (currentItems.length <= 1) {
      showToast('Invoice harus memiliki minimal 1 item layanan', 'warning');
      return;
    }
    setCurrentItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateItem = <K extends keyof InvoiceItem>(id: string, field: K, val: InvoiceItem[K]) => {
    setCurrentItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleSelectCatalog = (itemId: string, selectedName: string) => {
    const found = catalog.find((cat) => cat.name === selectedName);
    setCurrentItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        if (found) {
          return {
            ...item,
            serviceName: found.name,
            description: found.desc,
            price: found.price,
            unit: found.unit,
          };
        }
        return {
          ...item,
          serviceName: 'Layanan Kustom',
          description: 'Deskripsi kustom',
        };
      })
    );
  };

  // Simpan Invoice Saat Ini
  const handleSaveInvoice = async () => {
    const trimmedNumber = formInvNumber.trim();
    const trimmedClientName = formClient.name.trim();

    if (!trimmedNumber) {
      showToast('Nomor Invoice tidak boleh kosong!', 'error');
      return;
    }
    if (!trimmedClientName) {
      showToast('Silakan isi nama pelanggan!', 'warning');
      return;
    }

    const invoiceData: Invoice = {
      id: currentEditingInvId || 'inv_' + Date.now(),
      number: trimmedNumber,
      date: formInvDate,
      due: formInvDue,
      paymentMethod: formPaymentMethod,
      status: formInvStatus,
      dpAmount: calculations.dpAmount,
      client: { ...formClient },
      items: [...currentItems],
      totals: {
        subtotal: calculations.subtotal,
        revisionTotal: calculations.revisionTotal,
        grandTotal: calculations.grandTotal,
        balanceDue: calculations.balanceDue,
      },
      updatedAt: new Date().toISOString(),
    };

    const isNew = !currentEditingInvId;
    await saveInvoice(invoiceData);

    if (isNew) {
      incrementInvoiceCounter();
    }

    showToast(`Invoice ${trimmedNumber} berhasil disimpan!`, 'success');
    setActiveTab('history');
  };

  // Buka / Edit Invoice dari Riwayat
  const handleEditInvoice = (invId: string) => {
    const inv = invoices.find((i) => i.id === invId);
    if (!inv) return;

    setCurrentEditingInvId(inv.id);
    setFormInvNumber(inv.number);
    setFormInvDate(inv.date);
    setFormInvDue(inv.due);
    setFormPaymentMethod(inv.paymentMethod || 'Transfer Bank BCA / QRIS');
    setFormInvStatus(inv.status);
    setFormInvDp(inv.dpAmount || 0);
    setFormClient({ ...inv.client });
    setCurrentItems(JSON.parse(JSON.stringify(inv.items)));

    setActiveTab('create');
  };

  // Duplikasi Invoice
  const handleDuplicateInvoice = (invId: string) => {
    handleEditInvoice(invId);
    setCurrentEditingInvId(null);
    setFormInvNumber(generateInvoiceNumber());
    showToast('Invoice diduplikasi sebagai draft baru', 'info');
  };

  // Hapus Invoice
  const handleDeleteInvoicePrompt = (invId: string) => {
    const inv = invoices.find((i) => i.id === invId);
    if (!inv) return;

    setConfirmModal({
      isOpen: true,
      title: 'Hapus Invoice',
      message: `Apakah Anda yakin ingin menghapus Invoice <strong>${inv.number}</strong>? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        await deleteInvoice(invId);
        showToast('Invoice berhasil dihapus', 'success');
      },
    });
  };

  // Handler Modal Katalog
  const handleOpenCatalogModal = (catId?: string) => {
    if (catId) {
      const item = catalog.find((c) => c.id === catId);
      if (item) {
        setCatalogModalData({
          id: item.id,
          category: item.category,
          name: item.name,
          price: item.price,
          unit: item.unit,
          desc: item.desc,
        });
      }
    } else {
      setCatalogModalData({
        id: '',
        category: 'DESAIN PEMASARAN & PERIKLANAN',
        name: '',
        price: '',
        unit: 'desain',
        desc: '',
      });
    }
    setIsCatalogModalOpen(true);
  };

  const handleSaveCatalogFromModal = async () => {
    if (!catalogModalData.name.trim()) {
      showToast('Nama layanan tidak boleh kosong', 'warning');
      return;
    }
    if (
      catalogModalData.price === '' ||
      isNaN(Number(catalogModalData.price)) ||
      Number(catalogModalData.price) < 0
    ) {
      showToast('Harga dasar harus berupa angka valid', 'warning');
      return;
    }

    const item: CatalogItem = {
      id: catalogModalData.id || 'cat_' + Date.now(),
      category: catalogModalData.category.trim() || 'DESAIN PEMASARAN & PERIKLANAN',
      name: catalogModalData.name.trim(),
      price: Number(catalogModalData.price),
      unit: catalogModalData.unit.trim() || 'desain',
      desc: catalogModalData.desc.trim() || '-',
    };

    await saveCatalogItem(item);
    showToast('Layanan katalog berhasil disimpan!', 'success');
    setIsCatalogModalOpen(false);
  };

  const handleDeleteCatalogPrompt = (catId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Layanan Katalog',
      message: 'Apakah Anda yakin ingin menghapus layanan ini dari daftar katalog?',
      onConfirm: async () => {
        await deleteCatalogItem(catId);
        showToast('Layanan berhasil dihapus dari katalog', 'success');
      },
    });
  };

  const pageTitle = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'create':
        return currentEditingInvId ? 'Edit Invoice' : 'Buat Invoice Baru';
      case 'history':
        return 'Riwayat Invoice';
      case 'catalog':
        return 'Katalog & Harga Layanan';
      case 'settings':
        return 'Pengaturan Usaha';
      default:
        return 'Dashboard';
    }
  }, [activeTab, currentEditingInvId]);

  return (
    <div className="text-slate-800 antialiased min-h-screen flex flex-col bg-slate-100 font-sans">
      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} />

      {/* Confirmation Dialog Modal */}
      <ConfirmModal
        modalState={confirmModal}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Export Loading Spinner Overlay */}
      <LoadingOverlay message={exportLoading} />

      {/* Catalog Create/Edit Modal */}
      <CatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        data={catalogModalData}
        onChange={setCatalogModalData}
        onSave={handleSaveCatalogFromModal}
      />

      {/* Main App Top Header */}
      <Header
        settings={settings}
        activeTab={activeTab}
        isSupabaseOnline={isSupabaseOnline}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onStartNewInvoice={() => {
          startNewInvoice();
          setActiveTab('create');
        }}
        pageTitle={pageTitle}
      />

      {/* Body Area: Sidebar + Active Page */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          settings={settings}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              invoices={invoices}
              setActiveTab={setActiveTab}
              onEditInvoice={handleEditInvoice}
              onStartNewInvoice={() => {
                startNewInvoice();
                setActiveTab('create');
              }}
            />
          )}

          {activeTab === 'create' && (
            <CreateInvoicePage
              settings={settings}
              catalog={catalog}
              formInvNumber={formInvNumber}
              setFormInvNumber={setFormInvNumber}
              formInvDate={formInvDate}
              setFormInvDate={setFormInvDate}
              formInvDue={formInvDue}
              setFormInvDue={setFormInvDue}
              formPaymentMethod={formPaymentMethod}
              setFormPaymentMethod={setFormPaymentMethod}
              formInvStatus={formInvStatus}
              setFormInvStatus={setFormInvStatus}
              formInvDp={formInvDp}
              setFormInvDp={setFormInvDp}
              formClient={formClient}
              setFormClient={setFormClient}
              currentItems={currentItems}
              calculations={calculations}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
              onSelectCatalog={handleSelectCatalog}
              onSaveInvoice={handleSaveInvoice}
              onStartNewInvoice={startNewInvoice}
              isEditing={Boolean(currentEditingInvId)}
              showToast={showToast}
              setExportLoading={setExportLoading}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage
              invoices={invoices}
              onEditInvoice={handleEditInvoice}
              onDuplicateInvoice={handleDuplicateInvoice}
              onDeletePrompt={handleDeleteInvoicePrompt}
              onStartNewInvoice={() => {
                startNewInvoice();
                setActiveTab('create');
              }}
            />
          )}

          {activeTab === 'catalog' && (
            <CatalogPage
              catalog={catalog}
              onOpenModal={handleOpenCatalogModal}
              onDeletePrompt={handleDeleteCatalogPrompt}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onSaveSettings={updateSettings}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
