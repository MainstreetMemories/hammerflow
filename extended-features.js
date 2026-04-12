// HammerFlow - Extended Features
// Version 1.3 - More Business Tools

HammerFlow.extended = {
  // ============ CREW MANAGEMENT ============
  crews: [
    { id: 1, name: 'Crew A', members: 4, leader: 'Carlos', rate: 35 },
    { id: 2, name: 'Crew B', members: 3, leader: 'Mike', rate: 35 },
    { id: 3, name: 'Crew C', members: 2, leader: 'Joe', rate: 40 }
  ],
  
  // ============ MATERIAL PRICING ============
  materialPricing: {
    'Architectural Shingle': { cost: 85, price: 120 },
    'Metal Shingle': { cost: 4.50, price: 7.50 },
    'Underlayment': { cost: 45, price: 65 },
    'Drip Edge': { cost: 2.25, price: 3.50 },
    'Ridge Vent': { cost: 3.50, price: 5.00 },
    'Ice & Water Shield': { cost: 120, price: 175 },
    'Pipe Flashing': { cost: 8, price: 15 },
    'Starter Strip': { cost: 45, price: 65 }
  },
  
  // ============ EMAIL TEMPLATES ============
  emailTemplates: {
    leadFollowup: {
      subject: 'Following up on your roofing inquiry',
      body: `Hi {name},

Thanks for reaching out about your roofing needs! I'd love to schedule a time to discuss your project.

Our team specializes in both repairs and full replacements. We offer free inspections and competitive pricing.

What's the best time to stop by and take a look?

Best,
Your Name
HammerFlow Roofing`
    },
    estimateSent: {
      subject: 'Your Roofing Estimate - {address}',
      body: `Hi {name},

Attached is the estimate we discussed for your roofing project at {address}.

Key highlights:
- {roofType} roof
- {area} square feet
- {total} total

This estimate is valid for 30 days. Let me know if you have any questions!

Best,
Your Name`
    },
    invoiceSent: {
      subject: 'Invoice for Roofing Services - {invoiceId}',
      body: `Hi {name},

Thank you for choosing HammerFlow Roofing! Please find your invoice attached.

Invoice #: {invoiceId}
Amount Due: {total}
Due Date: {dueDate}

You can pay via:
- Check
- Card (call us)
- Zelle

Questions? Just reply!

Best,
Your Name`
    },
    jobComplete: {
      subject: 'Job Complete! - {address}',
      body: `Hi {name},

Great news - your roofing job at {address} is complete!

What's next:
- Final payment due within {terms}
- We'll mail your warranty documentation
- Feel free to leave us a review!

Thank you for your business!

Best,
Your Name`
    }
  },
  
  // ============ TEXT TEMPLATES ============
  textTemplates: {
    appointment: 'Hi {name}, this is from HammerFlow Roofing. Confirming your appointment for {date} at {time}. Reply YES to confirm or call us to reschedule.',
    arrival: 'Hi {name}, our crew is on the way! They should arrive within 30 minutes. Thanks!',
    payment: 'Hi {name}, just a reminder that invoice #{invoiceId} for ${amount} is due on {dueDate}. You can pay online or reply for other options.',
    thankYou: 'Hi {name}, thank you for choosing HammerFlow Roofing! We appreciate your business. Leave us a review: [link]'
  },
  
  // ============ CONTRACTS ============
  contractClauses: {
    payment: 'Payment terms: 50% deposit due to start work, remaining 50% due upon completion.',
    timeline: 'Estimated timeline: Work begins within 5-7 business days of deposit, weather permitting.',
    warranty: 'Standard workmanship warranty: 5 years on labor. Manufacturer warranty varies by materials.',
    cleanup: 'Crew will clean all debris and dispose of old materials. Magnet sweep for nails in driveway.',
    permit: 'Permit fees not included in estimate. We will pull permits if required.'
  },
  
  // ============ INSPECTION CHECKLIST ============
  inspectionChecklist: {
    before: [
      'Check existing roof for damage',
      'Take photos of problem areas',
      'Check flashing around chimneys',
      'Inspect valleys',
      'Check soffit/fascia',
      'Look for soft spots',
      'Check gutters',
      'Measure roof area'
    ],
    during: [
      'Remove old shingles',
      'Inspect sheathing',
      'Replace damaged boards',
      'Install underlayment',
      'Install drip edge',
      'Install shingles',
      'Install flashing',
      'Install ridge vent'
    ],
    after: [
      'Inspect for missing shingles',
      'Check flashing seals',
      'Clean up debris',
      'Magnet sweep yard',
      'Check gutters',
      'Take completion photos',
      'Review with homeowner'
    ]
  },
  
  // ============ CERTIFICATE OF COMPLETION ============
  generateCertificate(jobId) {
    const job = HammerFlow.data.jobs.find(j => j.id === jobId);
    const customer = HammerFlow.data.customers.find(c => c.name === job?.customer);
    if (!job) return null;
    
    return {
      certificateNumber: 'HC-' + jobId + '-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      customer: job.customer,
      address: job.address,
      jobType: job.type,
      startDate: job.startDate,
      completionDate: new Date().toISOString().split('T')[0],
      warranty: '5 years workmanship',
      crew: job.crew
    };
  },
  
  // ============ VEHICLE TRACKING ============
  vehicles: [
    { id: 1, name: 'Truck 1', plate: 'ABC-1234', lastService: '2026-03-15', nextService: '2026-06-15' },
    { id: 2, name: 'Truck 2', plate: 'DEF-5678', lastService: '2026-04-01', nextService: '2026-07-01' },
    { id: 3, name: 'Trailer', plate: 'TRL-001', lastService: '2026-02-20', nextService: '2026-05-20' }
  ],
  
  // ============ REMINDERS ============
  reminders: [
    { id: 1, type: 'followup', entityId: 1, date: '2026-04-15', message: 'Follow up with Mike Wilson', completed: false },
    { id: 2, type: 'payment', entityId: 'INV-002', date: '2026-04-18', message: 'Payment due - Johnson', completed: false },
    { id: 3, type: 'service', entityId: 1, date: '2026-04-20', message: 'Truck 1 service due', completed: false }
  ],
  
  // ============ FILE ATTACHMENTS ============
  attachments: [
    { id: 1, entityType: 'job', entityId: 'JOB-001', name: 'Contract.pdf', type: 'contract', date: '2026-04-08' },
    { id: 2, entityType: 'job', entityId: 'JOB-001', name: 'Insurance.pdf', type: 'insurance', date: '2026-04-08' },
    { id: 3, entityType: 'job', entityId: 'JOB-001', name: 'Permit.pdf', type: 'permit', date: '2026-04-09' }
  ],
  
  // ============ HELPERS ============
  sendEmail(templateKey, data) {
    const template = this.emailTemplates[templateKey];
    if (!template) return null;
    
    let subject = template.subject;
    let body = template.body;
    
    // Replace placeholders
    Object.keys(data).forEach(key => {
      subject = subject.replace(new RegExp('{' + key + '}', 'g'), data[key]);
      body = body.replace(new RegExp('{' + key + '}', 'g'), data[key]);
    });
    
    return { subject, body };
  },
  
  sendText(templateKey, data) {
    const template = this.textTemplates[templateKey];
    if (!template) return null;
    
    let text = template;
    Object.keys(data).forEach(key => {
      text = text.replace(new RegExp('{' + key + '}', 'g'), data[key]);
    });
    
    return text;
  }
};

// Initialize extended features
console.log('HammerFlow Extended Features loaded');

// Export
window.HammerFlow = HammerFlow;
window.HF = HammerFlow;