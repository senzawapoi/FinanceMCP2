// 现金流量表详细格式化函数模块
// 用于处理不同类型的现金流数据展示

// 辅助函数：格式化数字
function formatNumber(num: any): string {
  if (num === null || num === undefined || num === '') return 'N/A';
  const number = parseFloat(num);
  if (isNaN(number)) return 'N/A';
  return number.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
}

// 辅助函数：获取公司类型描述
function getCompanyType(type: string): string {
  const types: Record<string, string> = {
    '1': '一般工商业',
    '2': '银行',
    '3': '保险',
    '4': '证券'
  };
  return types[type] || type;
}



// 1. 基础现金流格式化
export function formatBasicCashFlow(data: any[]): string {
  if (!data || data.length === 0) return '暂无数据\n\n';
  
  let output = `| 报告期 | 净利润 | 经营现金流 | 投资现金流 | 筹资现金流 | 自由现金流 | 现金净增加 | 期初现金 | 期末现金 | 汇率影响 |\n`;
  output += `|--------|--------|-----------|-----------|-----------|-----------|-----------|----------|----------|----------|\n`;
  
  for (const item of data) {
    const period = item.end_date || item.period || 'N/A';
    const netProfit = formatNumber(item.net_profit);
    const operatingCF = formatNumber(item.n_cashflow_act);
    const investingCF = formatNumber(item.n_cashflow_inv_act);
    const financingCF = formatNumber(item.n_cash_flows_fnc_act);
    const freeCF = formatNumber(item.free_cashflow);
    const netIncrease = formatNumber(item.n_incr_cash_cash_equ);
    const beginCash = formatNumber(item.c_cash_equ_beg_period);
    const endCash = formatNumber(item.c_cash_equ_end_period);
    const fxEffect = formatNumber(item.eff_fx_flu_cash);
    
    output += `| ${period} | ${netProfit} | ${operatingCF} | ${investingCF} | ${financingCF} | ${freeCF} | ${netIncrease} | ${beginCash} | ${endCash} | ${fxEffect} |\n`;
  }
  
  output += '\n**💡 说明：** 单位：万元，公司类型：' + getCompanyType(data[0]?.comp_type || '1') + '\n\n';
  return output;
}

// 2. 经营活动现金流详情格式化
export function formatOperatingCashFlow(data: any[]): string {
  if (!data || data.length === 0) return '暂无数据\n\n';
  
  let output = `| 报告期 | 销售收现 | 税费返还 | 其他流入 | 购买商品 | 职工薪酬 | 支付税费 | 其他流出 | **经营净额** |\n`;
  output += `|--------|----------|----------|----------|----------|----------|----------|----------|-------------|\n`;
  
  for (const item of data) {
    const period = item.end_date || item.period || 'N/A';
    const salesCash = formatNumber(item.c_fr_sale_sg);
    const taxRefund = formatNumber(item.recp_tax_rends);
    const otherInflow = formatNumber(item.c_fr_oth_operate_a);
    const purchaseCash = formatNumber(item.c_paid_goods_s);
    const employeeCash = formatNumber(item.c_paid_to_for_empl);
    const taxCash = formatNumber(item.c_paid_for_taxes);
    const otherOutflow = formatNumber(item.oth_cash_pay_oper_act);
    const netCashflow = formatNumber(item.n_cashflow_act);
    
    output += `| ${period} | ${salesCash} | ${taxRefund} | ${otherInflow} | ${purchaseCash} | ${employeeCash} | ${taxCash} | ${otherOutflow} | **${netCashflow}** |\n`;
  }
  
  output += '\n**💡 说明：** 单位：万元\n\n';
  return output;
}

// 3. 投资活动现金流详情格式化
export function formatInvestingCashFlow(data: any[]): string {
  if (!data || data.length === 0) return '暂无数据\n\n';
  
  let output = `| 报告期 | 收回投资 | 投资收益 | 处置资产 | 处置子公司 | 其他流入 | 购建资产 | 投资支付 | 其他流出 | **投资净额** |\n`;
  output += `|--------|----------|----------|----------|-----------|----------|----------|----------|----------|-------------|\n`;
  
  for (const item of data) {
    const period = item.end_date || item.period || 'N/A';
    const recoverInvest = formatNumber(item.c_disp_withdrwl_invest);
    const investReturn = formatNumber(item.c_recp_return_invest);
    const disposeAsset = formatNumber(item.n_recp_disp_fiolta);
    const disposeSub = formatNumber(item.n_recp_disp_sobu);
    const otherInflow = formatNumber(item.oth_recp_ral_inv_act);
    const buildAsset = formatNumber(item.c_pay_acq_const_fiolta);
    const investPay = formatNumber(item.c_paid_invest);
    const otherOutflow = formatNumber(item.oth_pay_ral_inv_act);
    const netInvesting = formatNumber(item.n_cashflow_inv_act);
    
    output += `| ${period} | ${recoverInvest} | ${investReturn} | ${disposeAsset} | ${disposeSub} | ${otherInflow} | ${buildAsset} | ${investPay} | ${otherOutflow} | **${netInvesting}** |\n`;
  }
  
  output += '\n**💡 说明：** 单位：万元\n\n';
  return output;
}

// 4. 筹资活动现金流详情格式化
export function formatFinancingCashFlow(data: any[]): string {
  if (!data || data.length === 0) return '暂无数据\n\n';
  
  let output = `| 报告期 | 借款收入 | 发行债券 | 吸收投资 | 其他流入 | 偿还债务 | 分配股利 | 其他流出 | **筹资净额** | 自由现金流 |\n`;
  output += `|--------|----------|----------|----------|----------|----------|----------|----------|-------------|----------|\n`;
  
  for (const item of data) {
    const period = item.end_date || item.period || 'N/A';
    const borrowCash = formatNumber(item.c_recp_borrow);
    const bondCash = formatNumber(item.proc_issue_bonds);
    const investCash = formatNumber(item.c_recp_cap_contrib);
    const otherInflow = formatNumber(item.oth_cash_recp_ral_fnc_act);
    const repayDebt = formatNumber(item.c_prepay_amt_borr);
    const payDividend = formatNumber(item.c_pay_dist_dpcp_int_exp);
    const otherOutflow = formatNumber(item.oth_cashpay_ral_fnc_act);
    const netFinancing = formatNumber(item.n_cash_flows_fnc_act);
    const freeCashflow = formatNumber(item.free_cashflow);
    
    output += `| ${period} | ${borrowCash} | ${bondCash} | ${investCash} | ${otherInflow} | ${repayDebt} | ${payDividend} | ${otherOutflow} | **${netFinancing}** | ${freeCashflow} |\n`;
  }
  
  output += '\n**💡 说明：** 单位：万元\n\n';
  return output;
}

// 5. 现金流补充信息格式化
export function formatCashflowSupplement(data: any[]): string {
  if (!data || data.length === 0) return '暂无数据\n\n';
  
  let output = `| 报告期 | 净利润 | 财务费用 | 折旧摊销 | 资产减值 | 存货变动 | 应收变动 | 应付变动 | **间接法净额** |\n`;
  output += `|--------|--------|----------|----------|----------|----------|----------|----------|---------------|\n`;
  
  for (const item of data) {
    const period = item.end_date || item.period || 'N/A';
    const netProfit = formatNumber(item.net_profit);
    const finanExp = formatNumber(item.finan_exp);
    const depreciation = formatNumber(item.depr_fa_coga_dpba);
    const assetImpairment = formatNumber(item.credit_impa_loss);
    const inventoryChange = formatNumber(item.decr_inventories);
    const receivableChange = formatNumber(item.decr_oper_payable);
    const payableChange = formatNumber(item.incr_oper_payable);
    const indirectMethod = formatNumber(item.im_net_cashflow_oper_act);
    
    output += `| ${period} | ${netProfit} | ${finanExp} | ${depreciation} | ${assetImpairment} | ${inventoryChange} | ${receivableChange} | ${payableChange} | **${indirectMethod}** |\n`;
  }
  
  output += '\n**💡 说明：** 单位：万元，间接法调整项目\n\n';
  return output;
}

// 6. 特殊业务现金流格式化
export function formatSpecialCashFlow(data: any[]): string {
  if (!data || data.length === 0) return '暂无数据\n\n';
  
  let output = `| 报告期 | 债转股 | 可转债 | 融资租赁 | 拆出资金 | 期末现金 | 期初现金 | 现金等价物期末 | 现金等价物期初 | 汇率影响 |\n`;
  output += `|--------|--------|--------|----------|----------|----------|----------|---------------|---------------|----------|\n`;
  
  for (const item of data) {
    const period = item.end_date || item.period || 'N/A';
    const debtToCap = formatNumber(item.conv_debt_into_cap);
    const convertBond = formatNumber(item.conv_copbonds_due_within_1y);
    const finLease = formatNumber(item.fa_fnc_leases);
    const dismCapital = formatNumber(item.net_dism_capital_add);
    const endCash = formatNumber(item.end_bal_cash);
    const begCash = formatNumber(item.beg_bal_cash);
    const endCashEqu = formatNumber(item.end_bal_cash_equ);
    const begCashEqu = formatNumber(item.beg_bal_cash_equ);
    const fxEffect = formatNumber(item.eff_fx_flu_cash);
    
    output += `| ${period} | ${debtToCap} | ${convertBond} | ${finLease} | ${dismCapital} | ${endCash} | ${begCash} | ${endCashEqu} | ${begCashEqu} | ${fxEffect} |\n`;
  }
  
  output += '\n**💡 说明：** 单位：万元，特殊业务和现金明细\n\n';
  return output;
}

// 7. 全部现金流数据格式化
export function formatCashflowAll(data: any[]): string {
  if (!data || data.length === 0) return '暂无数据\n\n';
  
  let output = `**💰 完整现金流数据总览**\n\n`;
  
  // 先显示核心数据表格
  output += `| 报告期 | 净利润 | 经营现金流 | 投资现金流 | 筹资现金流 | 自由现金流 | 现金净增加 |\n`;
  output += `|--------|--------|-----------|-----------|-----------|-----------|----------|\n`;
  
  for (const item of data) {
    const period = item.end_date || item.period || 'N/A';
    const netProfit = formatNumber(item.net_profit);
    const operatingCF = formatNumber(item.n_cashflow_act);
    const investingCF = formatNumber(item.n_cashflow_inv_act);
    const financingCF = formatNumber(item.n_cash_flows_fnc_act);
    const freeCF = formatNumber(item.free_cashflow);
    const netIncrease = formatNumber(item.n_incr_cash_cash_equ);
    
    output += `| ${period} | ${netProfit} | ${operatingCF} | ${investingCF} | ${financingCF} | ${freeCF} | ${netIncrease} |\n`;
  }
  
  // 统计完整数据项数量
  if (data.length > 0) {
    const fieldsWithData = Object.keys(data[0]).filter(key => 
      data[0][key] !== null && 
      data[0][key] !== undefined && 
      data[0][key] !== '' &&
      !['ts_code', 'ann_date', 'f_ann_date', 'end_date', 'comp_type', 'report_type', 'end_type'].includes(key)
    );
    
    output += `\n**💡 说明：** 单位：万元，完整数据包含 ${fieldsWithData.length} 个字段项目\n`;
    output += `如需查看详细项目，请使用对应的细分类型查询（如 operating_cashflow、investing_cashflow 等）\n\n`;
  }
  
  return output;
} 