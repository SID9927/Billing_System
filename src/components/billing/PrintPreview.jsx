import { X, Printer, Download, MessageSquare, FileText, User } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import './PrintPreview.css'

export default function PrintPreview({ bill, onClose }) {
  const { settings } = useSettings()
  const date = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

  const handleWhatsAppShare = () => {
    const divider = '━━━━━━━━━━━━━━━━'
    const itemsText = bill.items.map(i => `*${i.name}*\n${i.qty} qty × ₹${i.price} = *₹${(i.price * i.qty).toFixed(2)}*`).join('\n\n')
    
    const message = 
`*${settings.shop_name.toUpperCase()}*
${settings.address}
*GSTIN:* ${settings.gstin}

${divider}
*INVOICE:* #${bill.id}
*DATE:* ${date}
${divider}

*CUSTOMER:* ${bill.customer?.name || 'Valued Guest'}
*MOBILE:* ${bill.customer?.phone || 'N/A'}

${divider}
*ITEMS:*

${itemsText}

${divider}
*BILL SUMMARY:*
Subtotal: ₹${bill.subtotal.toFixed(2)}
CGST (${(bill.gst_rate / 2).toFixed(1)}%): ₹${(bill.gst_amount / 2).toFixed(2)}
SGST (${(bill.gst_rate / 2).toFixed(1)}%): ₹${(bill.gst_amount / 2).toFixed(2)}

*GRAND TOTAL: ₹${bill.total.toFixed(2)}*
${bill.advance_paid !== undefined ? `Advance Paid: ₹${bill.advance_paid.toFixed(2)}
*BALANCE DUE: ₹${(bill.total - bill.advance_paid).toFixed(2)}*
` : ''}${divider}

${settings.bill_footer}
_Powered by Kharchaa_`

    const encodedMsg = encodeURIComponent(message)
    const recipientPhone = (bill.customer?.phone || settings.phone).replace(/[^0-9]/g, '')
    const finalPhone = recipientPhone.length === 10 ? `91${recipientPhone}` : recipientPhone
    
    window.open(`https://wa.me/${finalPhone}?text=${encodedMsg}`, '_blank')
  }

  const handleDownloadPDF = async () => {
    const element = document.getElementById('bill-content')
    const toastId = toast.loading('Generating PDF...')
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8)
      const imgWidth = 80 
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [imgWidth, imgHeight + 10]
      })
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
      
      const blob = pdf.output('blob')

      // Use Native File System API if available (Modern Chrome/Edge)
      if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: `Bill_${bill.id}.pdf`,
          types: [{
            description: 'PDF Document',
            accept: { 'application/pdf': ['.pdf'] },
          }],
        })
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
      } else {
        // Fallback for older browsers
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Bill_${bill.id}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
      
      toast.success('PDF Saved Successfully!', { id: toastId })
    } catch (err) {
      console.error('PDF Generation failed', err)
      toast.error('Failed to generate PDF', { id: toastId })
    }
  }

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="modal-box receipt-preview-box animate-fadeInUp" onClick={e => e.stopPropagation()}>
        <div className="receipt-modal-header">
          <h2 className="modal-title-sm">Bill Preview</h2>
          <button className="btn-close-sm" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body receipt-scroll-area">
          <div className="thermal-receipt" id="bill-content">
            <div className="receipt-header">
              <h2 className="receipt-shop-name">{settings.shop_name}</h2>
              <p className="receipt-shop-info">{settings.address}</p>
              <p className="receipt-shop-info">GSTIN: {settings.gstin}</p>
              <p className="receipt-shop-info">Ph: {settings.phone}</p>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-customer-info">
              <p><strong>Customer:</strong> {bill.customer?.name || 'Walk-in Customer'}</p>
              <p><strong>Mobile:</strong> {bill.customer?.phone || 'Not Provided'}</p>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-meta">
              <span>Bill #: {bill.id}</span>
              <span>Date: {date}</span>
            </div>

            <div className="receipt-divider" />

            <table className="receipt-table">
              <thead>
                <tr>
                  <th align="left">Item</th>
                  <th align="center">Qty</th>
                  <th align="right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <p className="item-name">{item.name}</p>
                      <p className="item-details">@{Number(item.price).toFixed(2)}/{item.unit || 'pc'}</p>
                    </td>
                    <td align="center">{item.qty}</td>
                    <td align="right">₹{(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="receipt-divider" />

            <div className="receipt-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>CGST ({(bill.gst_rate / 2).toFixed(1)}%)</span>
                <span>₹{(bill.gst_amount / 2).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>SGST ({(bill.gst_rate / 2).toFixed(1)}%)</span>
                <span>₹{(bill.gst_amount / 2).toFixed(2)}</span>
              </div>
              {bill.discount > 0 && (
                <div className="total-row discount">
                  <span>Discount</span>
                  <span>-₹{bill.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="receipt-divider" />
              <div className="total-row grand-total">
                <span>GRAND TOTAL</span>
                <span>₹{bill.total.toFixed(2)}</span>
              </div>
              
              {/* Custom Order Specifics */}
              {bill.advance_paid !== undefined && (
                <>
                  <div className="total-row" style={{ marginTop: '4px', fontSize: '11px' }}>
                    <span>Advance Paid</span>
                    <span style={{ color: 'var(--success)' }}>₹{bill.advance_paid.toFixed(2)}</span>
                  </div>
                  {(bill.total - bill.advance_paid) > 0 && (
                    <div className="total-row grand-total" style={{ marginTop: '8px', color: 'var(--danger)' }}>
                      <span>BALANCE DUE</span>
                      <span>₹{(bill.total - bill.advance_paid).toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="receipt-divider" />

            <div className="receipt-footer">
              <p className="footer-msg">{settings.bill_footer}</p>
              <p className="footer-tagline">Powered by Kharchaa</p>
            </div>
          </div>
        </div>

        <div className="receipt-modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
          <button className="btn btn-ghost btn-sm" onClick={handleDownloadPDF} style={{ border: '1px solid var(--border)' }}>
            <FileText size={16} /> Save PDF
          </button>
          <button className="btn btn-success btn-sm" onClick={handleWhatsAppShare} style={{ background: '#25D366', border: 'none', color: 'white' }}>
            <MessageSquare size={16} /> WhatsApp
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>
    </div>
  )
}
