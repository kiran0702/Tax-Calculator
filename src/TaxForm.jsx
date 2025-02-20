import React, { useState, useEffect } from 'react';

const TaxForm = () => {
  const [formData, setFormData] = useState({
    assessmentYear: '2024-25',
    taxRegime: 'new',
    salaryIncome: '',
    otherIncome: 0,
    section80C: 0,
    section80D: 0,
    hra: 0,
    lta: 0,
    standardDeduction: 50000,
    otherDeductions: 0
  });

  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === 'assessmentYear' || id === 'taxRegime' ? value : Number(value)
    });
  };

  const numberWithCommas = (x) => {
    return x.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateTax = () => {
    const {
      taxRegime,
      assessmentYear,
      salaryIncome,
      otherIncome,
      section80C,
      section80D,
      hra,
      lta,
      standardDeduction,
      otherDeductions
    } = formData;

    
    const grossIncome = salaryIncome + otherIncome;
    
    let taxableIncome = grossIncome;
    let totalDeductions = 0;
    
    
    if (taxRegime === 'old') {
      const section80CAmount = Math.min(section80C, 150000);
      const section80DAmount = Math.min(section80D, 50000);
      
      totalDeductions = section80CAmount + section80DAmount + hra + lta + standardDeduction + otherDeductions;
      taxableIncome = Math.max(0, grossIncome - totalDeductions);
    } else {
     
      totalDeductions = standardDeduction;
      taxableIncome = Math.max(0, grossIncome - standardDeduction);
    }
    
    
    let tax = 0;
    let slabs = [];
    
    if (taxRegime === 'new') {
     
      if (taxableIncome <= 300000) {
        tax = 0;
        slabs.push({ from: 0, to: 300000, rate: 0, tax: 0 });
      } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05;
        slabs.push({ from: 0, to: 300000, rate: 0, tax: 0 });
        slabs.push({ from: 300001, to: taxableIncome, rate: 5, tax: tax });
      } else if (taxableIncome <= 900000) {
        tax = 15000 + (taxableIncome - 600000) * 0.1;
        slabs.push({ from: 0, to: 300000, rate: 0, tax: 0 });
        slabs.push({ from: 300001, to: 600000, rate: 5, tax: 15000 });
        slabs.push({ from: 600001, to: taxableIncome, rate: 10, tax: (taxableIncome - 600000) * 0.1 });
      } else if (taxableIncome <= 1200000) {
        tax = 45000 + (taxableIncome - 900000) * 0.15;
        slabs.push({ from: 0, to: 300000, rate: 0, tax: 0 });
        slabs.push({ from: 300001, to: 600000, rate: 5, tax: 15000 });
        slabs.push({ from: 600001, to: 900000, rate: 10, tax: 30000 });
        slabs.push({ from: 900001, to: taxableIncome, rate: 15, tax: (taxableIncome - 900000) * 0.15 });
      } else if (taxableIncome <= 1500000) {
        tax = 90000 + (taxableIncome - 1200000) * 0.2;
        slabs.push({ from: 0, to: 300000, rate: 0, tax: 0 });
        slabs.push({ from: 300001, to: 600000, rate: 5, tax: 15000 });
        slabs.push({ from: 600001, to: 900000, rate: 10, tax: 30000 });
        slabs.push({ from: 900001, to: 1200000, rate: 15, tax: 45000 });
        slabs.push({ from: 1200001, to: taxableIncome, rate: 20, tax: (taxableIncome - 1200000) * 0.2 });
      } else {
        tax = 150000 + (taxableIncome - 1500000) * 0.3;
        slabs.push({ from: 0, to: 300000, rate: 0, tax: 0 });
        slabs.push({ from: 300001, to: 600000, rate: 5, tax: 15000 });
        slabs.push({ from: 600001, to: 900000, rate: 10, tax: 30000 });
        slabs.push({ from: 900001, to: 1200000, rate: 15, tax: 45000 });
        slabs.push({ from: 1200001, to: 1500000, rate: 20, tax: 60000 });
        slabs.push({ from: 1500001, to: taxableIncome, rate: 30, tax: (taxableIncome - 1500000) * 0.3 });
      }
    } else {
      
      if (taxableIncome <= 250000) {
        tax = 0;
        slabs.push({ from: 0, to: 250000, rate: 0, tax: 0 });
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
        slabs.push({ from: 0, to: 250000, rate: 0, tax: 0 });
        slabs.push({ from: 250001, to: taxableIncome, rate: 5, tax: tax });
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2;
        slabs.push({ from: 0, to: 250000, rate: 0, tax: 0 });
        slabs.push({ from: 250001, to: 500000, rate: 5, tax: 12500 });
        slabs.push({ from: 500001, to: taxableIncome, rate: 20, tax: (taxableIncome - 500000) * 0.2 });
      } else {
        tax = 112500 + (taxableIncome - 1000000) * 0.3;
        slabs.push({ from: 0, to: 250000, rate: 0, tax: 0 });
        slabs.push({ from: 250001, to: 500000, rate: 5, tax: 12500 });
        slabs.push({ from: 500001, to: 1000000, rate: 20, tax: 100000 });
        slabs.push({ from: 1000001, to: taxableIncome, rate: 30, tax: (taxableIncome - 1000000) * 0.3 });
      }
    }
    
    
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    
    setResults({
      grossIncome,
      totalDeductions,
      taxableIncome,
      slabs,
      cess,
      totalTax: Math.round(totalTax)
    });
    
    setShowResults(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Income Tax Calculator</h1>
        
        <div className="space-y-6">
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">Basic Information</h2>
            
            <div className="mb-4">
              <label htmlFor="assessmentYear" className="block font-medium mb-1 text-gray-700">
                Assessment Year:
              </label>
              <select
                id="assessmentYear"
                value={formData.assessmentYear}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="taxRegime" className="block font-medium mb-1 text-gray-700">
                Tax Regime:
              </label>
              <select
                id="taxRegime"
                value={formData.taxRegime}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="new">New Tax Regime</option>
                <option value="old">Old Tax Regime</option>
              </select>
            </div>
          </div>

         
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">Income Details</h2>
            
            <div className="mb-4">
              <label htmlFor="salaryIncome" className="block font-medium mb-1 text-gray-700">
                Annual Salary Income (₹):
              </label>
              <input
                type="number"
                id="salaryIncome"
                value={formData.salaryIncome}
                onChange={handleInputChange}
                placeholder="Enter your annual salary"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="otherIncome" className="block font-medium mb-1 text-gray-700">
                Income from Other Sources (₹):
              </label>
              <input
                type="number"
                id="otherIncome"
                value={formData.otherIncome}
                onChange={handleInputChange}
                placeholder="Rental income, interest, etc."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          
          {formData.taxRegime === 'old' && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">Deductions (Old Regime)</h2>
              
              <div className="mb-4">
                <label htmlFor="section80C" className="block font-medium mb-1 text-gray-700">
                  Section 80C Investments (₹):
                </label>
                <input
                  type="number"
                  id="section80C"
                  value={formData.section80C}
                  onChange={handleInputChange}
                  placeholder="PPF, ELSS, LIC, etc. (Max: 1,50,000)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="section80D" className="block font-medium mb-1 text-gray-700">
                  Section 80D - Medical Insurance (₹):
                </label>
                <input
                  type="number"
                  id="section80D"
                  value={formData.section80D}
                  onChange={handleInputChange}
                  placeholder="Health insurance premiums (Max: 25,000/50,000)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="hra" className="block font-medium mb-1 text-gray-700">
                  HRA Exemption (₹):
                </label>
                <input
                  type="number"
                  id="hra"
                  value={formData.hra}
                  onChange={handleInputChange}
                  placeholder="House Rent Allowance exemption"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="lta" className="block font-medium mb-1 text-gray-700">
                  LTA Exemption (₹):
                </label>
                <input
                  type="number"
                  id="lta"
                  value={formData.lta}
                  onChange={handleInputChange}
                  placeholder="Leave Travel Allowance exemption"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="standardDeduction" className="block font-medium mb-1 text-gray-700">
                  Standard Deduction (₹):
                </label>
                <input
                  type="number"
                  id="standardDeduction"
                  value={formData.standardDeduction}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="otherDeductions" className="block font-medium mb-1 text-gray-700">
                  Other Deductions (₹):
                </label>
                <input
                  type="number"
                  id="otherDeductions"
                  value={formData.otherDeductions}
                  onChange={handleInputChange}
                  placeholder="80G, 80E, NPS, etc."
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={calculateTax}
            className="w-full py-3 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors font-medium"
          >
            Calculate Tax
          </button>
        </div>

       
        {showResults && results && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tax Calculation Results</h2>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Gross Total Income:</span>
              <span className="font-medium">₹{numberWithCommas(results.grossIncome)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Total Deductions:</span>
              <span className="font-medium">₹{numberWithCommas(results.totalDeductions)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Taxable Income:</span>
              <span className="font-medium">₹{numberWithCommas(results.taxableIncome)}</span>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Tax Calculation Breakdown:</h3>
              
              {results.slabs.map((slab, index) => (
                <div key={index} className="flex justify-between items-center mb-1 text-sm">
                  <span>
                    ₹{numberWithCommas(slab.from)} to ₹{numberWithCommas(slab.to)} @ {slab.rate}%
                  </span>
                  <span>₹{numberWithCommas(slab.tax)}</span>
                </div>
              ))}
              
              <div className="flex justify-between items-center mb-1 text-sm">
                <span>Health & Education Cess @ 4%</span>
                <span>₹{numberWithCommas(results.cess)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 font-bold text-lg">
              <span className="text-blue-800">Total Tax Liability:</span>
              <span className="text-blue-800">₹{numberWithCommas(results.totalTax)}</span>
            </div>
            
            <p className="text-sm text-gray-500 italic mt-4">
              Note: This is a simplified tax calculator. For detailed tax assessment, please consult a tax professional.
              Tax calculations are based on the rates applicable for the selected assessment year.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxForm;
