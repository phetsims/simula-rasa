// Copyright 2014-2022, University of Colorado Boulder

/**
 * Functions for computing and rendering an amortization table.
 *
 * @author {{AUTHOR}}
 */

/**
 * Computes an amortization schedule.
 * @param principal - The loan principal amount
 * @param annualRate - The annual interest rate (as a decimal, e.g., 0.05 for 5%)
 * @param years - The loan term in years
 * @returns An array of payment objects
 */
export function computeAmortization( principal: number, annualRate: number, years: number ) {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;
  
  // Calculate monthly payment using the standard loan amortization formula
  const monthlyPayment = principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const schedule = [];
  let balance = principal;
  
  for (let i = 1; i <= numberOfPayments; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    
    // Avoid negative balance due to rounding
    if (balance < 0) {
      balance = 0;
    }
    
    schedule.push({
      paymentNumber: i,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: balance
    });
  }
  
  return schedule;
}

/**
 * Aggregates amortization schedule data by year (12 consecutive months per year).
 * @param schedule - The amortization schedule array
 * @returns An array of yearly summaries: { year, principalPaid, interestPaid }
 */
export function aggregateByYear( schedule: any[] ) {
  const yearlyData = [];
  for (let year = 1; year <= Math.ceil(schedule.length / 12); year++) {
    const startIdx = (year - 1) * 12;
    const endIdx = Math.min(year * 12, schedule.length);
    const yearPayments = schedule.slice(startIdx, endIdx);
    
    const principalPaid = yearPayments.reduce((acc, p) => acc + p.principal, 0);
    const interestPaid = yearPayments.reduce((acc, p) => acc + p.interest, 0);
    
    yearlyData.push({ year, principalPaid, interestPaid });
  }
  return yearlyData;
}

/**
 * Formats a number with thousands separators (e.g., 1000 -> '1,000.00').
 */
export function formatNumber( num: number ): string {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Renders an amortization table in the DOM.
 * @param container - The DOM element to render the table into
 * @param schedule - The amortization schedule array
 * @param showRows - The number of rows to show (optional, defaults to all)
 */
export function renderAmortizationTable( container: HTMLElement, schedule: any[], showRows?: number ) {
  const rowsToShow = showRows || schedule.length;
  
  // Create table
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '20px';
  table.style.fontSize = '12px';
  
  // Create header
  const header = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.style.backgroundColor = '#f0f0f0';
  headerRow.style.borderBottom = '2px solid #ccc';
  
  const headers = ['Payment #', 'Payment', 'Principal', 'Interest', 'Balance'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.padding = '8px';
    th.style.textAlign = 'right';
    th.style.fontWeight = 'bold';
    th.style.position = 'sticky';
    th.style.top = '0';
    th.style.backgroundColor = '#f0f0f0';
    th.style.zIndex = '10';
    if (headerText === 'Payment #') {
      th.style.textAlign = 'left';
    }
    headerRow.appendChild(th);
  });
  header.appendChild(headerRow);
  table.appendChild(header);
  
  // Create body
  const body = document.createElement('tbody');
  for (let i = 0; i < Math.min(rowsToShow, schedule.length); i++) {
    const row = document.createElement('tr');
    if (i % 2 === 0) {
      row.style.backgroundColor = '#f9f9f9';
    }
    row.style.borderBottom = '1px solid #ddd';
    
    const payment = schedule[i];
    
    const cells = [
      payment.paymentNumber.toString(),
      '$' + formatNumber(payment.payment),
      '$' + formatNumber(payment.principal),
      '$' + formatNumber(payment.interest),
      '$' + formatNumber(payment.balance)
    ];
    
    cells.forEach((cellText, index) => {
      const td = document.createElement('td');
      td.textContent = cellText;
      td.style.padding = '8px';
      td.style.textAlign = 'right';
      if (index === 0) {
        td.style.textAlign = 'left';
      }
      row.appendChild(td);
    });
    
    body.appendChild(row);
  }
  table.appendChild(body);
  
  container.appendChild(table);
}
