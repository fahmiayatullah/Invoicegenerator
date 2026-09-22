import { forwardRef } from 'react';
import type { AppSettings, InvoiceClient, InvoiceItem, InvoiceStatus } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';
import type { CalculationsResult } from '@/hooks/useInvoiceCalculations';
import { formatRupiah, formatDateID } from '@/utils/formatters';

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
    return (
      <div id="invoice-export-1080" ref={ref} aria-hidden="true">
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Brand & Invoice Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '24px',
              borderBottom: '2px solid #e2e8f0',
              marginBottom: '22px',
            }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div
                style={{
                  width: '86px',
                  height: '86px',
                  borderRadius: '20px',
                  border: '1.5px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f8fafc',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {settings.logoBase64 ? (
                  <img
                    src={settings.logoBase64}
                    alt="Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <i className="fa-solid fa-compass-drafting" style={{ fontSize: '40px', color: '#4338ca' }}></i>
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1
                    style={{
                      fontSize: '25px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: '#0f172a',
                      margin: 0,
                      lineHeight: 1.1,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {settings.bizName || DEFAULT_SETTINGS.bizName}
                  </h1>
                  <span
                    style={{
                      background: '#e0e7ff',
                      color: '#3730a3',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    STUDIO
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    fontWeight: 500,
                    marginTop: '5px',
                    marginBottom: '3px',
                  }}
                >
                  {settings.bizAddress || DEFAULT_SETTINGS.bizAddress}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13.5px', color: '#475569' }}>
                  <span>
                    WA:{' '}
                    <strong style={{ color: '#1e293b' }}>
                      {settings.bizContact} ({settings.bizPhone})
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Email: <strong style={{ color: '#1e293b' }}>{settings.bizEmail}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', minWidth: '250px' }}>
              <h2
                style={{
                  fontSize: '34px',
                  fontWeight: 900,
                  color: '#1e1b4b',
                  letterSpacing: '0.04em',
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                INVOICE
              </h2>
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#4338ca',
                  margin: '5px 0 0 0',
                  fontFamily: 'monospace',
                }}
              >
                {formInvNumber}
              </p>
              <div style={{ marginTop: '8px', fontSize: '13.5px', color: '#64748b', lineHeight: 1.4 }}>
                <div>
                  Tanggal: <strong style={{ color: '#0f172a' }}>{formatDateID(formInvDate)}</strong>
                </div>
                <div>
                  Jatuh Tempo: <strong style={{ color: '#0f172a' }}>{formatDateID(formInvDue)}</strong>
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 16px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background:
                      formInvStatus === 'Lunas' ? '#d1fae5' : formInvStatus === 'DP' ? '#dbeafe' : '#fef3c7',
                    color:
                      formInvStatus === 'Lunas' ? '#065f46' : formInvStatus === 'DP' ? '#1e40af' : '#92400e',
                    border: `1.5px solid ${
                      formInvStatus === 'Lunas' ? '#6ee7b7' : formInvStatus === 'DP' ? '#93c5fd' : '#fcd34d'
                    }`,
                  }}
                >
                  {formInvStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Client Info Card */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '18px 22px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ maxWidth: '580px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#4338ca',
                  display: 'block',
                  marginBottom: '3px',
                }}
              >
                DITAGIHKAN KEPADA:
              </span>
              <h3
                style={{
                  fontSize: '19px',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {formClient.name || 'Nama Pelanggan'}
              </h3>
              <p style={{ fontSize: '14.5px', fontWeight: 600, color: '#475569', margin: '3px 0 4px 0' }}>
                {formClient.business || 'Nama Usaha / Instansi'}
              </p>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.3 }}>
                {formClient.address || 'Alamat Pelanggan'}
              </p>
            </div>
            <div
              style={{
                textAlign: 'right',
                fontSize: '13.5px',
                color: '#475569',
                lineHeight: 1.5,
                borderLeft: '1.5px solid #e2e8f0',
                paddingLeft: '20px',
              }}
            >
              <div>
                WhatsApp: <strong style={{ color: '#0f172a' }}>{formClient.phone || '-'}</strong>
              </div>
              <div>
                Email: <strong style={{ color: '#0f172a' }}>{formClient.email || '-'}</strong>
              </div>
              <div>
                Metode: <strong style={{ color: '#0f172a' }}>{formPaymentMethod}</strong>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div
            style={{
              borderRadius: '16px',
              border: '1.5px solid #cbd5e1',
              overflow: 'hidden',
              marginBottom: '22px',
              background: '#ffffff',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  <th style={{ padding: '13px 18px', width: '44%' }}>Layanan / Deskripsi</th>
                  <th style={{ padding: '13px 10px', textAlign: 'center', width: '8%' }}>Qty</th>
                  <th style={{ padding: '13px 10px', textAlign: 'center', width: '12%' }}>Satuan</th>
                  <th style={{ padding: '13px 14px', textAlign: 'right', width: '18%' }}>Harga</th>
                  <th style={{ padding: '13px 18px', textAlign: 'right', width: '18%' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '14.5px', color: '#334155' }}>
                {currentItems.map((item, idx) => {
                  const sub = (item.qty || 0) * (item.price || 0);
                  const rev = item.hasRevisionFee
                    ? sub * ((settings.revisionPercent || 10) / 100)
                    : 0;
                  const rowTot = sub + rev;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        background: idx % 2 === 1 ? '#f8fafc' : '#ffffff',
                      }}
                    >
                      <td style={{ padding: '10px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <strong style={{ color: '#0f172a', fontSize: '14.5px' }}>{item.serviceName}</strong>
                          {item.hasRevisionFee && (
                            <span
                              style={{
                                background: '#fef3c7',
                                color: '#92400e',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid #fcd34d',
                              }}
                            >
                              +10% REVISI
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.3 }}>
                          {item.description || '-'}
                        </p>
                      </td>
                      <td
                        style={{
                          padding: '10px 10px',
                          textAlign: 'center',
                          fontWeight: 800,
                          color: '#0f172a',
                          verticalAlign: 'middle',
                        }}
                      >
                        {item.qty}
                      </td>
                      <td
                        style={{
                          padding: '10px 10px',
                          textAlign: 'center',
                          color: '#64748b',
                          fontSize: '13px',
                          verticalAlign: 'middle',
                        }}
                      >
                        {item.unit}
                      </td>
                      <td
                        style={{
                          padding: '10px 14px',
                          textAlign: 'right',
                          fontWeight: 600,
                          color: '#334155',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatRupiah(item.price)}
                      </td>
                      <td
                        style={{
                          padding: '10px 18px',
                          textAlign: 'right',
                          fontWeight: 800,
                          color: '#0f172a',
                          verticalAlign: 'middle',
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

          {/* Payment & Summary Block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
            {/* Left: Bank & QRIS */}
            <div
              style={{
                width: '48%',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '88px',
                  height: '88px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {settings.qrisBase64 ? (
                  <img
                    src={settings.qrisBase64}
                    alt="QRIS"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
                    <i className="fa-solid fa-qrcode" style={{ fontSize: '30px', display: 'block', marginBottom: '3px' }}></i>{' '}
                    QRIS
                  </div>
                )}
              </div>
              <div style={{ fontSize: '14px', lineHeight: 1.4 }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#4338ca',
                    display: 'block',
                    marginBottom: '2px',
                  }}
                >
                  REKENING PEMBAYARAN
                </span>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{settings.bankName}</div>
                <div
                  style={{
                    fontSize: '17px',
                    fontWeight: 900,
                    color: '#0f172a',
                    letterSpacing: '0.04em',
                    margin: '1px 0',
                  }}
                >
                  {settings.bankAcc}
                </div>
                <div style={{ color: '#64748b', fontSize: '13px' }}>a.n {settings.bankHolder}</div>
              </div>
            </div>

            {/* Right: Calculations Summary */}
            <div style={{ width: '48%', fontSize: '14.5px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <span style={{ color: '#64748b' }}>Subtotal Layanan:</span>
                <strong style={{ color: '#0f172a' }}>{formatRupiah(calculations.subtotal)}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <span style={{ color: '#64748b' }}>Biaya Revisi (+10%):</span>
                <strong style={{ color: '#b45309' }}>{formatRupiah(calculations.revisionTotal)}</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '2px solid #cbd5e1',
                  fontSize: '17px',
                  fontWeight: 800,
                }}
              >
                <span style={{ color: '#0f172a' }}>TOTAL INVOICE:</span>
                <span style={{ color: '#4338ca', fontWeight: 900 }}>
                  {formatRupiah(calculations.grandTotal)}
                </span>
              </div>
              {formInvStatus === 'DP' && calculations.dpAmount > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#059669',
                    fontWeight: 700,
                  }}
                >
                  <span>Telah Dibayar (DP):</span>
                  <span>- {formatRupiah(calculations.dpAmount)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  marginTop: '8px',
                  fontSize: '15px',
                  fontWeight: 800,
                }}
              >
                <span style={{ letterSpacing: '0.04em' }}>SISA PEMBAYARAN:</span>
                <span style={{ fontSize: '17px', fontWeight: 900, color: '#38bdf8' }}>
                  {formatRupiah(calculations.balanceDue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Terms & Footer */}
        <div style={{ width: '100%', borderTop: '1.5px solid #cbd5e1', paddingTop: '16px', marginTop: '16px' }}>
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 18px',
              fontSize: '12.5px',
              color: '#475569',
              lineHeight: 1.45,
            }}
          >
            <p
              style={{
                fontWeight: 800,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#4338ca',
                margin: '0 0 5px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <i className="fa-solid fa-circle-info"></i> KETERANGAN & KETENTUAN LAYANAN
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
              <div>• Harga sudah termasuk maksimal 3 kali revisi gratis.</div>
              <div>• Revisi ke-4+ dikenakan 10% dari nilai layanan terkait.</div>
              <div>• Layout buku dihitung proporsional per jumlah halaman.</div>
              <div>• File final resolusi tinggi dikirim setelah pembayaran lunas.</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '14px',
              fontSize: '12.5px',
              color: '#94a3b8',
            }}
          >
            <p style={{ margin: 0 }}>
              Terima kasih atas kerjasama Anda dengan{' '}
              <strong style={{ color: '#475569' }}>{settings.bizName}</strong>.
            </p>
            <p style={{ margin: 0, fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
              FORMAT 1080×1350 • HD RESMI
            </p>
          </div>
        </div>
      </div>
    );
  }
);

InvoiceExport1080.displayName = 'InvoiceExport1080';
