import jsPDF from 'jspdf';

interface Member {
  name: string;
  member_type: 'adult' | 'child';
  age: number;
}

interface RegistrationData {
  name: string;
  mobile_number: string;
  email: string;
  members: Member[];
}

export const generateRegistrationPDF = (data: RegistrationData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header with proper alignment
  doc.setFillColor(0, 76, 153); // Rotary Blue
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Rotary Logo placeholder and text
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('ROTARY INTERNATIONAL', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('DISTRICT 3233', pageWidth / 2, 28, { align: 'center' });
  
  doc.setFontSize(20);
  doc.setTextColor(255, 204, 0); // Golden yellow
  doc.text('PONGAL FESTIVAL 2025', pageWidth / 2, 40, { align: 'center' });

  // Main content area
  yPosition = 65;
  doc.setTextColor(0, 0, 0);
  
  // Title box
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPosition - 5, pageWidth - 40, 20, 'F');
  doc.setDrawColor(0, 76, 153);
  doc.setLineWidth(0.5);
  doc.rect(20, yPosition - 5, pageWidth - 40, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 76, 153);
  doc.text('REGISTRATION CONFIRMATION', pageWidth / 2, yPosition + 7, { align: 'center' });

  yPosition += 30;
  
  // Registration details box
  doc.setFillColor(250, 250, 250);
  doc.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, yPosition - 5, pageWidth - 40, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const regId = `REG-PF-${Date.now().toString().slice(-6)}`;
  const regDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  doc.text(`Registration ID: ${regId}`, 25, yPosition + 5);
  doc.text(`Registration Date: ${regDate}`, 25, yPosition + 12);

  yPosition += 35;

  // Primary Contact Section
  doc.setFillColor(0, 76, 153);
  doc.rect(20, yPosition - 2, pageWidth - 40, 12, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('PRIMARY CONTACT INFORMATION', 25, yPosition + 6);

  yPosition += 20;
  
  // Contact details in a structured table format
  const contactData = [
    { label: 'Full Name', value: data.name },
    { label: 'Mobile Number', value: data.mobile_number },
    { label: 'Email Address', value: data.email }
  ];

  contactData.forEach((item, index) => {
    const rowY = yPosition + (index * 15);
    
    // Alternating row colors
    if (index % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(20, rowY - 3, pageWidth - 40, 12, 'F');
    }
    
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(20, rowY + 9, pageWidth - 20, rowY + 9);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(item.label + ':', 25, rowY + 4);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(item.value, 70, rowY + 4);
  });

  yPosition += (contactData.length * 15) + 10;

  if (data.members.length > 0) {
    // Members section header
    doc.setFillColor(0, 76, 153);
    doc.rect(20, yPosition - 2, pageWidth - 40, 12, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`REGISTERED MEMBERS (${data.members.length})`, 25, yPosition + 6);

    yPosition += 20;

    // Table header
    const tableStartY = yPosition;
    const rowHeight = 8;
    const colWidths = [15, 65, 45, 25]; // S.No, Name, Type, Age
    const colPositions = [25, 40, 105, 150];
    
    // Header row
    doc.setFillColor(230, 230, 230);
    doc.rect(20, yPosition - 2, pageWidth - 40, rowHeight, 'F');
    doc.setDrawColor(180, 180, 180);
    doc.rect(20, yPosition - 2, pageWidth - 40, rowHeight);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('S.No', colPositions[0], yPosition + 4);
    doc.text('Member Name', colPositions[1], yPosition + 4);
    doc.text('Member Type', colPositions[2], yPosition + 4);
    doc.text('Age', colPositions[3], yPosition + 4);
    
    // Vertical lines for table
    colPositions.forEach((pos, index) => {
      if (index > 0) {
        doc.line(pos - 5, yPosition - 2, pos - 5, yPosition + 6);
      }
    });

    yPosition += rowHeight + 2;

    data.members.forEach((member, index) => {
      // Check for page break
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
        
        // Add mini header to new page
        doc.setFillColor(0, 76, 153);
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text('ROTARY DISTRICT 3233 - PONGAL FESTIVAL', pageWidth / 2, 20, { align: 'center' });
        yPosition = 40;
        
        // Recreate table header
        doc.setFillColor(230, 230, 230);
        doc.rect(20, yPosition - 2, pageWidth - 40, rowHeight, 'F');
        doc.setDrawColor(180, 180, 180);
        doc.rect(20, yPosition - 2, pageWidth - 40, rowHeight);
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text('S.No', colPositions[0], yPosition + 4);
        doc.text('Member Name', colPositions[1], yPosition + 4);
        doc.text('Member Type', colPositions[2], yPosition + 4);
        doc.text('Age', colPositions[3], yPosition + 4);
        
        yPosition += rowHeight + 2;
      }

      // Data row
      const currentRowY = yPosition;
      
      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(20, currentRowY - 2, pageWidth - 40, rowHeight, 'F');
      }
      
      // Row border
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.rect(20, currentRowY - 2, pageWidth - 40, rowHeight);
      
      // Vertical lines
      colPositions.forEach((pos, colIndex) => {
        if (colIndex > 0) {
          doc.line(pos - 5, currentRowY - 2, pos - 5, currentRowY + 6);
        }
      });

      // Data
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text((index + 1).toString(), colPositions[0], currentRowY + 4);
      doc.text(member.name, colPositions[1], currentRowY + 4);
      doc.text(member.member_type.charAt(0).toUpperCase() + member.member_type.slice(1), colPositions[2], currentRowY + 4);
      doc.text(member.age.toString(), colPositions[3], currentRowY + 4);

      yPosition += rowHeight;
    });
    
    yPosition += 10;
  }

  // Summary section
  yPosition += 10;
  
  // Event details box
  doc.setFillColor(245, 251, 255);
  doc.rect(20, yPosition - 2, pageWidth - 40, 35, 'F');
  doc.setDrawColor(0, 76, 153);
  doc.setLineWidth(0.5);
  doc.rect(20, yPosition - 2, pageWidth - 40, 35);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 76, 153);
  doc.text('EVENT DETAILS', 25, yPosition + 8);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Festival: Pongal Celebration 2025', 25, yPosition + 18);
  doc.text('Organizer: Rotary International District 3233', 25, yPosition + 25);
  
  yPosition += 50;

  // Check if we need a new page for footer
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 30;
  }

  // Thank you message
  doc.setFillColor(255, 248, 225);
  doc.rect(20, yPosition - 5, pageWidth - 40, 25, 'F');
  doc.setDrawColor(255, 204, 0);
  doc.setLineWidth(0.5);
  doc.rect(20, yPosition - 5, pageWidth - 40, 25);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 76, 153);
  doc.text('Thank You for Your Registration!', pageWidth / 2, yPosition + 5, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('May this Pongal bring prosperity, joy, and abundant harvest to you and your family.', pageWidth / 2, yPosition + 12, { align: 'center' });

  yPosition += 35;
  
  // Footer with contact and motto
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  
  yPosition += 8;
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Please keep this confirmation for your records and bring it to the event.', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.setFontSize(8);
  doc.setTextColor(0, 76, 153);
  doc.text('"Service Above Self"', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  doc.setTextColor(150, 150, 150);
  doc.text('Rotary International District 3233 | www.rotary.org', pageWidth / 2, yPosition, { align: 'center' });

  const fileName = `Pongal_Festival_Registration_${data.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
};
