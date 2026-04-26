import { Edit2, Trash2, Phone, Mail, Award } from 'lucide-react'

export default function CustomerTable({ customers, onEdit, onDelete }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="inv-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Contact</th>
            <th>Orders</th>
            <th>Total Spent</th>
            <th>Loyalty Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>
                <div className="prod-name" style={{ fontWeight: 700 }}>{c.name}</div>
                <div className="prod-hsn">ID: #CUST-{c.id.toString().padStart(3, '0')}</div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)' }}>
                    <Phone size={12} color="var(--text-muted)" /> {c.phone}
                  </div>
                  {c.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      <Mail size={12} /> {c.email}
                    </div>
                  )}
                </div>
              </td>
              <td><span className="badge badge-info">{c.total_orders} Orders</span></td>
              <td><span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{c.spent}</span></td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontWeight: 700 }}>
                  <Award size={14} /> {c.points}
                </div>
              </td>
              <td>
                <div className="action-btns">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(c)}><Edit2 size={15} /></button>
                  <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--danger)' }} onClick={() => onDelete(c.id)}><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
