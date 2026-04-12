// HammerFlow - Payment Recording with Distribution
// v1.8 - Add payment with partner split display

HammerFlow.payments = {
  sources: ['Homeowner', 'Insurance', 'Insurance - Partial'],
  
  // Record payment and show distribution
  recordAndShow(invoiceId, amount, source, isInsurance, depreciation = 0) {
    const invoice = HammerFlow.data.invoices.find(i => i.id === invoiceId);
    if (!invoice) return { error: 'Invoice not found' };
    
    // Calculate job costs
    const jobCosts = (HammerFlow.data.jobCosts || [])
      .filter(c => c.jobId === invoice.jobId)
      .reduce((sum, c) => sum + c.amount, 0);
    
    const revenue = invoice.total;
    const grossProfit = revenue - jobCosts;
    const depreciationHeld = depreciation;
    const availableNow = grossProfit - depreciationHeld;
    const oneThird = grossProfit / 3;
    const availableThird = availableNow / 3;
    
    // Check Dylan's delay rule
    const dylanDelayed = depreciationHeld >= 1000;
    
    // Calculate distributions
    const distribution = {
      job: invoice.jobId,
      customer: invoice.customer,
      invoice: invoiceId,
      revenue,
      costs: jobCosts,
      grossProfit,
      depreciationHeld,
      
      initialPayment: amount,
      
      initial: {
        mark: availableThird,
        bobby: availableThird,
        dylan: dylanDelayed ? availableThird : oneThird,
        total: dylanDelayed ? availableNow : grossProfit
      },
      
      final: dylanDelayed ? {
        mark: depreciationHeld / 3,
        bobby: depreciationHeld / 3,
        dylan: depreciationHeld / 3,
        total: depreciationHeld
      } : null,
      
      totals: {
        mark: oneThird,
        bobby: oneThird,
        dylan: oneThird,
        total: grossProfit
      },
      
      dylanStatus: dylanDelayed ? 'WAITING' : 'PAID NOW'
    };
    
    // Update invoice
    invoice.status = amount >= revenue ? 'paid' : 'partial';
    if (invoice.status === 'paid') {
      invoice.paidDate = new Date().toISOString().split('T')[0];
    }
    
    // Save payment record
    const payment = {
      id: Date.now(),
      invoiceId,
      jobId: invoice.jobId,
      date: invoice.paidDate,
      amount,
      source,
      isInsurance,
      depreciation: depreciationHeld,
      ...distribution
    };
    
    HammerFlow.data.payments = HammerFlow.data.payments || [];
    HammerFlow.data.payments.push(payment);
    HammerFlow.save();
    
    return distribution;
  },
  
  // Get all payments
  getAll() {
    return HammerFlow.data.payments || [];
  },
  
  // Get deferred Dylan payments
  getDeferred() {
    return (HammerFlow.data.payments || []).filter(p => 
      p.dylanStatus === 'WAITING'
    );
  },
  
  // Mark depreciation paid
  completeDepreciation(paymentId) {
    const payment = (HammerFlow.data.payments || []).find(p => p.id === paymentId);
    if (!payment) return;
    
    const depreciation = payment.depreciationHeld;
    payment.finalPaid = true;
    payment.finalPaidDate = new Date().toISOString().split('T')[0];
    payment.dylanStatus = 'COMPLETE';
    HammerFlow.save();
    
    return {
      dylanGetsPaid: depreciation / 3,
      when: 'now'
    };
  }
};

// Payment display function
function displayPaymentDistribution(dist) {
  return `
╔══════════════════════════════════════════════════════════╗
║              PAYMENT DISTRIBUTION                       ║
╠══════════════════════════════════════════════════════════╣
║ Job: ${dist.job} | Invoice: ${dist.invoice}             ║
║ Customer: ${dist.customer}                              ║
╠══════════════════════════════════════════════════════════╣
║ REVENUE:           $${dist.revenue.toLocaleString()}            ║
║ JOB COSTS:         $${dist.costs.toLocaleString()}             ║
║ ─────────────────────────────────────────────────────║
║ GROSS PROFIT:      $${dist.grossProfit.toLocaleString()}            ║
║ DEPRECIATION HELD: $${dist.depreciationHeld.toLocaleString()}            ║
╠══════════════════════════════════════════════════════════╣
║                                                           ║
║ INITIAL (when paid):                            ║
║   Mark:     $${dist.initial.mark.toFixed(2)}                        ║
║   Bobby:    $${dist.initial.bobby.toFixed(2)}                        ║
║   Dylan:    $${dist.initial.dylan.toFixed(2)} ${dist.dylanStatus === 'WAITING' ? '(WAITING)' : ''}            ║
║   ─────────────────────────────────────────────────────║
║   TOTAL:    $${dist.initial.total.toFixed(2)}                       ║
║                                                           ║
${dist.final ? `
║ FINAL (when depreciation paid):                        ║
║   Mark:     $${dist.final.mark.toFixed(2)}                        ║
║   Bobby:    $${dist.final.bobby.toFixed(2)}                        ║
║   Dylan:    $${dist.final.dylan.toFixed(2)}                        ║
║   ─────────────────────────────────────────────────────
║   TOTAL:    $${dist.final.total.toFixed(2)}                       ║
` : ''}
╠══════════════════════════════════════════════════════════╣
║ TOTAL WHEN ALL PAID:                          ║
║   Mark:     $${dist.totals.mark.toFixed(2)}                        ║
║   Bobby:    $${dist.totals.bobby.toFixed(2)}                        ║
║   Dylan:    $${dist.totals.dylan.toFixed(2)}                        ║
║   ─────────────────────────────────────────────────────
║   TOTAL:    $${dist.totals.total.toFixed(2)}                       ║
╚══════════════════════════════════════════════════════════╝
`;
}

console.log('Payment Distribution v1.8 loaded');
window.displayPaymentDistribution = displayPaymentDistribution;
window.HammerFlow = HammerFlow;