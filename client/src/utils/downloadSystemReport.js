import jsPDF from 'jspdf';

const fmtDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString();
};

const addWrappedLine = (pdf, text, x, y, maxWidth, lineHeight = 6) => {
  const lines = pdf.splitTextToSize(String(text), maxWidth);
  lines.forEach((line) => {
    pdf.text(line, x, y.value);
    y.value += lineHeight;
  });
};

export const downloadSystemReportPDF = (report) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const usableWidth = pageWidth - margin * 2;
  const y = { value: 18 };

  const ensurePage = () => {
    if (y.value > pageHeight - 14) {
      pdf.addPage();
      y.value = 16;
    }
  };

  const addTitle = (title) => {
    ensurePage();
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(15);
    pdf.text(title, margin, y.value);
    y.value += 8;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
  };

  const addKeyValue = (key, value) => {
    ensurePage();
    pdf.setFont(undefined, 'bold');
    pdf.text(`${key}:`, margin, y.value);
    pdf.setFont(undefined, 'normal');
    addWrappedLine(pdf, value, margin + 38, y, usableWidth - 38);
  };

  const addSectionDivider = () => {
    ensurePage();
    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin, y.value, pageWidth - margin, y.value);
    y.value += 6;
  };

  addTitle('SafarPass - Full System Report');
  addKeyValue('Generated At', fmtDate(report.generatedAt));
  addSectionDivider();

  addTitle('Summary');
  Object.entries(report.stats || {}).forEach(([k, v]) => {
    addKeyValue(k, v);
  });
  addSectionDivider();

  addTitle(`Users (${report.users?.length || 0})`);
  (report.users || []).forEach((u, idx) => {
    ensurePage();
    addKeyValue(`#${idx + 1}`, `${u.name || '-'} | ${u.email || '-'} | ${u.phone || '-'} | ${u.isActive ? 'Active' : 'Inactive'}`);
    addKeyValue('Joined', fmtDate(u.createdAt));
  });
  addSectionDivider();

  addTitle(`Passes (${report.passes?.length || 0})`);
  (report.passes || []).forEach((p, idx) => {
    ensurePage();
    addKeyValue(`#${idx + 1}`, `${p.passNumber || '-'} | ${p.status || '-'} | ${p.user?.name || '-'} | ${p.category?.name || '-'}`);
    addKeyValue('Route', `${p.route?.routeNumber || '-'} - ${p.route?.routeName || '-'}`);
    addKeyValue('Applied', fmtDate(p.createdAt));
  });
  addSectionDivider();

  addTitle(`Payments (${report.payments?.length || 0})`);
  (report.payments || []).forEach((p, idx) => {
    ensurePage();
    addKeyValue(`#${idx + 1}`, `${p.transactionId || '-'} | ₹${p.amount || 0} | ${p.status || '-'} | ${p.user?.name || '-'}`);
    addKeyValue('Paid / recorded', fmtDate(p.paidAt || p.createdAt));
  });
  addSectionDivider();

  addTitle(`Categories (${report.categories?.length || 0})`);
  (report.categories || []).forEach((c, idx) => {
    ensurePage();
    addKeyValue(`#${idx + 1}`, `${c.name || '-'} | ₹${c.price || 0} | ${c.duration || 0} days | ${c.isActive ? 'Active' : 'Inactive'}`);
  });
  addSectionDivider();

  addTitle(`Routes (${report.routes?.length || 0})`);
  (report.routes || []).forEach((r, idx) => {
    ensurePage();
    addKeyValue(`#${idx + 1}`, `${r.routeNumber || '-'} - ${r.routeName || '-'}`);
    addKeyValue('Path', `${r.startPoint || '-'} -> ${r.endPoint || '-'}`);
  });

  pdf.save(`system-report-${new Date().toISOString().slice(0, 10)}.pdf`);
};
