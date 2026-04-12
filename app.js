// HammerFlow - Advanced JavaScript with Job Costing
// Version 1.2 - April 2026

// ============ DATA STORE ============
const HammerFlow = {
  data: {
    leads: [],
    customers: [],
    jobs: [],
    estimates: [],
    invoices: [],
    inventory: [],
    jobCosts: [], // Track actual costs vs estimate
    photos: [] // Store photo references
  },
  
  // Load from localStorage
  load() {
    const saved = localStorage.getItem('hammerflow_data');
    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      this.data = this.getDefaultData();
    }
  },
  
  getDefaultData() {
    return {
      leads: [
        { id: 1, name: 'Mike Wilson', phone: '555-123-4567', email: 'mike@email.com', address: '123 Main St', source: 'Google', status: 'new', followup: '2026-04-12', notes: '', created: '2026-04-11' },
        { id: 2, name: 'Sarah Johnson', phone: '555-234-5678', email: 'sarah@email.com', address: '456 Oak Ave', source: 'Referral', status: 'scheduled', followup: '2026-04-14', notes: 'Interested in metal roof', created: '2026-04-10' },
        { id: 3, name: 'Tom Brown', phone: '555-345-6789', email: 'tom@email.com', address: '789 Pine Rd', source: 'Door Knock', status: 'contacted', followup: '2026-04-15', notes: '', created: '2026-04-09' }
      ],
      customers: [
        { id: 1, name: 'John Smith', phone: '555-111-2222', email: 'john@email.com', address: '123 Oak St', mailing: '123 Oak St', jobs: 3, totalSpent: 18500, created: '2025-06-15' },
        { id: 2, name: 'Mary Johnson', phone: '555-333-4444', email: 'mary@email.com', address: '456 Maple Dr', mailing: '456 Maple Dr', jobs: 1, totalSpent: 4200, created: '2025-08-20' }
      ],
      jobs: [
        { id: 'JOB-001', customerId: 1, customer: 'Smith Family', address: '123 Oak St', type: 'Replace', status: 'scheduled', startDate: '2026-04-10', endDate: '', crew: 'Crew A', value: 8500, notes: '', created: '2026-04-08' },
        { id: 'JOB-002', customerId: 2, customer: 'Johnson', address: '456 Maple Dr', type: 'Repair', status: 'new', startDate: '2026-04-15', endDate: '', crew: '', value: 1200, notes: '', created: '2026-04-11' }
      ],
      estimates: [
        { id: 'EST-001', customerId: 1, customer: 'Williams', address: '789 Pine Rd', type: 'Full Replace', roofType: 'Shingle', area: 2500, materials: 4500, labor: 3000, overhead: 15, profit: 20, tax: 8, total: 12000, status: 'scheduled', date: '2026-04-10' },
        { id: 'EST-002', customerId: 3, customer: 'Brown', address: '321 Cedar Ln', type: 'Repair', roofType: 'Shingle', area: 400, materials: 300, labor: 400, overhead: 15, profit: 20, tax: 8, total: 800, status: 'new', date: '2026-04-12' }
      ],
      invoices: [
        { id: 'INV-001', jobId: 'JOB-001', customerId: 1, customer: 'Smith', amount: 4500, tax: 360, total: 4860, status: 'paid', dueDate: '2026-04-01', paidDate: '2026-04-05', paymentMethod: 'Check' },
        { id: 'INV-002', jobId: 'JOB-002', customerId: 2, customer: 'Johnson', amount: 1200, tax: 96, total: 1296, status: 'pending', dueDate: '2026-04-20', paidDate: null, paymentMethod: null },
        { id: 'INV-003', jobId: 'JOB-003', customerId: 4, customer: 'Davis', amount: 6800, tax: 544, total: 7344, status: 'overdue', dueDate: '2026-04-01', paidDate: null, paymentMethod: null }
      ],
      inventory: [
        { id: 1, name: 'Architectural Shingles', unit: 'bundle', cost: 85, qty: 45, minStock: 20 },
        { id: 2, name: 'Metal Shingles', unit: 'sq ft', cost: 4.50, qty: 12, minStock: 50 },
        { id: 3, name: 'Underlayment', unit: 'roll', cost: 45, qty: 8, minStock: 10 },
        { id: 4, name: 'Drip Edge', unit: 'ft', cost: 2.25, qty: 500, minStock: 200 },
        { id: 5, name: 'Ridge Vent', unit: 'ft', cost: 3.50, qty: 150, minStock: 50 },
        { id: 6, name: 'Ice & Water Shield', unit: 'roll', cost: 120, qty: 4, minStock: 5 }
      ],
      jobCosts: [
        { id: 1, jobId: 'JOB-001', category: 'Materials', description: 'Shingles purchased', amount: 2800, date: '2026-04-08' },
        { id: 2, jobId: 'JOB-001', category: 'Labor', description: 'Crew A - Day 1', amount: 800, date: '2026-04-10' },
        { id: 3, jobId: 'JOB-001', category: 'Disposal', description: 'Dumpster rental', amount: 350, date: '2026-04-10' }
      ],
      photos: []
    };
  },
  
  save() {
    localStorage.setItem('hammerflow_data', JSON.stringify(this.data));
  },
  
  // ============ ROOFING CALCULATORS ============
  calculators: {
    // Roof area calculator with pitch factors
    roofArea(length, width, pitch) {
      const pitchFactors = {
        'flat': 1.0, '1/12': 1.003, '2/12': 1.014, '3/12': 1.031,
        '4/12': 1.054, '5/12': 1.083, '6/12': 1.118, '7/12': 1.158,
        '8/12': 1.202, '9/12': 1.250, '10/12': 1.302, '11/12': 1.356, '12/12': 1.414
      };
      const factor = pitchFactors[pitch] || 1.0;
      return Math.round(length * width * factor);
    },
    
    // Estimate calculator
    calculateEstimate(materials, labor, overheadPercent = 15, profitPercent = 20, taxRate = 8) {
      const subtotal = materials + labor;
      const overhead = subtotal * (overheadPercent / 100);
      const profit = (subtotal + overhead) * (profitPercent / 100);
      const subtax = subtotal + overhead + profit;
      const tax = subtax * (taxRate / 100);
      return {
        materials,
        labor,
        subtotal,
        overhead,
        profit,
        tax,
        total: subtax + tax
      };
    },
    
    // Square to bundle converter (3 bundles per square)
    squaresToBundles(squares) {
      return squares * 3;
    },
    
    // Material calculator for shingles
    calculateShingles(sqft, shinglesPerBundle = 30) {
      const squares = sqft / 100;
      const bundles = Math.ceil(squares * 3);
      return { squares, bundles };
    }
  },
  
  // ============ JOB COSTING ============
  jobCosting: {
    addCost(jobId, category, description, amount) {
      const cost = {
        id: Date.now(),
        jobId,
        category,
        description,
        amount,
        date: new Date().toISOString().split('T')[0]
      };
      HammerFlow.data.jobCosts.push(cost);
      HammerFlow.save();
      return cost;
    },
    
    getCostsForJob(jobId) {
      return HammerFlow.data.jobCosts.filter(c => c.jobId === jobId);
    },
    
    getTotalCostForJob(jobId) {
      return this.getCostsForJob(jobId).reduce((sum, c) => sum + c.amount, 0);
    },
    
    getProfitForJob(jobId) {
      const job = HammerFlow.data.jobs.find(j => j.id === jobId);
      if (!job) return 0;
      const costs = this.getTotalCostForJob(jobId);
      return job.value - costs;
    },
    
    getMarginForJob(jobId) {
      const job = HammerFlow.data.jobs.find(j => j.id === jobId);
      if (!job || !job.value) return 0;
      const profit = this.getProfitForJob(jobId);
      return Math.round((profit / job.value) * 100);
    }
  },
  
  // ============ REPORTS ============
  reports: {
    getDashboardStats() {
      const data = HammerFlow.data;
      const revenue = data.invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
      const outstanding = data.invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.total, 0);
      const activeJobs = data.jobs.filter(j => j.status === 'scheduled' || j.status === 'in_progress').length;
      const pendingLeads = data.leads.filter(l => l.status !== 'converted' && l.status !== 'lost').length;
      const overdueInvoices = data.invoices.filter(i => i.status === 'overdue').length;
      const lowStock = data.inventory.filter(i => i.qty < i.minStock).length;
      
      return { revenue, outstanding, activeJobs, pendingLeads, overdueInvoices, lowStock };
    },
    
    getMonthlyRevenue() {
      const months = {};
      HammerFlow.data.invoices
        .filter(i => i.status === 'paid' && i.paidDate)
        .forEach(inv => {
          const month = inv.paidDate.substring(0, 7);
          months[month] = (months[month] || 0) + inv.total;
        });
      return months;
    }
  },
  
  // ============ CRUD OPERATIONS ============
  addLead(data) {
    const id = Date.now();
    const lead = { ...data, id, created: new Date().toISOString().split('T')[0] };
    this.data.leads.push(lead);
    this.save();
    return lead;
  },
  
  addCustomer(data) {
    const id = Date.now();
    const customer = { ...data, id, jobs: 0, totalSpent: 0, created: new Date().toISOString().split('T')[0] };
    this.data.customers.push(customer);
    this.save();
    return customer;
  },
  
  addJob(data) {
    const jobNum = String(this.data.jobs.length + 1).padStart(3, '0');
    const job = { ...data, id: 'JOB-' + jobNum, status: 'new', created: new Date().toISOString().split('T')[0] };
    this.data.jobs.push(job);
    this.save();
    return job;
  },
  
  addEstimate(data) {
    const estNum = String(this.data.estimates.length + 1).padStart(3, '0');
    const calc = this.calculators.calculateEstimate(
      parseFloat(data.materials) || 0,
      parseFloat(data.labor) || 0,
      parseFloat(data.overhead) || 15,
      parseFloat(data.profit) || 20,
      parseFloat(data.tax) || 8
    );
    const estimate = { ...data, ...calc, id: 'EST-' + estNum, status: 'new', date: new Date().toISOString().split('T')[0] };
    this.data.estimates.push(estimate);
    this.save();
    return estimate;
  },
  
  addInvoice(data) {
    const invNum = String(this.data.invoices.length + 1).padStart(3, '0');
    const total = parseFloat(data.amount) * 1.08; // Add 8% tax
    const invoice = { 
      ...data, 
      amount: parseFloat(data.amount),
      tax: parseFloat(data.amount) * 0.08,
      total,
      id: 'INV-' + invNum, 
      status: 'pending', 
      created: new Date().toISOString().split('T')[0] 
    };
    this.data.invoices.push(invoice);
    this.save();
    return invoice;
  },
  
  addInventory(data) {
    const id = Date.now();
    const item = { ...data, id };
    this.data.inventory.push(item);
    this.save();
    return item;
  },
  
  updateInventoryQty(id, qty) {
    const item = this.data.inventory.find(i => i.id === id);
    if (item) {
      item.qty = parseInt(qty);
      this.save();
    }
  },
  
  recordPayment(invoiceId, method) {
    const inv = this.data.invoices.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = 'paid';
      inv.paidDate = new Date().toISOString().split('T')[0];
      inv.paymentMethod = method;
      this.save();
    }
  },
  
  // ============ PHOTO MANAGEMENT ============
  addPhoto(jobId, photoUrl, type) {
    const photo = {
      id: Date.now(),
      jobId,
      url: photoUrl,
      type: type, // 'before', 'during', 'after', 'contract', 'insurance'
      date: new Date().toISOString().split('T')[0]
    };
    this.data.photos.push(photo);
    this.save();
    return photo;
  },
  
  getPhotosForJob(jobId) {
    return this.data.photos.filter(p => p.jobId === jobId);
  },
  
  // ============ EXPORT ============
  exportToCSV(type) {
    const data = this.data[type];
    if (!data || !data.length) return;
    
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hammerflow_${type}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  },
  
  // ============ GOOGLE SHEETS (Placeholder) ============
  googleSheets: {
    enabled: false,
    spreadsheetId: '',
    
    enable(spreadsheetId) {
      this.enabled = true;
      this.spreadsheetId = spreadsheetId;
      localStorage.setItem('hammerflow_gs', JSON.stringify({ enabled: true, spreadsheetId }));
    },
    
    disable() {
      this.enabled = false;
      localStorage.removeItem('hammerflow_gs');
    },
    
    async sync() {
      if (!this.enabled) return { success: false, message: 'Google Sheets not enabled' };
      // Placeholder for Google Sheets API integration
      return { success: false, message: 'Google Sheets integration coming soon. Need API credentials.' };
    }
  }
};

// Initialize
HammerFlow.load();

// Check for Google Sheets settings
const gsSettings = localStorage.getItem('hammerflow_gs');
if (gsSettings) {
  const parsed = JSON.parse(gsSettings);
  HammerFlow.googleSheets.enabled = parsed.enabled;
  HammerFlow.googleSheets.spreadsheetId = parsed.spreadsheetId;
}

// Export to window
window.HammerFlow = HammerFlow;
window.HF = HammerFlow; // Shortcut

console.log('HammerFlow v1.2 loaded');