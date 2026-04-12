// HammerFlow - Partner & Profit Distribution Logic
// Version 1.7 - FINAL: Mark's exact distribution rules

HammerFlow.partners = {
  // TRUE PARTNERS - 50/50 split of available profit
  partners: [
    { name: 'Mark Wilson', share: 0.5 },
    { name: 'Bobby Jones', share: 0.5 }
  ],
  
  // W9 EMPLOYEES
  w9Employees: [
    { name: 'Dylan Leon', role: 'sales', commission: 1/3 },
    { name: 'Antonio Ramirez', role: 'contractor', rate: 35 },
    { name: 'Salomon Nincanor', role: 'contractor', rate: 35 }
  ],
  
  // Calculate distribution for a job
  calculateDistribution(revenue, costs, depreciation, contractorCosts = 0) {
    const grossProfit = revenue - costs - contractorCosts;
    const depreciationHeld = depreciation;
    const availableNow = grossProfit - depreciationHeld;
    const oneThird = grossProfit / 3;
    const availableThird = availableNow / 3;
    
    // Check if depreciation triggers delay for Dylan
    const dylanDelayed = depreciation >= 1000;
    
    return {
      // Job totals
      grossProfit,
      depreciationHeld,
      availableNow,
      
      // INITIAL distribution (when job paid)
      initial: {
        mark: availableThird,
        bobby: availableThird,
        dylan: dylanDelayed ? availableThird : oneThird, // Gets full if dep < $1000
        total: dylanDelayed ? availableNow : grossProfit
      },
      
      // FINAL distribution (when depreciation paid)
      final: dylanDelayed ? {
        mark: depreciationHeld / 3,
        bobby: depreciationHeld / 3,
        dylan: depreciationHeld / 3,
        total: depreciationHeld
      } : null,
      
      // TOTALS when all paid
      totals: {
        mark: oneThird,
        bobby: oneThird,
        dylan: oneThird,
        total: grossProfit
      },
      
      // Dylan status
      dylan: {
        initialPaid: dylanDelayed ? availableThird : oneThird,
        deferredAmount: dylanDelayed ? oneThird - availableThird : 0,
        finalPaidWhenDepreciationPaid: dylanDelayed ? depreciationHeld / 3 : 0,
        total: oneThird
      }
    };
  },
  
  // Example outputs for verification
  examples: {
    jobA: this.calculateDistribution(10000, 4000, 500),
    jobB: this.calculateDistribution(10000, 4000, 2000)
  }
};

// Test both examples
console.log('===== JOB A: $500 Depreciation =====');
const jobA = HammerFlow.partners.calculateDistribution(10000, 4000, 500);
console.log('INITIAL:', jobA.initial);
console.log('FINAL:', jobA.final);
console.log('TOTALS:', jobA.totals);

console.log('\n===== JOB B: $2000 Depreciation =====');
const jobB = HammerFlow.partners.calculateDistribution(10000, 4000, 2000);
console.log('INITIAL:', jobB.initial);
console.log('FINAL:', jobB.final);
console.log('TOTALS:', jobB.totals);

window.HammerFlow = HammerFlow;
window.HF = HammerFlow;