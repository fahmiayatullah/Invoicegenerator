import { useMemo } from 'react';
import type { InvoiceItem, InvoiceStatus } from '@/types';

export interface CalculationsResult {
  subtotal: number;
  revisionTotal: number;
  grandTotal: number;
  dpAmount: number;
  balanceDue: number;
}

export const useInvoiceCalculations = (
  items: InvoiceItem[],
  revisionPercent: number = 10,
  formInvDp: number = 0,
  formInvStatus: InvoiceStatus = 'Belum Lunas'
): CalculationsResult => {
  return useMemo(() => {
    let totalSubtotal = 0;
    let totalRevisionFee = 0;
    const revPercent = Number(revisionPercent) || 10;

    items.forEach((item) => {
      const sub = (Number(item.qty) || 0) * (Number(item.price) || 0);
      const rev = item.hasRevisionFee ? sub * (revPercent / 100) : 0;
      totalSubtotal += sub;
      totalRevisionFee += rev;
    });

    const grandTotal = totalSubtotal + totalRevisionFee;
    let dp = Number(formInvDp) || 0;
    if (formInvStatus === 'Lunas') dp = grandTotal;
    if (formInvStatus === 'Belum Lunas') dp = 0;

    const balanceDue = Math.max(0, grandTotal - dp);

    return {
      subtotal: totalSubtotal,
      revisionTotal: totalRevisionFee,
      grandTotal,
      dpAmount: dp,
      balanceDue: formInvStatus === 'Lunas' ? 0 : balanceDue,
    };
  }, [items, revisionPercent, formInvDp, formInvStatus]);
};
