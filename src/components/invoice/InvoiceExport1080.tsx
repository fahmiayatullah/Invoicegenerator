import { forwardRef } from 'react';
import type { AppSettings, InvoiceClient, InvoiceItem, InvoiceStatus } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import type { CalculationsResult } from '@/hooks/useInvoiceCalculations';
import { formatRupiah, formatDateID } from '@/utils/formatters';

// ============================================================
// INVOICE EXPORT 1080×1350
// Template tunggal yang digunakan untuk PREVIEW (di-scale) dan
// EXPORT (1080×1350 penuh). Satu sumber kebenaran.
// ============================================================

interface InvoiceExport1080Props {
  settings: AppSettings;
  formInvNumber: string;
  formInvDate: string;
  formInvDue: string;
  formPaymentMethod: string;
  formInvStatus: InvoiceStatus;
  formClient: InvoiceClient;
  currentItems: InvoiceItem[];
  calculations: CalculationsResult;
}

// ─── Status Badge Colors ──────────────────────────────────────────────────────
function getStatusStyle(status: InvoiceStatus): {
  bg: string;
  color: string;
  border: string;
  icon: string;
} {
  switch (status) {
    case 'Lunas':
      return { bg: '#dcfce7', color: '#15803d', border: '#86efac', icon: '✓' };
    case 'DP':
      return { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd', icon: '◑' };
    default: // Belum Lunas
      return { bg: '#fef9c3', color: '#a16207', border: '#fde047', icon: '○' };
  }
}

// ─── Helper: px shorthand ─────────────────────────────────────────────────────
const px = (n: number | string) => (typeof n === 'number' ? `${n}px` : n);

export const InvoiceExport1080 = forwardRef<HTMLDivElement, InvoiceExport1080Props>(
  (
    {
      settings,
      formInvNumber,
      formInvDate,
      formInvDue,
      formPaymentMethod,
      formInvStatus,
      formClient,
      currentItems,
      calculations,
    },
    ref
  ) => {
    const statusStyle = getStatusStyle(formInvStatus);

    // ── Computed Values ──────────────────────────────────────────────────────
    const bizName = settings.bizName || DEFAULT_SETTINGS.bizName;
    const hasQris = Boolean(settings.qrisBase64);
    const hasLogo = Boolean(settings.logoBase64);
    const hasBankInfo = Boolean(settings.bankName || settings.bankAcc);
    const hasNotes = Boolean(settings.bizAddress);
    const clientName = formClient.name?.trim() || '';
    const clientBusiness = formClient.business?.trim() || '';
    const clientPhone = formClient.phone?.trim() || '';
    const clientEmail = formClient.email?.trim() || '';
    const clientAddress = formClient.address?.trim() || '';
    const showDiscount = calculations.revisionTotal > 0;
    const showDpRow = formInvStatus === 'DP' && calculations.dpAmount > 0;

    // ── Styles (semua inline agar html2canvas akurat) ────────────────────────
    const S = {
      // Canvas: 1080×1350, padding safe area 70px/60px
      canvas: {
        width: px(1080),
        minHeight: px(1350),
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        fontSize: px(22),
        lineHeight: '1.5',
        boxSizing: 'border-box' as const,
        padding: `${px(60)} ${px(70)}`,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: px(32),
        WebkitFontSmoothing: 'antialiased',
      },

      // ── Header ─────────────────────────────────────────────────────────────
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: px(24),
        paddingBottom: px(32),
        borderBottom: '2px solid #e2e8f0',
      },
      logoBox: {
        width: px(80),
        height: px(80),
        borderRadius: px(16),
        border: '1.5px solid #e2e8f0',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      },
      brandSide: {
        display: 'flex',
        gap: px(20),
        alignItems: 'flex-start',
      },
      bizName: {
        fontSize: px(32),
        fontWeight: 900,
        color: '#0f172a',
        margin: 0,
        lineHeight: '1.1',
        letterSpacing: '-0.02em',
        textTransform: 'uppercase' as const,
      },
      bizSub: {
        fontSize: px(17),
        color: '#64748b',
        fontWeight: 500,
        margin: `${px(6)} 0 0`,
        lineHeight: '1.4',
      },
      bizContact: {
        fontSize: px(16),
        color: '#64748b',
        margin: `${px(4)} 0 0`,
        lineHeight: '1.4',
      },
      invoiceSide: {
        textAlign: 'right' as const,
        flexShrink: 0,
      },
      invoiceLabel: {
        fontSize: px(48),
        fontWeight: 900,
        color: '#1e1b4b',
        margin: 0,
        letterSpacing: '0.04em',
        lineHeight: '1',
      },
      invoiceNumber: {
        fontSize: px(22),
        fontWeight: 800,
        color: '#4338ca',
        margin: `${px(8)} 0 0`,
        letterSpacing: '0.02em',
        fontVariantNumeric: 'tabular-nums',
      },
      invoiceMeta: {
        marginTop: px(10),
        fontSize: px(17),
        color: '#64748b',
        lineHeight: '1.6',
      },
      statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: px(6),
        marginTop: px(12),
        padding: `${px(6)} ${px(20)}`,
        borderRadius: px(9999),
        fontSize: px(15),
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        background: statusStyle.bg,
        color: statusStyle.color,
        border: `1.5px solid ${statusStyle.border}`,
      },

      // ── Divider ─────────────────────────────────────────────────────────────
      divider: {
        width: '100%',
        height: px(1),
        background: '#e2e8f0',
      },

      // ── Bill To ─────────────────────────────────────────────────────────────
      billToSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: px(32),
        background: '#f8fafc',
        border: '1.5px solid #e2e8f0',
        borderRadius: px(16),
        padding: `${px(24)} ${px(28)}`,
      },
      sectionLabel: {
        fontSize: px(13),
        fontWeight: 800,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: '#4338ca',
        marginBottom: px(10),
        display: 'block',
      },
      clientName: {
        fontSize: px(26),
        fontWeight: 800,
        color: '#0f172a',
        margin: 0,
        lineHeight: '1.2',
        wordBreak: 'break-word' as const,
      },
      clientBusiness: {
        fontSize: px(18),
        fontWeight: 600,
        color: '#475569',
        margin: `${px(6)} 0 0`,
        wordBreak: 'break-word' as const,
      },
      clientAddress: {
        fontSize: px(17),
        color: '#64748b',
        margin: `${px(6)} 0 0`,
        lineHeight: '1.5',
        wordBreak: 'break-word' as const,
        overflowWrap: 'anywhere' as const,
      },
      clientContact: {
        textAlign: 'right' as const,
        fontSize: px(17),
        color: '#64748b',
        lineHeight: '1.7',
        flexShrink: 0,
        borderLeft: '1.5px solid #e2e8f0',
        paddingLeft: px(24),
      },

      // ── Table ────────────────────────────────────────────────────────────────
      tableWrapper: {
        borderRadius: px(16),
        border: '1.5px solid #e2e8f0',
        overflow: 'hidden',
        background: '#ffffff',
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        textAlign: 'left' as const,
      },
      thead: {
        background: '#0f172a',
        color: '#ffffff',
      },
      thBase: {
        padding: `${px(16)} ${px(20)}`,
        fontSize: px(13),
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
      },
      tdBase: {
        padding: `${px(14)} ${px(20)}`,
        fontSize: px(20),
        verticalAlign: 'middle' as const,
        borderBottom: '1px solid #f1f5f9',
      },
      tdAlt: {
        background: '#f8fafc',
      },
      serviceName: {
        fontSize: px(20),
        fontWeight: 700,
        color: '#0f172a',
        wordBreak: 'break-word' as const,
        overflowWrap: 'anywhere' as const,
      },
      serviceDesc: {
        fontSize: px(16),
        color: '#64748b',
        marginTop: px(4),
        lineHeight: '1.4',
        wordBreak: 'break-word' as const,
        overflowWrap: 'anywhere' as const,
      },
      revBadge: {
        display: 'inline-block',
        background: '#fef3c7',
        color: '#92400e',
        fontSize: px(12),
        fontWeight: 800,
        padding: `${px(2)} ${px(8)}`,
        borderRadius: px(6),
        border: '1px solid #fcd34d',
        marginTop: px(4),
        letterSpacing: '0.04em',
      },

      // ── Summary + Payment ────────────────────────────────────────────────────
      summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: px(32),
        alignItems: 'flex-start',
      },
      paymentBox: {
        flex: '0 0 auto',
        width: px(380),
        background: '#f8fafc',
        border: '1.5px solid #e2e8f0',
        borderRadius: px(16),
        padding: `${px(24)} ${px(24)}`,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: px(16),
      },
      qrisWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: px(16),
      },
      qrisBox: {
        width: px(100),
        height: px(100),
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: px(12),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      },
      bankInfo: {
        fontSize: px(17),
        lineHeight: '1.6',
      },
      bankName: {
        fontSize: px(18),
        fontWeight: 700,
        color: '#1e293b',
      },
      bankAcc: {
        fontSize: px(22),
        fontWeight: 900,
        color: '#0f172a',
        letterSpacing: '0.04em',
        fontVariantNumeric: 'tabular-nums',
      },
      bankHolder: {
        fontSize: px(16),
        color: '#64748b',
      },
      calcBox: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: px(0),
      },
      calcRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${px(10)} 0`,
        borderBottom: '1px solid #f1f5f9',
        fontSize: px(19),
      },
      calcLabel: {
        color: '#64748b',
      },
      calcValue: {
        fontWeight: 700,
        color: '#0f172a',
        fontVariantNumeric: 'tabular-nums',
      },
      totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${px(14)} 0`,
        borderBottom: '2px solid #e2e8f0',
        fontSize: px(22),
        fontWeight: 800,
      },
      totalLabel: {
        color: '#0f172a',
        letterSpacing: '0.02em',
      },
      totalValue: {
        color: '#4338ca',
        fontWeight: 900,
        fontVariantNumeric: 'tabular-nums',
      },
      balanceBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0f172a',
        color: '#ffffff',
        padding: `${px(16)} ${px(20)}`,
        borderRadius: px(12),
        marginTop: px(12),
        fontSize: px(20),
        fontWeight: 800,
      },
      balanceValue: {
        fontSize: px(24),
        fontWeight: 900,
        color: '#38bdf8',
        fontVariantNumeric: 'tabular-nums',
      },

      // ── Footer ───────────────────────────────────────────────────────────────
      footer: {
        borderTop: '1.5px solid #e2e8f0',
        paddingTop: px(24),
        marginTop: px(8),
      },
      footerNotes: {
        background: '#f8fafc',
        border: '1.5px solid #e2e8f0',
        borderRadius: px(14),
        padding: `${px(18)} ${px(22)}`,
        fontSize: px(16),
        color: '#475569',
        lineHeight: '1.6',
        marginBottom: px(20),
      },
      footerNotesLabel: {
        fontSize: px(13),
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: '#4338ca',
        display: 'block',
        marginBottom: px(8),
      },
      footerNotesGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: `${px(4)} ${px(24)}`,
        fontSize: px(16),
      },
      footerBottom: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: px(15),
        color: '#94a3b8',
      },
    } as const;

    return (
      <div id="invoice-export-1080" ref={ref} aria-hidden="true">
        <div style={S.canvas}>

          {/* ═══════════════════════════════════════
              SECTION 1: HEADER
              Brand Info (kiri) | Invoice Info (kanan)
              ═══════════════════════════════════════ */}
          <div style={S.header}>
            {/* Brand Side */}
            <div style={S.brandSide}>
              {/* Logo Box */}
              <div style={S.logoBox}>
                {hasLogo ? (
                  <img
                    src={settings.logoBase64}
                    alt="Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: px(36),
                      fontWeight: 900,
                      color: '#4338ca',
                      lineHeight: 1,
                    }}
                  >
                    {bizName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Biz Info */}
              <div>
                <h1 style={S.bizName}>{bizName}</h1>
                {(settings.bizContact || settings.bizPhone) && (
                  <p style={S.bizSub}>
                    {settings.bizContact}
                    {settings.bizPhone ? ` · ${settings.bizPhone}` : ''}
                  </p>
                )}
                {settings.bizEmail && (
                  <p style={S.bizContact}>{settings.bizEmail}</p>
                )}
                {hasNotes && (
                  <p style={S.bizContact}>{settings.bizAddress}</p>
                )}
              </div>
            </div>

            {/* Invoice Side */}
            <div style={S.invoiceSide}>
              <h2 style={S.invoiceLabel}>INVOICE</h2>
              <p style={S.invoiceNumber}>{formInvNumber || 'INV-0001'}</p>
              <div style={S.invoiceMeta}>
                <div>
                  Tanggal:{' '}
                  <strong style={{ color: '#0f172a' }}>
                    {formInvDate ? formatDateID(formInvDate) : '-'}
                  </strong>
                </div>
                {formInvDue && (
                  <div>
                    Jatuh Tempo:{' '}
                    <strong style={{ color: '#0f172a' }}>
                      {formatDateID(formInvDue)}
                    </strong>
                  </div>
                )}
              </div>
              <div>
                <span style={S.statusBadge}>
                  {statusStyle.icon} {formInvStatus}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              SECTION 2: BILL TO
              ═══════════════════════════════════════ */}
          <div style={S.billToSection}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={S.sectionLabel}>DITAGIHKAN KEPADA</span>
              <h3 style={S.clientName}>
                {clientName || 'Nama Pelanggan'}
              </h3>
              {clientBusiness && (
                <p style={S.clientBusiness}>{clientBusiness}</p>
              )}
              {clientAddress && (
                <p style={S.clientAddress}>{clientAddress}</p>
              )}
            </div>

            {(clientPhone || clientEmail || formPaymentMethod) && (
              <div style={S.clientContact}>
                {clientPhone && (
                  <div>
                    WhatsApp:{' '}
                    <strong style={{ color: '#0f172a' }}>{clientPhone}</strong>
                  </div>
                )}
                {clientEmail && (
                  <div>
                    Email:{' '}
                    <strong style={{ color: '#0f172a' }}>{clientEmail}</strong>
                  </div>
                )}
                {formPaymentMethod && (
                  <div>
                    Metode:{' '}
                    <strong style={{ color: '#0f172a' }}>{formPaymentMethod}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════
              SECTION 3: ITEMS TABLE
              ═══════════════════════════════════════ */}
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead style={S.thead}>
                <tr>
                  <th style={{ ...S.thBase, width: '46%', textAlign: 'left' }}>
                    Layanan / Deskripsi
                  </th>
                  <th style={{ ...S.thBase, width: '8%', textAlign: 'center' }}>
                    Qty
                  </th>
                  <th style={{ ...S.thBase, width: '10%', textAlign: 'center' }}>
                    Satuan
                  </th>
                  <th style={{ ...S.thBase, width: '18%', textAlign: 'right' }}>
                    Harga
                  </th>
                  <th style={{ ...S.thBase, width: '18%', textAlign: 'right', paddingRight: px(22) }}>
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => {
                  const sub = (Number(item.qty) || 0) * (Number(item.price) || 0);
                  const rev = item.hasRevisionFee
                    ? sub * ((settings.revisionPercent || 10) / 100)
                    : 0;
                  const rowTot = sub + rev;
                  const isAlt = idx % 2 === 1;

                  return (
                    <tr
                      key={item.id}
                      style={{ background: isAlt ? '#f8fafc' : '#ffffff' }}
                    >
                      {/* Description */}
                      <td style={{ ...S.tdBase, ...(isAlt ? S.tdAlt : {}) }}>
                        <div style={S.serviceName}>{item.serviceName || '-'}</div>
                        {item.description && item.description !== '-' && (
                          <div style={S.serviceDesc}>{item.description}</div>
                        )}
                        {item.hasRevisionFee && (
                          <div style={S.revBadge}>+{settings.revisionPercent || 10}% REVISI</div>
                        )}
                      </td>

                      {/* Qty */}
                      <td
                        style={{
                          ...S.tdBase,
                          ...(isAlt ? S.tdAlt : {}),
                          textAlign: 'center',
                          fontWeight: 800,
                          color: '#0f172a',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {item.qty}
                      </td>

                      {/* Unit */}
                      <td
                        style={{
                          ...S.tdBase,
                          ...(isAlt ? S.tdAlt : {}),
                          textAlign: 'center',
                          color: '#64748b',
                          fontSize: px(17),
                        }}
                      >
                        {item.unit || '-'}
                      </td>

                      {/* Harga */}
                      <td
                        style={{
                          ...S.tdBase,
                          ...(isAlt ? S.tdAlt : {}),
                          textAlign: 'right',
                          color: '#334155',
                          fontWeight: 600,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {formatRupiah(item.price)}
                      </td>

                      {/* Subtotal */}
                      <td
                        style={{
                          ...S.tdBase,
                          ...(isAlt ? S.tdAlt : {}),
                          textAlign: 'right',
                          fontWeight: 800,
                          color: '#0f172a',
                          paddingRight: px(22),
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {formatRupiah(rowTot)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════
              SECTION 4: PAYMENT + SUMMARY
              ═══════════════════════════════════════ */}
          <div style={S.summaryRow}>
            {/* Payment Info — kiri */}
            {(hasQris || hasBankInfo) && (
              <div style={S.paymentBox}>
                <span style={S.sectionLabel}>INFORMASI PEMBAYARAN</span>

                {/* QRIS + Bank */}
                <div style={S.qrisWrapper}>
                  {hasQris && (
                    <div style={S.qrisBox}>
                      <img
                        src={settings.qrisBase64}
                        alt="QRIS"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                  {hasBankInfo && (
                    <div style={S.bankInfo}>
                      <div style={{ fontSize: px(13), fontWeight: 800, color: '#4338ca', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: px(4) }}>
                        REKENING
                      </div>
                      {settings.bankName && (
                        <div style={S.bankName}>{settings.bankName}</div>
                      )}
                      {settings.bankAcc && (
                        <div style={S.bankAcc}>{settings.bankAcc}</div>
                      )}
                      {settings.bankHolder && (
                        <div style={S.bankHolder}>a.n {settings.bankHolder}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Calculations — kanan */}
            <div style={S.calcBox}>
              {/* Subtotal */}
              <div style={S.calcRow}>
                <span style={S.calcLabel}>Subtotal Layanan</span>
                <span style={S.calcValue}>{formatRupiah(calculations.subtotal)}</span>
              </div>

              {/* Biaya Revisi — only if ada */}
              {showDiscount && (
                <div style={S.calcRow}>
                  <span style={S.calcLabel}>Biaya Revisi (+{settings.revisionPercent || 10}%)</span>
                  <span style={{ ...S.calcValue, color: '#b45309' }}>
                    {formatRupiah(calculations.revisionTotal)}
                  </span>
                </div>
              )}

              {/* Grand Total */}
              <div style={S.totalRow}>
                <span style={S.totalLabel}>TOTAL INVOICE</span>
                <span style={S.totalValue}>{formatRupiah(calculations.grandTotal)}</span>
              </div>

              {/* DP row — only if DP status */}
              {showDpRow && (
                <div
                  style={{
                    ...S.calcRow,
                    color: '#059669',
                    fontWeight: 700,
                    borderBottom: '1px dashed #d1fae5',
                  }}
                >
                  <span>Telah Dibayar (DP)</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    − {formatRupiah(calculations.dpAmount)}
                  </span>
                </div>
              )}

              {/* Balance Due */}
              <div style={S.balanceBox}>
                <span style={{ letterSpacing: '0.04em' }}>
                  {formInvStatus === 'Lunas' ? 'LUNAS' : 'SISA PEMBAYARAN'}
                </span>
                <span style={S.balanceValue}>
                  {formatRupiah(calculations.balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              SECTION 5: FOOTER
              Notes + Branding
              ═══════════════════════════════════════ */}
          <div style={S.footer}>
            {/* Service Terms */}
            <div style={S.footerNotes}>
              <span style={S.footerNotesLabel}>ⓘ Keterangan &amp; Ketentuan Layanan</span>
              <div style={S.footerNotesGrid}>
                <div>• Harga sudah termasuk maksimal {settings.freeRevisions || 3} kali revisi gratis.</div>
                <div>• Revisi ke-{(settings.freeRevisions || 3) + 1}+ dikenakan {settings.revisionPercent || 10}% dari nilai layanan.</div>
                <div>• Layout buku dihitung proporsional per jumlah halaman.</div>
                <div>• File final resolusi tinggi dikirim setelah pembayaran lunas.</div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div style={S.footerBottom}>
              <span>
                Terima kasih atas kepercayaan Anda kepada{' '}
                <strong style={{ color: '#475569' }}>{bizName}</strong>.
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                1080 × 1350 · HD
              </span>
            </div>
          </div>

        </div>
      </div>
    );
  }
);

InvoiceExport1080.displayName = 'InvoiceExport1080';
