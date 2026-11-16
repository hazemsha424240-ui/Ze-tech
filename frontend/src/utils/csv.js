// دالة مساعدة للـ CSV: بتحوّل العملاء لملف CSV وتنزّله
const COLUMNS = ['id', 'name', 'email', 'phone', 'company', 'service', 'budget', 'message', 'status', 'created_at', 'updated_at'];

function cell(value) {
  let v = String(value == null ? '' : value);
  if (/^[=+\-@]/.test(v)) v = "'" + v; // بيمنع حقن المعادلات في برامج الجداول
  return '"' + v.replace(/"/g, '""') + '"';
}

export function downloadLeadsCsv(leads) {
  const lines = [COLUMNS.join(',')].concat(leads.map((l) => COLUMNS.map((c) => cell(l[c])).join(',')));
  const blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leads.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}
