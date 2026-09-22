// ==========================================
// INVOICE NUMBER GENERATION UTILITIES
// ==========================================

export const getInvoiceDatePrefix = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `PAC-${yyyy}${mm}${dd}`;
};

export const generateInvoiceNumber = (): string => {
  const datePrefix = getInvoiceDatePrefix();
  const lastCounter = parseInt(localStorage.getItem(`gjf_inv_counter_${datePrefix}`) || "0", 10);
  const nextCounter = lastCounter + 1;
  const numStr = String(nextCounter).padStart(3, '0');
  return `${datePrefix}-${numStr}`;
};

export const incrementInvoiceCounter = (): void => {
  const datePrefix = getInvoiceDatePrefix();
  const lastCounter = parseInt(localStorage.getItem(`gjf_inv_counter_${datePrefix}`) || "0", 10);
  localStorage.setItem(`gjf_inv_counter_${datePrefix}`, String(lastCounter + 1));
};
