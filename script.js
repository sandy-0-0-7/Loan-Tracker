const amountInput = document.getElementById('amount');
const amountInput1 = document.getElementById('loan');
const yearsInput = document.getElementById('years');
const yearsSlider = document.getElementById('years-slider');
const interestInput = document.getElementById('interest');
const interestSlider = document.getElementById('interest-slider');
const repaymentInput = document.getElementById('repayment');
const repayBtn = document.getElementById('repay-btn');
const monthlyPaymentOutput = document.getElementById('monthly-payment');
const principalOutput = document.getElementById('principal');
const totalInterestOutput = document.getElementById('total-interest');
const totalPayableOutput = document.getElementById('total-payable');
const errorMessage = document.getElementById('error-message');
const transactionHistory = document.getElementById('transaction-history');

// Initialize chart
const ctx = document.getElementById('paymentBreakdownChart').getContext('2d');
const paymentChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Principal', 'Interest'],
    datasets: [{
      label: 'Payment Breakdown',
      data: [5000000, 6378756], // Initial sample data
      backgroundColor: ['#007bff', '#dc3545']
    }]
  }
});

function formatCurrency(value) {
  return `₹${value.toFixed(2)}`;
}

function calculateLoan() {
  const principal = parseFloat(amountInput.value) || 0;
  const years = parseInt(yearsInput.value);
  const interestRate = parseFloat(interestInput.value) / 100;

  if (principal > 0) {
    const monthlyInterest = interestRate / 12;
    const numberOfPayments = years * 12;

    const monthlyPayment = (principal * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));
    const totalInterest = (monthlyPayment * numberOfPayments) - principal;
    const totalPayable = principal + totalInterest;

    monthlyPaymentOutput.textContent = formatCurrency(monthlyPayment);
    principalOutput.textContent = formatCurrency(principal);
    totalInterestOutput.textContent = formatCurrency(totalInterest);
    totalPayableOutput.textContent = formatCurrency(totalPayable);

    paymentChart.data.datasets[0].data = [principal, totalInterest];
    paymentChart.update();
    
    return monthlyPayment; 
  } else {
    monthlyPaymentOutput.textContent = '₹0.00';
    principalOutput.textContent = '₹0.00';
    totalInterestOutput.textContent = '₹0.00';
    totalPayableOutput.textContent = '₹0.00';
    paymentChart.data.datasets[0].data = [0, 0];
    paymentChart.update();
  }
}

// Prevent negative values
function preventNegativeValues(inputElement) {
  inputElement.addEventListener('input', () => {
    if (parseFloat(inputElement.value) < 0) {
      inputElement.value = 0;
    }
  });
}

preventNegativeValues(amountInput1);
preventNegativeValues(interestInput);
preventNegativeValues(repaymentInput);

yearsInput.addEventListener('input', () => {
  if (yearsInput.value > 40) {
    errorMessage.textContent = 'Number of years cannot be greater than 40!';
    errorMessage.style.display = 'block';
    yearsInput.value = 40;  
  } else {
    errorMessage.style.display = 'none';
  }
});

function handleRepayment() {
  const repaymentAmount = parseFloat(repaymentInput.value);
  const monthlyPayment = calculateLoan(); 
  console.log(monthlyPayment)
  if (parseFloat(amountInput.value) <= 0) {
    errorMessage.textContent = 'Loan is fully paid off!';
    errorMessage.style.display = 'block';
    return;
  }
  const formattedValue = parseFloat(monthlyPayment.toFixed(2));


  // Allow repayment equal to monthly payment
  if (repaymentAmount >= formattedValue) {
    const newPrincipal = parseFloat(amountInput.value) - repaymentAmount;
    amountInput.value = newPrincipal.toFixed(2);

    const now = new Date();
    const timestamp = now.toLocaleString();  
    const transaction = document.createElement('li');
    transaction.classList.add('list-group-item');
    transaction.textContent = `${timestamp} - Repayment of ₹${repaymentAmount.toLocaleString()} made.`;
    transactionHistory.appendChild(transaction);

    // Recalculate loan details
    calculateLoan();
    errorMessage.style.display = 'none'; 
  } else {
    errorMessage.textContent = `Repayment must be greater than ₹${monthlyPayment.toFixed(2)}!`;
    errorMessage.style.display = 'block';
  }
}

amountInput.addEventListener('input', calculateLoan);
yearsInput.addEventListener('input', () => {
  yearsSlider.value = yearsInput.value;
  calculateLoan();
});
yearsSlider.addEventListener('input', () => {
  yearsInput.value = yearsSlider.value;
  calculateLoan();
});
interestInput.addEventListener('input', calculateLoan);
interestSlider.addEventListener('input', () => {
  interestInput.value = interestSlider.value;
  calculateLoan();
});
repayBtn.addEventListener('click', handleRepayment);

calculateLoan();
