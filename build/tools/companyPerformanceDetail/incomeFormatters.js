// 利润表数据格式化函数 - 简洁表格版本
// 格式化数字的辅助函数
function formatNumber(num) {
    if (num === null || num === undefined || num === '')
        return 'N/A';
    const number = parseFloat(num);
    if (isNaN(number))
        return 'N/A';
    return number.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
}
// 辅助函数：获取报告类型描述
function getReportType(type) {
    const typeMap = {
        '1': '合并报表',
        '2': '单季合并',
        '6': '母公司报表'
    };
    return typeMap[type] || `类型${type}`;
}
// 辅助函数：获取公司类型描述
function getCompanyType(type) {
    const typeMap = {
        '1': '一般工商业',
        '2': '银行',
        '3': '保险',
        '4': '证券'
    };
    return typeMap[type] || `类型${type}`;
}
// 1. 格式化核心利润表数据
export function formatBasicIncome(data) {
    if (!data || data.length === 0)
        return '暂无数据\n\n';
    let output = `| 报告期 | 基本EPS | 稀释EPS | 营业收入 | 营业成本 | 营业利润 | 利润总额 | 所得税 | **净利润** | **归母净利润** | EBIT | EBITDA |\n`;
    output += `|--------|---------|---------|----------|----------|----------|----------|--------|-----------|-------------|------|--------|\n`;
    for (const item of data) {
        const period = item.end_date || 'N/A';
        const basicEps = item.basic_eps ? item.basic_eps.toFixed(4) : 'N/A';
        const dilutedEps = item.diluted_eps ? item.diluted_eps.toFixed(4) : 'N/A';
        const revenue = formatNumber(item.revenue);
        const operCost = formatNumber(item.oper_cost);
        const operProfit = formatNumber(item.operate_profit);
        const totalProfit = formatNumber(item.total_profit);
        const incomeTax = formatNumber(item.income_tax);
        const nIncome = formatNumber(item.n_income);
        const nIncomeAttrP = formatNumber(item.n_income_attr_p);
        const ebit = formatNumber(item.ebit);
        const ebitda = formatNumber(item.ebitda);
        output += `| ${period} | ${basicEps} | ${dilutedEps} | ${revenue} | ${operCost} | ${operProfit} | ${totalProfit} | ${incomeTax} | **${nIncome}** | **${nIncomeAttrP}** | ${ebit} | ${ebitda} |\n`;
    }
    output += `\n**💡 说明：** 单位：万元，EPS单位：元，报告类型：${getReportType(data[0]?.report_type || '1')}\n\n`;
    return output;
}
// 2. 格式化营业收入详细构成
export function formatRevenueIncome(data) {
    if (!data || data.length === 0)
        return '暂无数据\n\n';
    let output = `| 报告期 | 营业总收入 | 营业收入 | 利息收入 | 手续费收入 | 投资收益 | 公允价值变动 | 其他收入 | **总收入** |\n`;
    output += `|--------|-----------|----------|----------|-----------|----------|-------------|----------|----------|\n`;
    for (const item of data) {
        const period = item.end_date || 'N/A';
        const totalRevenue = formatNumber(item.total_revenue);
        const revenue = formatNumber(item.revenue);
        const intIncome = formatNumber(item.int_income);
        const commIncome = formatNumber(item.comm_income);
        const investIncome = formatNumber(item.invest_income);
        const fvValueChg = formatNumber(item.fv_value_chg_gain);
        const othIncome = formatNumber(item.n_oth_income);
        const totalMain = formatNumber(item.total_revenue);
        output += `| ${period} | ${totalRevenue} | ${revenue} | ${intIncome} | ${commIncome} | ${investIncome} | ${fvValueChg} | ${othIncome} | **${totalMain}** |\n`;
    }
    output += `\n**💡 说明：** 单位：万元，收入构成分析\n\n`;
    return output;
}
// 3. 格式化营业成本费用详细构成
export function formatCostIncome(data) {
    if (!data || data.length === 0)
        return '暂无数据\n\n';
    let output = `| 报告期 | 营业总成本 | 营业成本 | 销售费用 | 管理费用 | 研发费用 | 财务费用 | 资产减值 | **总成本** |\n`;
    output += `|--------|-----------|----------|----------|----------|----------|----------|----------|----------|\n`;
    for (const item of data) {
        const period = item.end_date || 'N/A';
        const totalCogs = formatNumber(item.total_cogs);
        const operCost = formatNumber(item.oper_cost);
        const sellExp = formatNumber(item.sell_exp);
        const adminExp = formatNumber(item.admin_exp);
        const rdExp = formatNumber(item.rd_exp);
        const finExp = formatNumber(item.fin_exp);
        const assetsImpair = formatNumber(item.assets_impair_loss);
        const totalCostMain = formatNumber(item.total_cogs);
        output += `| ${period} | ${totalCogs} | ${operCost} | ${sellExp} | ${adminExp} | ${rdExp} | ${finExp} | ${assetsImpair} | **${totalCostMain}** |\n`;
    }
    output += `\n**💡 说明：** 单位：万元，成本费用构成分析\n\n`;
    return output;
}
// 4. 格式化利润构成详细分析
export function formatProfitIncome(data) {
    if (!data || data.length === 0)
        return '暂无数据\n\n';
    let output = `| 报告期 | 营业利润 | 营业外收入 | 营业外支出 | 利润总额 | 所得税 | **净利润** | **归母净利润** | 少数股东损益 | 综合收益总额 |\n`;
    output += `|--------|----------|-----------|-----------|----------|--------|-----------|-------------|-------------|-------------|\n`;
    for (const item of data) {
        const period = item.end_date || 'N/A';
        const operProfit = formatNumber(item.operate_profit);
        const nonOperIncome = formatNumber(item.non_oper_income);
        const nonOperExp = formatNumber(item.non_oper_exp);
        const totalProfit = formatNumber(item.total_profit);
        const incomeTax = formatNumber(item.income_tax);
        const nIncome = formatNumber(item.n_income);
        const nIncomeAttrP = formatNumber(item.n_income_attr_p);
        const minorityGain = formatNumber(item.minority_gain);
        const tComprIncome = formatNumber(item.t_compr_income);
        output += `| ${period} | ${operProfit} | ${nonOperIncome} | ${nonOperExp} | ${totalProfit} | ${incomeTax} | **${nIncome}** | **${nIncomeAttrP}** | ${minorityGain} | ${tComprIncome} |\n`;
    }
    output += `\n**💡 说明：** 单位：万元，利润结构分析\n\n`;
    return output;
}
// 5. 格式化保险业务专用数据
export function formatInsuranceIncome(data) {
    if (!data || data.length === 0)
        return '暂无数据\n\n';
    let output = `| 报告期 | 已赚保费 | 保险收入 | 分出保费 | 再保收入 | 保险支出 | 赔付支出 | 退保金 | **保险净收益** |\n`;
    output += `|--------|----------|----------|----------|----------|----------|----------|--------|-------------|\n`;
    for (const item of data) {
        const period = item.end_date || 'N/A';
        const premEarned = formatNumber(item.prem_earned);
        const premIncome = formatNumber(item.prem_income);
        const outPrem = formatNumber(item.out_prem);
        const reinsIncome = formatNumber(item.reins_income);
        const insuranceExp = formatNumber(item.insurance_exp);
        const compensPayout = formatNumber(item.compens_payout);
        const premRefund = formatNumber(item.prem_refund);
        const netInsurance = item.prem_earned && item.insurance_exp ?
            formatNumber(item.prem_earned - item.insurance_exp) : 'N/A';
        output += `| ${period} | ${premEarned} | ${premIncome} | ${outPrem} | ${reinsIncome} | ${insuranceExp} | ${compensPayout} | ${premRefund} | **${netInsurance}** |\n`;
    }
    output += `\n**💡 说明：** 单位：万元，保险业务专用\n\n`;
    return output;
}
// 6. 格式化利润分配相关数据
export function formatDistributionIncome(data) {
    if (!data || data.length === 0)
        return '暂无数据\n\n';
    let output = `| 报告期 | 未分配利润 | 可分配利润 | 提取盈余公积 | 提取公益金 | 普通股股利 | 优先股股利 | **股东分配** |\n`;
    output += `|--------|-----------|-----------|-------------|------------|-----------|-----------|-------------||\n`;
    for (const item of data) {
        const period = item.end_date || 'N/A';
        const undistProfit = formatNumber(item.undist_profit);
        const distableProfit = formatNumber(item.distable_profit);
        const withdraLegal = formatNumber(item.withdra_legal_surplus);
        const withdraPubfund = formatNumber(item.withdra_legal_pubfund);
        const comshareDiv = formatNumber(item.comshare_payable_dvd);
        const prfshareDiv = formatNumber(item.prfshare_payable_dvd);
        const totalDistrib = item.comshare_payable_dvd && item.prfshare_payable_dvd ?
            formatNumber((item.comshare_payable_dvd || 0) + (item.prfshare_payable_dvd || 0)) : formatNumber(item.comshare_payable_dvd || item.prfshare_payable_dvd);
        output += `| ${period} | ${undistProfit} | ${distableProfit} | ${withdraLegal} | ${withdraPubfund} | ${comshareDiv} | ${prfshareDiv} | **${totalDistrib}** |\n`;
    }
    output += `\n**💡 说明：** 单位：万元，利润分配情况\n\n`;
    return output;
}
// 7. 格式化特殊项目和调整项
export function formatSpecialIncome(data) {
    if (!data || data.length === 0)
        return '暂无数据\n\n';
    let output = `| 报告期 | 调整损益 | 其他收益 | 资产处置收益 | 套期收益 | 其他业务成本 | 营业支出 | **特殊项净额** |\n`;
    output += `|--------|----------|----------|-------------|----------|-------------|----------|-------------|\n`;
    for (const item of data) {
        const period = item.end_date || 'N/A';
        const adjLossgain = formatNumber(item.adj_lossgain);
        const othIncome = formatNumber(item.oth_income);
        const assetDispIncome = formatNumber(item.asset_disp_income);
        const hedgingBenefits = formatNumber(item.net_expo_hedging_benefits);
        const otherBusCost = formatNumber(item.other_bus_cost);
        const operExp = formatNumber(item.oper_exp);
        const specialNet = 'N/A'; // 计算特殊项目净额比较复杂，这里简化
        output += `| ${period} | ${adjLossgain} | ${othIncome} | ${assetDispIncome} | ${hedgingBenefits} | ${otherBusCost} | ${operExp} | **${specialNet}** |\n`;
    }
    output += `\n**💡 说明：** 单位：万元，特殊项目和调整\n\n`;
    return output;
}
// 8. 格式化完整利润表数据（简化版）
export function formatAllIncome(data) {
    if (!data || data.length === 0)
        return '暂无数据\n\n';
    let output = `**📊 完整利润表数据总览**\n\n`;
    // 核心利润表数据
    output += `| 报告期 | 营业收入 | 营业成本 | 营业利润 | 利润总额 | **净利润** | **归母净利润** | 基本EPS | 稀释EPS |\n`;
    output += `|--------|----------|----------|----------|----------|-----------|-------------|---------|----------|\n`;
    for (const item of data) {
        const period = item.end_date || 'N/A';
        const revenue = formatNumber(item.revenue);
        const operCost = formatNumber(item.oper_cost);
        const operProfit = formatNumber(item.operate_profit);
        const totalProfit = formatNumber(item.total_profit);
        const nIncome = formatNumber(item.n_income);
        const nIncomeAttrP = formatNumber(item.n_income_attr_p);
        const basicEps = item.basic_eps ? item.basic_eps.toFixed(4) : 'N/A';
        const dilutedEps = item.diluted_eps ? item.diluted_eps.toFixed(4) : 'N/A';
        output += `| ${period} | ${revenue} | ${operCost} | ${operProfit} | ${totalProfit} | **${nIncome}** | **${nIncomeAttrP}** | ${basicEps} | ${dilutedEps} |\n`;
    }
    // 统计完整数据项数量
    if (data.length > 0) {
        const fieldsWithData = Object.keys(data[0]).filter(key => data[0][key] !== null &&
            data[0][key] !== undefined &&
            data[0][key] !== '' &&
            !['ts_code', 'ann_date', 'f_ann_date', 'end_date', 'comp_type', 'report_type'].includes(key));
        output += `\n**💡 说明：** 单位：万元，EPS单位：元，完整数据包含 ${fieldsWithData.length} 个字段项目\n`;
        output += `如需查看详细项目，请使用对应的细分类型查询（如 revenue、cost、profit 等）\n\n`;
    }
    return output;
}
