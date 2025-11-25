'use client';

import { useState, useEffect } from 'react';

type WeeklyOption = 4 | 8 | 12 | 16 | 20;
type MonthlyOption = 30 | 60 | 90 | 120 | 150;

export default function Calculator() {
  const [iPhonePrice, setIPhonePrice] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [selectedWeekly, setSelectedWeekly] = useState<WeeklyOption | null>(null);
  const [selectedMonthly, setSelectedMonthly] = useState<MonthlyOption | null>(null);
  const [customWeeks, setCustomWeeks] = useState<string>('');
  const [customMonths, setCustomMonths] = useState<string>('');
  
  const [calculatedDownPayment, setCalculatedDownPayment] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalMonths, setTotalMonths] = useState<number>(0);

  // 计算首付金额和月供
  useEffect(() => {
    const price = parseFloat(iPhonePrice) || 0;
    const dpAmount = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) || 0;
    
    let dp = 0;
    let remaining = 0;
    
    // 如果用户填写了DIY Down Payment，使用用户填写的金额
    if (dpAmount > 0) {
      dp = dpAmount;
    } else if (price > 0) {
      // 否则默认为总价的40%
      dp = price * 0.4;
    }
    
    setCalculatedDownPayment(dp);
    remaining = price - dp;

    // 获取实际的周数或月数（优先使用自定义值）
    const actualWeeks = customWeeks ? parseFloat(customWeeks) : selectedWeekly;
    const actualDays = customMonths ? parseFloat(customMonths) * 30 : selectedMonthly;

    if (actualWeeks) {
      // 按周计算：(总金额 - 首付) * (1 + 利息率) / 周数
      const totalWithInterest = remaining * (1 + rate / 100);
      const weeklyPayment = totalWithInterest / actualWeeks;
      const months = actualWeeks / 4;
      setMonthlyPayment(weeklyPayment * 4); // 转换为月供显示
      setTotalMonths(months);
    } else if (actualDays) {
      // 按月计算：(总金额 - 首付) * (1 + 利息率) / 月数
      const months = actualDays / 30;
      const totalWithInterest = remaining * (1 + rate / 100);
      const monthlyPaymentAmount = totalWithInterest / months;
      setMonthlyPayment(monthlyPaymentAmount);
      setTotalMonths(months);
    } else {
      setMonthlyPayment(0);
      setTotalMonths(0);
    }
  }, [iPhonePrice, downPayment, interestRate, selectedWeekly, selectedMonthly, customWeeks, customMonths]);

  const handleWeeklySelect = (weeks: WeeklyOption) => {
    setSelectedWeekly(weeks);
    setSelectedMonthly(null);
    setCustomWeeks('');
    setCustomMonths('');
  };

  const handleMonthlySelect = (days: MonthlyOption) => {
    setSelectedMonthly(days);
    setSelectedWeekly(null);
    setCustomWeeks('');
    setCustomMonths('');
  };

  const handleCustomWeeksChange = (value: string) => {
    setCustomWeeks(value);
    setSelectedWeekly(null);
    setSelectedMonthly(null);
    setCustomMonths('');
  };

  const handleCustomMonthsChange = (value: string) => {
    setCustomMonths(value);
    setSelectedWeekly(null);
    setSelectedMonthly(null);
    setCustomWeeks('');
  };

  const weeklyOptions: { value: WeeklyOption; label: string; color: string }[] = [
    { value: 4, label: '4 weeks', color: 'bg-blue-100 border-blue-200' },
    { value: 8, label: '8 weeks', color: 'bg-purple-100 border-purple-200' },
    { value: 12, label: '12 weeks', color: 'bg-pink-100 border-pink-200' },
    { value: 16, label: '16 weeks', color: 'bg-orange-100 border-orange-200' },
    { value: 20, label: '20 weeks', color: 'bg-green-100 border-green-200' },
  ];

  const monthlyOptions: { value: MonthlyOption; label: string; color: string; badge: string }[] = [
    { value: 30, label: '30 days (1 Month)', color: 'bg-blue-100 border-blue-200', badge: 'C' },
    { value: 60, label: '60 days (2 Months)', color: 'bg-purple-100 border-purple-200', badge: 'H' },
    { value: 90, label: '90 days (3 Months)', color: 'bg-red-100 border-red-300', badge: 'I' },
    { value: 120, label: '120 days (4 Months)', color: 'bg-yellow-100 border-yellow-200', badge: 'J' },
    { value: 150, label: '150 days (5 Months)', color: 'bg-green-100 border-green-200', badge: 'K' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-3 md:p-6 bg-white md:rounded-lg min-h-screen md:min-h-0">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
        Calculator <span className="text-gray-500">(LG)</span>
      </h1>

      {/* iPhone Price Input */}
      <div className="mb-4 md:mb-5">
        <label className="block text-base font-medium text-gray-700 mb-1.5">
          iPhone Price <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={iPhonePrice}
          onChange={(e) => {
            const value = e.target.value;
            // 只允许数字和小数点
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
              setIPhonePrice(value);
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder=""
        />
      </div>

      {/* Interest Rate Input */}
      <div className="mb-4 md:mb-5">
        <label className="block text-base font-medium text-gray-700 mb-1.5">
          Interest Rate (%) <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={interestRate}
              onChange={(e) => {
                const value = e.target.value;
                // 只允许数字和小数点
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setInterestRate(value);
                }
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter interest rate"
            />
            <span className="text-lg font-semibold text-gray-700 min-w-[60px]">
              {interestRate || '0'}%
            </span>
          </div>
          
          {/* Slider */}
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="30"
              step="0.1"
              value={interestRate || '0'}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((parseFloat(interestRate) || 0) / 30) * 100}%, #e5e7eb ${((parseFloat(interestRate) || 0) / 30) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          </div>
          
          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-2">
            {[0, 2.5, 5, 7.5, 10, 12.5, 15, 20].map((rate) => (
              <button
                key={rate}
                onClick={() => setInterestRate(rate.toString())}
                className={`px-3 py-1.5 rounded-lg border-2 transition-all text-sm ${
                  parseFloat(interestRate) === rate
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DIY Down Payment Input */}
      <div className="mb-4 md:mb-5">
        <label className="block text-base font-medium text-gray-700 mb-1.5">
          DIY Down Payment <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
          <input
            type="text"
            value={downPayment}
            onChange={(e) => {
              const value = e.target.value;
              // 只允许数字和小数点
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setDownPayment(value);
              }
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder=""
          />
        </div>
      </div>

      {/* Down Payment Display */}
      <div className="mb-5 md:mb-6">
        <p className="text-base text-gray-700">
          <span className="font-bold">Down Payment is </span>
          <span className="inline-block min-w-[100px] border-b border-gray-300 px-2 py-1 font-bold text-red-500">
            {calculatedDownPayment > 0 ? calculatedDownPayment.toFixed(2) : ''}
          </span>
        </p>
      </div>

      {/* Weekly Payment Options */}
      <div className="mb-5 md:mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-3">1、Weekly Payment：</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {weeklyOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleWeeklySelect(option.value)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all
                ${selectedWeekly === option.value 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : ''
                }
                ${option.color}
              `}
            >
              <span className={`
                flex items-center justify-center w-6 h-6 rounded text-xs font-bold text-white
                ${option.value === 4 ? 'bg-blue-500' : ''}
                ${option.value === 8 ? 'bg-purple-500' : ''}
                ${option.value === 12 ? 'bg-pink-500' : ''}
                ${option.value === 16 ? 'bg-orange-500' : ''}
                ${option.value === 20 ? 'bg-green-500' : ''}
              `}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm font-medium text-gray-700">{option.label}</span>
            </button>
          ))}
          {/* Custom Weeks Input */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Custom Weeks:</label>
            <input
              type="text"
              value={customWeeks}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleCustomWeeksChange(value);
                }
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                customWeeks ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-gray-300'
              }`}
              placeholder="Enter custom number of weeks"
            />
          </div>
        </div>
      </div>

      {/* Monthly Payment Options */}
      <div className="mb-5 md:mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-3">2、Monthly Payment：</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {monthlyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleMonthlySelect(option.value)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all
                ${selectedMonthly === option.value 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : ''
                }
                ${option.color}
              `}
            >
              <span className={`
                flex items-center justify-center w-6 h-6 rounded text-xs font-bold text-white
                ${option.value === 30 ? 'bg-blue-500' : ''}
                ${option.value === 60 ? 'bg-purple-500' : ''}
                ${option.value === 90 ? 'bg-red-500' : ''}
                ${option.value === 120 ? 'bg-yellow-500' : ''}
                ${option.value === 150 ? 'bg-green-500' : ''}
              `}>
                {option.badge}
              </span>
              <span className="text-sm font-medium text-gray-700">{option.label}</span>
            </button>
          ))}
          {/* Custom Months Input */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Custom Months:</label>
            <input
              type="text"
              value={customMonths}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleCustomMonthsChange(value);
                }
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                customMonths ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-gray-300'
              }`}
              placeholder="Enter custom number of months"
            />
          </div>
        </div>
      </div>

      {/* Monthly Payment Display */}
      <div className="mb-5 md:mb-6">
        <p className="text-base text-gray-700">
          {(selectedWeekly || customWeeks) ? (
            <>
              <span className="font-bold">Weekly Payment is </span>
              <span className="inline-block min-w-[100px] border-b border-gray-300 px-2 py-1 font-bold text-red-500">
                {monthlyPayment > 0 ? (monthlyPayment / 4).toFixed(2) : ''}
              </span>
              <span className="font-bold"> per Week，for </span>
              <span className="font-bold text-red-500">
                {customWeeks || selectedWeekly || ''}
              </span>
              <span className="font-bold"> Weeks</span>
            </>
          ) : (selectedMonthly || customMonths) ? (
            <>
              <span className="font-bold">Monthly Payment is </span>
              <span className="inline-block min-w-[100px] border-b border-gray-300 px-2 py-1 font-bold text-red-500">
                {monthlyPayment > 0 ? monthlyPayment.toFixed(2) : ''}
              </span>
              <span className="font-bold"> per Month，for </span>
              <span className="font-bold text-red-500">
                {customMonths || totalMonths > 0 ? (customMonths || totalMonths) : ''}
              </span>
              <span className="font-bold"> Months</span>
            </>
          ) : (
            <>
              <span className="font-bold">Monthly Payment is </span>
              <span className="inline-block min-w-[100px] border-b border-gray-300 px-2 py-1 font-bold text-red-500">
                
              </span>
              <span className="font-bold"> per Month，for </span>
              <span className="font-bold text-red-500">
                
              </span>
              <span className="font-bold"> Months</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
