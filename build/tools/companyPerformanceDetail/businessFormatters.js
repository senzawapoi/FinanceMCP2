// 主营业务构成格式化函数模块
// 用于处理主营业务构成数据展示
// 辅助函数：格式化数字
function formatNumber(num) {
    if (num === null || num === undefined || num === '')
        return 'N/A';
    const number = parseFloat(num);
    if (isNaN(number))
        return 'N/A';
    return number.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
}
// 格式化主营业务构成数据
export function formatMainBusiness(data) {
    if (!data || data.length === 0) {
        return `暂无数据\n\n`;
    }
    let output = '';
    // 按报告期分组
    const groupedData = {};
    for (const item of data) {
        const period = item.end_date || 'unknown';
        if (!groupedData[period]) {
            groupedData[period] = [];
        }
        groupedData[period].push(item);
    }
    // 按报告期排序（最新的在前）
    const sortedPeriods = Object.keys(groupedData).sort((a, b) => b.localeCompare(a));
    // 为每个报告期生成表格
    for (const period of sortedPeriods) {
        const items = groupedData[period];
        output += `#### 📅 ${period} 报告期\n\n`;
        // 创建表格头
        output += `| 业务项目 | 主营收入(万元) | 主营利润(万元) | 主营成本(万元) | 货币代码 |\n`;
        output += `|---------|-------------|-------------|-------------|----------|\n`;
        // 添加数据行
        for (const item of items) {
            const bzItem = item.bz_item || 'N/A';
            const bzSales = item.bz_sales ? formatNumber(item.bz_sales) : 'N/A';
            const bzProfit = item.bz_profit ? formatNumber(item.bz_profit) : 'N/A';
            const bzCost = item.bz_cost ? formatNumber(item.bz_cost) : 'N/A';
            const currType = item.curr_type || 'CNY';
            output += `| ${bzItem} | ${bzSales} | ${bzProfit} | ${bzCost} | ${currType} |\n`;
        }
        output += '\n';
    }
    return output;
}
