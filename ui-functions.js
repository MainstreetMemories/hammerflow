// HammerFlow - Job Costing UI Functions
// Attach to HammerFlow object

HammerFlow.ui = {
  // Update dashboard stats
  updateDashboard() {
    const stats = HammerFlow.reports.getDashboardStats();
    
    // Update stat cards
    const cards = document.querySelectorAll('.stat-card');
    if (cards.length >= 4) {
      cards[0].querySelector('.value').textContent = '$' + stats.revenue.toLocaleString();
      cards[1].querySelector('.value').textContent = stats.activeJobs;
      cards[2].querySelector('.value').textContent = stats.pendingLeads;
      cards[3].querySelector('.value').textContent = '$' + stats.outstanding.toLocaleString();
    }
  },
  
  // Render leads table
  renderLeads() {
    const tbody = document.getElementById('leads-table');
    if (!tbody) return;
    
    tbody.innerHTML = HammerFlow.data.leads.map(lead => `
      <tr>
        <td>${lead.name}</td>
        <td>${lead.phone}</td>
        <td>${lead.address}</td>
        <td>${lead.source}</td>
        <td><span class="status ${lead.status}">${lead.status}</span></td>
        <td>${lead.followup || '-'}</td>
        <td>
          <button class="btn" onclick="HammerFlow.ui.editLead(${lead.id})">Edit</button>
          <button class="btn" style="color:red" onclick="HammerFlow.ui.deleteLead(${lead.id})">×</button>
        </td>
      </tr>
    `).join('');
  },
  
  editLead(id) {
    const lead = HammerFlow.data.leads.find(l => l.id === id);
    if (lead) {
      // Populate modal with lead data
      openModal('lead');
      // Would populate form fields here
    }
  },
  
  deleteLead(id) {
    if (confirm('Delete this lead?')) {
      HammerFlow.data.leads = HammerFlow.data.leads.filter(l => l.id !== id);
      HammerFlow.save();
      this.renderLeads();
    }
  },
  
  // Render inventory with low stock alerts
  renderInventory() {
    const tbody = document.getElementById('inventory-table');
    if (!tbody) return;
    
    tbody.innerHTML = HammerFlow.data.inventory.map(item => {
      const isLow = item.qty < item.minStock;
      const status = isLow ? 'overdue' : 'new';
      const statusText = isLow ? 'Low' : 'OK';
      return `
        <tr>
          <td>${item.name}</td>
          <td>${item.unit}</td>
          <td>$${item.cost.toFixed(2)}</td>
          <td>${item.qty}</td>
          <td>${item.minStock}</td>
          <td><span class="status ${status}">${statusText}</span></td>
        </tr>
      `;
    }).join('');
  },
  
  // Show job costing details
  showJobCosts(jobId) {
    const costs = HammerFlow.jobCosting.getCostsForJob(jobId);
    const totalCost = HammerFlow.jobCosting.getTotalCostForJob(jobId);
    const job = HammerFlow.data.jobs.find(j => j.id === jobId);
    
    if (!job) return;
    
    const profit = HammerFlow.jobCosting.getProfitForJob(jobId);
    const margin = HammerFlow.jobCosting.getMarginForJob(jobId);
    
    alert(`
Job: ${jobId}
Revenue: $${job.value}
Costs: $${totalCost}
Profit: $${profit}
Margin: ${margin}%
    `);
  },
  
  // Add cost to job
  addJobCost(jobId) {
    const category = prompt('Category (Materials, Labor, Equipment, Disposal):');
    const description = prompt('Description:');
    const amount = parseFloat(prompt('Amount:'));
    
    if (category && description && amount) {
      HammerFlow.jobCosting.addCost(jobId, category, description, amount);
      alert('Cost added!');
    }
  },
  
  // Record payment
  recordPayment(invoiceId) {
    const method = prompt('Payment method (Cash, Check, Card, ACH):');
    if (method) {
      HammerFlow.recordPayment(invoiceId, method);
      alert('Payment recorded!');
      // Refresh page
      location.reload();
    }
  },
  
  // Quick add from modal
  handleFormSubmit(type, e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    switch(type) {
      case 'lead':
        HammerFlow.addLead(data);
        this.renderLeads();
        break;
      case 'customer':
        HammerFlow.addCustomer(data);
        break;
      case 'job':
        HammerFlow.addJob(data);
        break;
      case 'estimate':
        HammerFlow.addEstimate(data);
        break;
      case 'invoice':
        HammerFlow.addInvoice(data);
        break;
      case 'inventory':
        HammerFlow.addInventory(data);
        this.renderInventory();
        break;
    }
    
    closeModal(type);
    form.reset();
    alert(type.charAt(0).toUpperCase() + type.slice(1) + ' saved!');
  }
};

// Auto-render on load
document.addEventListener('DOMContentLoaded', function() {
  if (typeof HammerFlow !== 'undefined') {
    HammerFlow.ui.renderLeads();
    HammerFlow.ui.renderInventory();
    HammerFlow.ui.updateDashboard();
  }
});