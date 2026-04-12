// HammerFlow - Email & PDF Functions
// v1.9 - Add email sending and PDF generation

HammerFlow.email = {
  // Email service (placeholder - needs SMTP credentials)
  service: {
    enabled: false,
    smtp: null
  },
  
  // Enable email with SMTP settings
  enable(settings) {
    this.service.enabled = true;
    this.service.smtp = settings;
    localStorage.setItem('hammerflow_email', JSON.stringify(settings));
    console.log('Email enabled');
  },
  
  // Send email
  async send(to, subject, body, attachment = null) {
    if (!this.service.enabled) {
      return { success: false, message: 'Email not configured' };
    }
    
    // Placeholder - actual sending needs nodemailer or similar
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    
    return {
      success: true,
      message: 'Email queued (SMTP not configured yet)',
      to,
      subject,
      date: new Date().toISOString()
    };
  },
  
  // Templates
  templates: {
    estimate: (estimate, customer) => ({
      subject: `Estimate for ${customer.name} - ${estimate.address}`,
      body: `
Dear ${customer.name},

Thank you for choosing HammerFlow Roofing!

I've attached your estimate for ${estimate.address}.

Estimate Summary:
- Roof Type: ${estimate.roofType}
- Area: ${estimate.area} sq ft
- Total: $${estimate.total.toLocaleString()}

This estimate is valid for 30 days.

Questions? Just reply!

Best regards,
Mark Wilson
HammerFlow Roofing
      `.trim()
    }),
    
    invoice: (invoice, customer) => ({
      subject: `Invoice #${invoice.id} - ${customer.name}`,
      body: `
Dear ${customer.name},

Please find your invoice #${invoice.id} attached.

Amount Due: $${invoice.total.toLocaleString()}
Due Date: ${invoice.dueDate}

Payment Options:
- Pay Online: [link]
- Check: Mail to address
- Zelle: [email]

Questions? Just reply!

Thank you for your business!

Best regards,
Mark Wilson
HammerFlow Roofing
      `.trim()
    }),
    
    welcome: (customer) => ({
      subject: 'Welcome to HammerFlow Roofing!',
      body: `
Dear ${customer.name},

Welcome! Thank you for choosing HammerFlow Roofing.

We're excited to help with your roofing needs.

What to expect:
- We typically respond within 24 hours
- Free inspections and estimates
- Quality workmanship guaranteed

Questions? Just reply!

Best regards,
Mark Wilson
HammerFlow Roofing
      `.trim()
    })
  }
};

HammerFlow.pdf = {
  // PDF generation (placeholder - needs library like jsPDF or pdfmake)
  generateEstimate(estimate) {
    return {
      success: true,
      type: 'estimate',
      data: estimate,
      message: 'PDF generation ready - add jsPDF library',
      downloadUrl: null // Would be blob URL when implemented
    };
  },
  
  generateInvoice(invoice) {
    return {
      success: true,
      type: 'invoice',
      data: invoice,
      message: 'PDF generation ready - add jsPDF library',
      downloadUrl: null
    };
  },
  
  generateCertificate(job) {
    const cert = {
      type: 'certificate_of_completion',
      jobId: job.id,
      customer: job.customer,
      address: job.address,
      jobType: job.type,
      completionDate: new Date().toISOString().split('T')[0],
      warranty: '5 years workmanship',
      certificateNumber: `HC-${job.id}-${Date.now()}`
    };
    
    return {
      success: true,
      type: 'certificate',
      data: cert,
      message: 'Certificate ready',
      downloadUrl: null
    };
  }
};

// Check for saved email settings
const savedEmail = localStorage.getItem('hammerflow_email');
if (savedEmail) {
  HammerFlow.email.enable(JSON.parse(savedEmail));
}

console.log('Email & PDF v1.9 loaded');
window.HammerFlow = HammerFlow;