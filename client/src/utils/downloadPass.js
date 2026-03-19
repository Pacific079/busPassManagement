import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const downloadPassPDF = async (passData) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFillColor(15, 76, 117); // Primary color
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.text('SafarPass', pageWidth / 2, 15, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('Bus Pass Certificate', pageWidth / 2, 30, { align: 'center' });

    yPosition = 50;

    // Border box
    pdf.setDrawColor(15, 76, 117);
    pdf.setLineWidth(0.5);
    pdf.rect(15, yPosition - 5, pageWidth - 30, 140);

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    // Pass Number
    pdf.setFontSize(10);
    pdf.setTextColor(102, 102, 102);
    pdf.text('PASS NUMBER', 20, yPosition);
    pdf.setTextColor(15, 76, 117);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text(passData.passNumber || 'Not Assigned', 20, yPosition + 7);

    // Holder Info
    yPosition += 20;
    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('HOLDER NAME', 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(passData.user?.name || 'N/A', 20, yPosition + 7);

    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('EMAIL', pageWidth / 2 + 10, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    pdf.text(passData.user?.email || 'N/A', pageWidth / 2 + 10, yPosition + 7);

    // Category & Status
    yPosition += 20;
    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('CATEGORY', 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'bold');
    pdf.text(passData.category?.name || 'N/A', 20, yPosition + 7);

    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('STATUS', pageWidth / 2 + 10, yPosition);
    if (passData.status === 'Approved') {
      pdf.setTextColor(22, 163, 74);
    } else {
      pdf.setTextColor(245, 158, 11);
    }
    pdf.setFont(undefined, 'bold');
    pdf.text(passData.status || 'N/A', pageWidth / 2 + 10, yPosition + 7);

    // Route & Amount
    yPosition += 20;
    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('ROUTE', 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.text(`${passData.route?.routeNumber || 'N/A'} - ${passData.route?.routeName || 'N/A'}`, 20, yPosition + 7);

    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('AMOUNT', pageWidth / 2 + 10, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(`₹${passData.payment?.amount || '0'}`, pageWidth / 2 + 10, yPosition + 7);

    // Dates
    yPosition += 20;
    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('VALID FROM', 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');
    pdf.text(passData.validFrom ? new Date(passData.validFrom).toLocaleDateString() : 'N/A', 20, yPosition + 7);

    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('VALID UNTIL', pageWidth / 2 + 10, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');
    pdf.text(passData.validTo ? new Date(passData.validTo).toLocaleDateString() : 'N/A', pageWidth / 2 + 10, yPosition + 7);

    // QR Code
    yPosition += 30;
    try {
      const qrDataUrl = await QRCode.toDataURL(
        JSON.stringify({
          passNumber: passData.passNumber,
          holder: passData.user?.name || 'Pass Holder',
          validTo: passData.validTo,
        }),
        { width: 200 }
      );
      
      const qrSize = 40;
      const qrX = (pageWidth - qrSize) / 2;
      pdf.addImage(qrDataUrl, 'PNG', qrX, yPosition, qrSize, qrSize);
      
      pdf.setFontSize(10);
      pdf.setTextColor(102, 102, 102);
      pdf.text('Digital Verification Code', pageWidth / 2, yPosition + 45, { align: 'center' });
      pdf.setFontSize(8);
      pdf.text('Scan this QR code for verification', pageWidth / 2, yPosition + 50, { align: 'center' });
    } catch (qrError) {
      console.warn('QR Code generation failed, continuing without QR:', qrError);
    }

    // Footer
    yPosition = pageHeight - 20;
    pdf.setFontSize(8);
    pdf.setTextColor(153, 153, 153);
    pdf.text('This is a digital pass certificate. Please keep it safe and present when required.', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, yPosition + 5, { align: 'center' });

    const filename = `SafarPass_${passData.passNumber || passData._id}_${new Date().toLocaleDateString()}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
