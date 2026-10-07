import { OrderConfirmation } from '../types';

/**
 * Converts a numeric amount to Indian currency words
 */
export function numberToWordsIndian(amount: number): string {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function numBelowThousand(n: number): string {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  }

  const rounded = Math.round(amount);
  if (rounded === 0) return 'Zero Rupees Only';

  let remaining = rounded;
  let result = '';

  const crores = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  if (crores > 0) {
    result += numBelowThousand(crores) + ' Crore ';
  }

  const lakhs = Math.floor(remaining / 100000);
  remaining %= 100000;
  if (lakhs > 0) {
    result += numBelowThousand(lakhs) + ' Lakh ';
  }

  const thousands = Math.floor(remaining / 1000);
  remaining %= 1000;
  if (thousands > 0) {
    result += numBelowThousand(thousands) + ' Thousand ';
  }

  if (remaining > 0) {
    result += numBelowThousand(remaining) + ' ';
  }

  return (result.trim() + ' Rupees Only');
}

/**
 * Escapes characters for PDF literal strings
 */
function escapePdfText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, ''); // Keep standard printable ASCII
}

/**
 * Generates a valid, self-contained PDF 1.4 binary file representation
 */
export function generatePdfBlob(order: OrderConfirmation): Blob {
  const invoiceNumber = `INV-LUSI-${order.orderId.replace(/[^0-9A-Z]/g, '') || '8941'}`;
  const awbNumber = order.trackingNumber || `BLU-${order.orderId.replace(/[^0-9]/g, '') || '98210398'}`;
  const words = numberToWordsIndian(order.total);

  // PDF Page Size: A4 = 595.28 x 841.89 points
  // Origin (0,0) is bottom-left
  const contentStreamLines: string[] = [];

  // Helper to add text
  const addText = (
    text: string,
    x: number,
    y: number,
    font = '/F1',
    size = 10,
    r = 0.09,
    g = 0.08,
    b = 0.08
  ) => {
    contentStreamLines.push(
      `BT`,
      `${r} ${g} ${b} rg`,
      `${font} ${size} Tf`,
      `1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`,
      `(${escapePdfText(text)}) Tj`,
      `ET`
    );
  };

  // Helper to add a stroke line
  const addLine = (x1: number, y1: number, x2: number, y2: number, r = 0.85, g = 0.82, b = 0.78, w = 0.75) => {
    contentStreamLines.push(
      `${r} ${g} ${b} RG`,
      `${w} w`,
      `${x1.toFixed(2)} ${y1.toFixed(2)} m`,
      `${x2.toFixed(2)} ${y2.toFixed(2)} l`,
      `S`
    );
  };

  // Helper to add a filled rectangle
  const addFilledRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r = 0.98,
    g = 0.97,
    b = 0.96
  ) => {
    contentStreamLines.push(
      `${r} ${g} ${b} rg`,
      `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`,
      `f`
    );
  };

  // 1. Outer Border & Header Background
  addFilledRect(36, 740, 523, 65, 0.98, 0.97, 0.95);
  addLine(36, 805, 559, 805, 0.54, 0.35, 0.27, 2); // Gold/terra top bar
  addLine(36, 740, 559, 740, 0.88, 0.85, 0.80, 0.5);

  // Brand Header
  addText('LUSI ATELIER', 50, 782, '/F2', 18, 0.09, 0.08, 0.08);
  addText('MODERN INDIAN LUXURY', 50, 768, '/F1', 8, 0.54, 0.35, 0.27);
  addText('GSTIN: 27AABCL1234F1Z8 | CIN: U17299MH2026PTC384729', 50, 752, '/F1', 7.5, 0.45, 0.42, 0.39);

  // Invoice Title Pill (Right)
  addText('TAX INVOICE', 450, 782, '/F2', 13, 0.09, 0.08, 0.08);
  addText(`Invoice Ref: ${invoiceNumber}`, 405, 768, '/F2', 8.5, 0.15, 0.15, 0.15);
  addText(`Date: ${order.date}`, 450, 753, '/F1', 8.5, 0.45, 0.42, 0.39);

  // 2. Invoice Meta & Customer Grid
  let y = 720;
  addFilledRect(36, y - 85, 255, 95, 0.99, 0.99, 0.99);
  addFilledRect(304, y - 85, 255, 95, 0.99, 0.99, 0.99);

  addLine(36, y + 10, 291, y + 10, 0.88, 0.85, 0.80, 0.5);
  addLine(304, y + 10, 559, y + 10, 0.88, 0.85, 0.80, 0.5);

  // Left Column: Billed & Shipped To
  addText('BILLED & SHIPPED TO:', 46, y - 2, '/F2', 8.5, 0.54, 0.35, 0.27);
  addText(order.address.fullName, 46, y - 16, '/F2', 9.5, 0.09, 0.08, 0.08);
  addText(order.address.street, 46, y - 29, '/F1', 8.5, 0.35, 0.32, 0.30);
  if (order.address.apartment) {
    addText(order.address.apartment, 46, y - 41, '/F1', 8.5, 0.35, 0.32, 0.30);
    y -= 12;
  }
  addText(`${order.address.city}, ${order.address.state} - ${order.address.pincode}`, 46, y - 41, '/F1', 8.5, 0.35, 0.32, 0.30);
  addText(`Contact Phone: +91 ${order.address.phone}`, 46, y - 53, '/F1', 8, 0.45, 0.42, 0.39);
  addText(`State / Place of Supply: ${order.address.state} (Code 27)`, 46, y - 65, '/F1', 8, 0.45, 0.42, 0.39);

  // Right Column: Order Details
  y = 720;
  addText('ORDER & DISPATCH METRICS:', 314, y - 2, '/F2', 8.5, 0.54, 0.35, 0.27);
  addText(`Order ID: #${order.orderId}`, 314, y - 16, '/F2', 9.5, 0.09, 0.08, 0.08);
  addText(`Booking Date: ${order.date}`, 314, y - 29, '/F1', 8.5, 0.35, 0.32, 0.30);
  addText(`Payment Method: ${order.address.paymentMethod.toUpperCase()}`, 314, y - 41, '/F1', 8.5, 0.35, 0.32, 0.30);
  addText(`Payment Status: ${order.paymentStatus || 'Verified & Settled'}`, 314, y - 53, '/F1', 8.5, 0.15, 0.45, 0.25);
  addText(`Courier / AWB: ${order.courier || 'Blue Dart Air'} - ${awbNumber}`, 314, y - 65, '/F1', 8, 0.45, 0.42, 0.39);

  // 3. Table Header
  y = 615;
  addFilledRect(36, y, 523, 20, 0.94, 0.92, 0.89);
  addLine(36, y + 20, 559, y + 20, 0.80, 0.76, 0.70, 0.75);
  addLine(36, y, 559, y, 0.80, 0.76, 0.70, 0.75);

  addText('#', 44, y + 6, '/F2', 8, 0.35, 0.30, 0.25);
  addText('ITEM DESCRIPTION', 66, y + 6, '/F2', 8, 0.35, 0.30, 0.25);
  addText('HSN', 285, y + 6, '/F2', 8, 0.35, 0.30, 0.25);
  addText('QTY', 340, y + 6, '/F2', 8, 0.35, 0.30, 0.25);
  addText('RATE (INR)', 380, y + 6, '/F2', 8, 0.35, 0.30, 0.25);
  addText('TAX (5%)', 450, y + 6, '/F2', 8, 0.35, 0.30, 0.25);
  addText('AMOUNT (INR)', 500, y + 6, '/F2', 8, 0.35, 0.30, 0.25);

  // 4. Item Rows
  y -= 6;
  order.items.forEach((item, index) => {
    const itemSubtotal = item.product.price * item.quantity;
    const itemGst = Math.round(itemSubtotal * 0.05);
    const itemNet = itemSubtotal;

    y -= 26;
    // Row separator
    addLine(36, y - 4, 559, y - 4, 0.92, 0.90, 0.87, 0.5);

    addText(`${index + 1}`, 44, y + 8, '/F1', 8, 0.45, 0.42, 0.39);

    // Truncate name if long
    const cleanName = item.product.name.length > 36 ? item.product.name.substring(0, 34) + '...' : item.product.name;
    addText(cleanName, 66, y + 10, '/F2', 8.5, 0.09, 0.08, 0.08);

    const desc = `${item.selectedColor.name} | Size: ${item.selectedSize} | ${item.product.category}`;
    addText(desc, 66, y, '/F1', 7.5, 0.50, 0.46, 0.42);

    addText('6204', 285, y + 6, '/F1', 8, 0.45, 0.42, 0.39);
    addText(`${item.quantity}`, 345, y + 6, '/F2', 8.5, 0.09, 0.08, 0.08);
    addText(`${item.product.price.toLocaleString('en-IN')}`, 380, y + 6, '/F1', 8.5, 0.25, 0.23, 0.21);
    addText(`${itemGst.toLocaleString('en-IN')}`, 452, y + 6, '/F1', 8, 0.45, 0.42, 0.39);
    addText(`${itemNet.toLocaleString('en-IN')}`, 505, y + 6, '/F2', 8.5, 0.09, 0.08, 0.08);
  });

  // 5. Financial Summary Box
  y -= 25;
  addFilledRect(320, y - 95, 239, 105, 0.98, 0.97, 0.95);
  addLine(320, y + 10, 559, y + 10, 0.85, 0.82, 0.78, 0.75);
  addLine(320, y - 95, 559, y - 95, 0.85, 0.82, 0.78, 0.75);
  addLine(320, y - 95, 320, y + 10, 0.85, 0.82, 0.78, 0.75);
  addLine(559, y - 95, 559, y + 10, 0.85, 0.82, 0.78, 0.75);

  let sumY = y - 4;
  addText('Subtotal (Gross):', 332, sumY, '/F1', 8.5, 0.40, 0.36, 0.33);
  addText(`INR ${order.subtotal.toLocaleString('en-IN')}`, 480, sumY, '/F1', 8.5, 0.09, 0.08, 0.08);

  sumY -= 16;
  addText('Express Air Courier:', 332, sumY, '/F1', 8.5, 0.40, 0.36, 0.33);
  addText(order.shipping === 0 ? 'COMPLIMENTARY' : `INR ${order.shipping}`, 480, sumY, '/F1', 8, 0.15, 0.50, 0.25);

  if (order.discount > 0) {
    sumY -= 16;
    addText('Privilege Discount:', 332, sumY, '/F1', 8.5, 0.15, 0.50, 0.25);
    addText(`- INR ${order.discount.toLocaleString('en-IN')}`, 480, sumY, '/F2', 8.5, 0.15, 0.50, 0.25);
  }

  sumY -= 16;
  addText('Integrated GST (5% Incl.):', 332, sumY, '/F1', 8, 0.40, 0.36, 0.33);
  const approxGst = Math.round(order.total * 0.05 / 1.05);
  addText(`INR ${approxGst.toLocaleString('en-IN')}`, 480, sumY, '/F1', 8, 0.45, 0.42, 0.39);

  sumY -= 20;
  addLine(328, sumY + 14, 551, sumY + 14, 0.80, 0.76, 0.70, 0.75);
  addText('TOTAL INVOICE VALUE:', 332, sumY, '/F2', 9, 0.09, 0.08, 0.08);
  addText(`INR ${order.total.toLocaleString('en-IN')}`, 478, sumY, '/F2', 11, 0.54, 0.35, 0.27);

  // 6. Amount in Words & Notes (Left Side)
  addText('AMOUNT CHARGEABLE (IN WORDS):', 36, y - 10, '/F2', 8, 0.54, 0.35, 0.27);
  addText(words, 36, y - 24, '/F2', 8.5, 0.09, 0.08, 0.08);

  addText('BANKING & SETTLEMENT TERMS:', 36, y - 44, '/F2', 8, 0.40, 0.36, 0.33);
  addText('All luxury garments crafted with certified handlooms.', 36, y - 56, '/F1', 7.5, 0.45, 0.42, 0.39);
  addText('7 Days Doorstep Return & Exchange Guaranteed.', 36, y - 68, '/F1', 7.5, 0.45, 0.42, 0.39);
  addText('This is a verified digital tax invoice under GST Rules 2017.', 36, y - 80, '/F1', 7.5, 0.45, 0.42, 0.39);

  // 7. Footer & Signature
  y = 110;
  addLine(36, y + 25, 559, y + 25, 0.85, 0.82, 0.78, 0.5);

  addText('LUSI Modern Indian Atelier - Registered Office: Kala Ghoda Arts Enclave, Fort, Mumbai 400001', 36, y + 12, '/F1', 7.5, 0.50, 0.46, 0.42);
  addText('Support Concierge: +91-7248596540 | Email: Help@lusi.in | Portal: https://lusi.in', 36, y + 1, '/F1', 7.5, 0.50, 0.46, 0.42);

  // Digital Signatory Stamp
  addFilledRect(380, y - 45, 179, 38, 0.97, 0.96, 0.94);
  addLine(380, y - 45, 559, y - 45, 0.85, 0.82, 0.78, 0.5);
  addLine(380, y - 7, 559, y - 7, 0.85, 0.82, 0.78, 0.5);
  addLine(380, y - 45, 380, y - 7, 0.85, 0.82, 0.78, 0.5);
  addLine(559, y - 45, 559, y - 7, 0.85, 0.82, 0.78, 0.5);

  addText('FOR LUSI ATELIER PRIVATE LIMITED', 390, y - 18, '/F2', 7.5, 0.25, 0.22, 0.20);
  addText('[Digitally Signed & Authenticated]', 395, y - 29, '/F1', 7, 0.54, 0.35, 0.27);
  addText('Authorised Signatory - Accounts Division', 390, y - 40, '/F1', 7, 0.45, 0.42, 0.39);

  // Assembly of PDF syntax
  const streamBody = contentStreamLines.join('\n');
  const streamLength = streamBody.length;

  const objects: string[] = [];

  // Object 1: Catalog
  objects.push(`1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj`);

  // Object 2: Pages
  objects.push(`2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj`);

  // Object 3: Page
  objects.push(`3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595.28 841.89]
  /Resources <<
    /Font <<
      /F1 4 0 R
      /F2 5 0 R
    >>
  >>
  /Contents 6 0 R
>>
endobj`);

  // Object 4: Font F1 (Helvetica)
  objects.push(`4 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj`);

  // Object 5: Font F2 (Helvetica-Bold)
  objects.push(`5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj`);

  // Object 6: Stream
  objects.push(`6 0 obj
<<
  /Length ${streamLength}
>>
stream
${streamBody}
endstream
endobj`);

  // Build final file with offsets and xref table
  let pdfString = `%PDF-1.4\n`;
  const offsets: number[] = [0];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdfString.length);
    pdfString += objects[i] + `\n`;
  }

  const xrefOffset = pdfString.length;
  pdfString += `xref\n0 ${objects.length + 1}\n`;
  pdfString += `0000000000 65535 f \n`;

  for (let i = 1; i <= objects.length; i++) {
    const offStr = String(offsets[i]).padStart(10, '0');
    pdfString += `${offStr} 00000 n \n`;
  }

  pdfString += `trailer\n<<\n  /Size ${objects.length + 1}\n  /Root 1 0 R\n>>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return new Blob([pdfString], { type: 'application/pdf' });
}

/**
 * Triggers browser download of simulated PDF invoice
 */
export function downloadInvoicePdf(order: OrderConfirmation): void {
  const blob = generatePdfBlob(order);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `LUSI-Invoice-${order.orderId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
