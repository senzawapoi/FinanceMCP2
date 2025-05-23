import { TUSHARE_CONFIG } from '../config.js';
export const macroEcon = {
    name: "macro_econ",
    description: "获取宏观经济数据，包括Shibor利率、LPR利率、GDP、CPI、PPI、货币供应量、PMI、社融增量、Shibor报价、Libor、Hibor等",
    parameters: {
        type: "object",
        properties: {
            indicator: {
                type: "string",
                description: "指标类型，可选值：shibor(上海银行间同业拆放利率),lpr(贷款基础利率),gdp(国内生产总值),cpi(居民消费价格指数),ppi(工业品出厂价格指数),cn_m(货币供应量),cn_pmi(采购经理指数),cn_sf(社会融资规模增量),shibor_quote(Shibor银行报价),shibor_lq(Shibor均值),libor(Libor利率),hibor(Hibor利率)"
            },
            start_date: {
                type: "string",
                description: "起始日期，格式为YYYYMMDD，如'20230101'"
            },
            end_date: {
                type: "string",
                description: "结束日期，格式为YYYYMMDD，如'20230131'"
            }
        },
        required: ["indicator"]
    },
    async run(args) {
        try {
            console.log(`使用Tushare API获取${args.indicator}宏观经济数据`);
            // 使用全局配置中的Tushare API设置
            const TUSHARE_API_KEY = TUSHARE_CONFIG.API_TOKEN;
            const TUSHARE_API_URL = TUSHARE_CONFIG.API_URL;
            // 验证指标类型
            const validIndicators = ['shibor', 'lpr', 'gdp', 'cpi', 'ppi', 'cn_m', 'cn_pmi', 'cn_sf', 'shibor_quote', 'shibor_lq', 'libor', 'hibor'];
            if (!validIndicators.includes(args.indicator)) {
                throw new Error(`不支持的指标类型: ${args.indicator}。支持的类型有: ${validIndicators.join(', ')}`);
            }
            // 根据指标类型设置不同的默认时间范围
            const today = new Date();
            const defaultEndDate = today.toISOString().slice(0, 10).replace(/-/g, '');
            let defaultStartDate = '';
            // 日期格式数据：默认7天
            const dailyIndicators = ['shibor', 'lpr', 'shibor_quote', 'shibor_lq', 'libor', 'hibor'];
            // 月份格式数据：默认7个月
            const monthlyIndicators = ['cpi', 'ppi', 'cn_m', 'cn_pmi', 'cn_sf'];
            // 季度格式数据：默认7个季度
            const quarterlyIndicators = ['gdp'];
            if (dailyIndicators.includes(args.indicator)) {
                // 7天前
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                defaultStartDate = sevenDaysAgo.toISOString().slice(0, 10).replace(/-/g, '');
            }
            else if (monthlyIndicators.includes(args.indicator)) {
                // 7个月前
                const sevenMonthsAgo = new Date();
                sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
                defaultStartDate = sevenMonthsAgo.toISOString().slice(0, 10).replace(/-/g, '');
            }
            else if (quarterlyIndicators.includes(args.indicator)) {
                // 7个季度前（约21个月）
                const sevenQuartersAgo = new Date();
                sevenQuartersAgo.setMonth(sevenQuartersAgo.getMonth() - 21);
                defaultStartDate = sevenQuartersAgo.toISOString().slice(0, 10).replace(/-/g, '');
            }
            else {
                // 其他情况默认1个月
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                defaultStartDate = oneMonthAgo.toISOString().slice(0, 10).replace(/-/g, '');
            }
            // 构建请求参数
            const params = {
                token: TUSHARE_API_KEY,
                params: {}, // 这里留空，后面根据不同的API添加特定参数
                fields: ""
            };
            // 根据不同指标类型设置不同的API名称、参数和字段
            switch (args.indicator) {
                case 'shibor':
                    params.api_name = "shibor_data";
                    params.fields = "date,on,1w,2w,1m,3m,6m,9m,1y";
                    // shibor_data接口使用date作为日期参数
                    params.params = {
                        start_date: args.start_date || defaultStartDate,
                        end_date: args.end_date || defaultEndDate
                    };
                    break;
                case 'lpr':
                    params.api_name = "lpr_data";
                    params.fields = "date,1y,5y";
                    // lpr_data接口使用start_date和end_date作为参数
                    params.params = {
                        start_date: args.start_date || defaultStartDate,
                        end_date: args.end_date || defaultEndDate
                    };
                    break;
                case 'gdp':
                    params.api_name = "cn_gdp";
                    params.fields = "quarter,gdp,gdp_yoy,pi,pi_yoy,si,si_yoy,ti,ti_yoy";
                    // GDP数据使用季度格式，需要转换日期格式为季度格式
                    const startYearQuarter = dateToQuarter(args.start_date || defaultStartDate);
                    const endYearQuarter = dateToQuarter(args.end_date || defaultEndDate);
                    params.params = {
                        start_q: startYearQuarter,
                        end_q: endYearQuarter
                    };
                    break;
                case 'cpi':
                    params.api_name = "cn_cpi";
                    params.fields = "month,nt_cpi,nt_yoy,nt_mom,nt_accu,town_cpi,town_yoy,town_mom,town_accu,cnt_cpi,cnt_yoy,cnt_mom,cnt_accu";
                    // CPI数据使用月份格式
                    const startMonth = dateToMonth(args.start_date || defaultStartDate);
                    const endMonth = dateToMonth(args.end_date || defaultEndDate);
                    params.params = {
                        m: "", // 可选单月
                        start_m: startMonth,
                        end_m: endMonth
                    };
                    break;
                case 'ppi':
                    params.api_name = "cn_ppi";
                    params.fields = "month,ppi_yoy,ppi_mom,ppi_accu,rpi_yoy,rpi_mom,rpi_accu";
                    // PPI数据使用月份格式
                    const startMonthPPI = dateToMonth(args.start_date || defaultStartDate);
                    const endMonthPPI = dateToMonth(args.end_date || defaultEndDate);
                    params.params = {
                        m: "", // 可选单月
                        start_m: startMonthPPI,
                        end_m: endMonthPPI
                    };
                    break;
                case 'cn_m':
                    params.api_name = "cn_m";
                    params.fields = "month,m0,m0_yoy,m0_mom,m1,m1_yoy,m1_mom,m2,m2_yoy,m2_mom";
                    // 货币供应量数据使用月份格式
                    const startMonthM = dateToMonth(args.start_date || defaultStartDate);
                    const endMonthM = dateToMonth(args.end_date || defaultEndDate);
                    params.params = {
                        m: "", // 可选单月
                        start_m: startMonthM,
                        end_m: endMonthM
                    };
                    break;
                case 'cn_pmi':
                    params.api_name = "cn_pmi";
                    params.fields = "month,man_pmi,man_index,man_pro,man_ode,man_inv,man_emp,man_sup,ser_pmi,ser_pro,ser_ode,ser_emp,ser_fin,com_pmi";
                    // PMI数据使用月份格式
                    const startMonthPMI = dateToMonth(args.start_date || defaultStartDate);
                    const endMonthPMI = dateToMonth(args.end_date || defaultEndDate);
                    params.params = {
                        m: "", // 可选单月
                        start_m: startMonthPMI,
                        end_m: endMonthPMI
                    };
                    break;
                case 'cn_sf':
                    params.api_name = "cn_sf";
                    params.fields = "month,value,rf_loans,ent_bonds,stock_financing,ins_invest,ent_inv,other_inv";
                    // 社融增量数据使用月份格式
                    const startMonthSF = dateToMonth(args.start_date || defaultStartDate);
                    const endMonthSF = dateToMonth(args.end_date || defaultEndDate);
                    params.params = {
                        m: "", // 可选单月
                        start_m: startMonthSF,
                        end_m: endMonthSF
                    };
                    break;
                case 'shibor_quote':
                    params.api_name = "shibor_quote";
                    params.fields = "date,bank,on_b,on_a,1w_b,1w_a,2w_b,2w_a,1m_b,1m_a,3m_b,3m_a,6m_b,6m_a,9m_b,9m_a,1y_b,1y_a";
                    // Shibor报价数据使用日期格式
                    params.params = {
                        start_date: args.start_date || defaultStartDate,
                        end_date: args.end_date || defaultEndDate
                    };
                    break;
                case 'shibor_lq':
                    params.api_name = "shibor_lq";
                    params.fields = "date,on,1w,2w,1m,3m,6m,9m,1y";
                    // Shibor均值数据使用日期格式
                    params.params = {
                        start_date: args.start_date || defaultStartDate,
                        end_date: args.end_date || defaultEndDate
                    };
                    break;
                case 'libor':
                    params.api_name = "libor";
                    params.fields = "date,curr,on,1w,1m,2m,3m,6m,12m";
                    // Libor利率数据使用日期格式
                    params.params = {
                        start_date: args.start_date || defaultStartDate,
                        end_date: args.end_date || defaultEndDate,
                        curr: "USD" // 默认美元
                    };
                    break;
                case 'hibor':
                    params.api_name = "hibor";
                    params.fields = "date,on,1w,2w,1m,2m,3m,4m,5m,6m,9m,1y";
                    // Hibor利率数据使用日期格式
                    params.params = {
                        start_date: args.start_date || defaultStartDate,
                        end_date: args.end_date || defaultEndDate
                    };
                    break;
            }
            // 设置请求超时
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TUSHARE_CONFIG.TIMEOUT);
            try {
                console.log(`请求Tushare API: ${params.api_name}，参数:`, params.params);
                // 发送请求
                const response = await fetch(TUSHARE_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(params),
                    signal: controller.signal
                });
                if (!response.ok) {
                    throw new Error(`Tushare API请求失败: ${response.status}`);
                }
                const data = await response.json();
                // 处理响应数据
                if (data.code !== 0) {
                    throw new Error(`Tushare API错误: ${data.msg}`);
                }
                // 确保data.data和data.data.items存在
                if (!data.data || !data.data.items || data.data.items.length === 0) {
                    throw new Error(`未找到${args.indicator}宏观经济数据`);
                }
                // 获取字段名
                const fields = data.data.fields;
                // 将数据转换为对象数组
                const econData = data.data.items.map((item) => {
                    const result = {};
                    fields.forEach((field, index) => {
                        result[field] = item[index];
                    });
                    return result;
                });
                // 生成指标表头
                let titleMap = {
                    'shibor': 'Shibor利率',
                    'lpr': 'LPR贷款基础利率',
                    'gdp': '国内生产总值(GDP)',
                    'cpi': '居民消费价格指数(CPI)',
                    'ppi': '工业品出厂价格指数(PPI)',
                    'cn_m': '货币供应量',
                    'cn_pmi': '采购经理指数(PMI)',
                    'cn_sf': '社会融资规模增量',
                    'shibor_quote': 'Shibor银行报价数据',
                    'shibor_lq': 'Shibor均值数据',
                    'libor': 'Libor利率',
                    'hibor': 'Hibor利率'
                };
                // 格式化数据（根据不同指标类型构建不同的格式）
                let formattedData = '';
                if (args.indicator === 'shibor' || args.indicator === 'lpr') {
                    // 日期型数据展示
                    formattedData = econData.map((data) => {
                        let row = '';
                        for (const [key, value] of Object.entries(data)) {
                            if (key !== 'date') {
                                row += `**${key}**: ${value}%  `;
                            }
                        }
                        return `## ${data.date}\n${row}\n`;
                    }).join('\n---\n\n');
                }
                else if (args.indicator === 'shibor_quote') {
                    // Shibor报价数据展示
                    formattedData = econData.map((data) => {
                        return `## ${data.date} - ${data.bank}\n**隔夜**: 买价${data.on_b}% 卖价${data.on_a}%  **1周**: 买价${data['1w_b']}% 卖价${data['1w_a']}%\n**1月**: 买价${data['1m_b']}% 卖价${data['1m_a']}%  **3月**: 买价${data['3m_b']}% 卖价${data['3m_a']}%\n**6月**: 买价${data['6m_b']}% 卖价${data['6m_a']}%  **1年**: 买价${data['1y_b']}% 卖价${data['1y_a']}%\n`;
                    }).join('\n---\n\n');
                }
                else if (args.indicator === 'shibor_lq' || args.indicator === 'libor' || args.indicator === 'hibor') {
                    // 其他利率数据展示
                    formattedData = econData.map((data) => {
                        let row = '';
                        for (const [key, value] of Object.entries(data)) {
                            if (key !== 'date' && key !== 'curr') {
                                row += `**${key}**: ${value}%  `;
                            }
                        }
                        const currencyInfo = data.curr ? ` (${data.curr})` : '';
                        return `## ${data.date}${currencyInfo}\n${row}\n`;
                    }).join('\n---\n\n');
                }
                else if (args.indicator === 'gdp') {
                    // 季度型数据展示
                    formattedData = econData.map((data) => {
                        return `## ${data.quarter}\n**GDP总值**: ${data.gdp}亿元  **同比增长**: ${data.gdp_yoy}%\n**第一产业**: ${data.pi}亿元  **同比**: ${data.pi_yoy}%\n**第二产业**: ${data.si}亿元  **同比**: ${data.si_yoy}%\n**第三产业**: ${data.ti}亿元  **同比**: ${data.ti_yoy}%\n`;
                    }).join('\n---\n\n');
                }
                else if (args.indicator === 'cn_m') {
                    // 货币供应量数据展示
                    formattedData = econData.map((data) => {
                        return `## ${data.month}\n**M0**: ${data.m0}亿元  **同比**: ${data.m0_yoy}%  **环比**: ${data.m0_mom}%\n**M1**: ${data.m1}亿元  **同比**: ${data.m1_yoy}%  **环比**: ${data.m1_mom}%\n**M2**: ${data.m2}亿元  **同比**: ${data.m2_yoy}%  **环比**: ${data.m2_mom}%\n`;
                    }).join('\n---\n\n');
                }
                else if (args.indicator === 'cn_pmi') {
                    // PMI数据展示
                    formattedData = econData.map((data) => {
                        return `## ${data.month}\n**制造业PMI**: ${data.man_pmi}  **制造业指数**: ${data.man_index}\n**服务业PMI**: ${data.ser_pmi}  **综合PMI**: ${data.com_pmi}\n**制造业生产**: ${data.man_pro}  **制造业新订单**: ${data.man_ode}\n`;
                    }).join('\n---\n\n');
                }
                else if (args.indicator === 'cn_sf') {
                    // 社融增量数据展示
                    formattedData = econData.map((data) => {
                        return `## ${data.month}\n**社融总量**: ${data.value}亿元\n**人民币贷款**: ${data.rf_loans}亿元  **企业债券**: ${data.ent_bonds}亿元\n**股票融资**: ${data.stock_financing}亿元  **保险投资**: ${data.ins_invest}亿元\n`;
                    }).join('\n---\n\n');
                }
                else {
                    // 月度型数据展示 (CPI, PPI)
                    formattedData = econData.map((data) => {
                        let row = '';
                        for (const [key, value] of Object.entries(data)) {
                            if (key !== 'month') {
                                row += `**${key}**: ${value}  `;
                            }
                        }
                        return `## ${data.month}\n${row}\n`;
                    }).join('\n---\n\n');
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: `# ${titleMap[args.indicator]}数据\n\n${formattedData}`
                        }
                    ]
                };
            }
            finally {
                clearTimeout(timeoutId);
            }
        }
        catch (error) {
            console.error("获取宏观经济数据失败:", error);
            return {
                content: [
                    {
                        type: "text",
                        text: `# 获取${args.indicator}宏观经济数据失败\n\n无法从Tushare API获取数据：${error instanceof Error ? error.message : String(error)}\n\n请检查指标类型是否正确，支持的类型有: shibor, lpr, gdp, cpi, ppi`
                    }
                ]
            };
        }
    }
};
/**
 * 将日期格式(YYYYMMDD)转换为季度格式(YYYYQN)
 */
function dateToQuarter(dateStr) {
    if (!dateStr || dateStr.length < 8)
        return "";
    const year = dateStr.substring(0, 4);
    const month = parseInt(dateStr.substring(4, 6));
    // 确定季度
    let quarter;
    if (month >= 1 && month <= 3)
        quarter = 1;
    else if (month >= 4 && month <= 6)
        quarter = 2;
    else if (month >= 7 && month <= 9)
        quarter = 3;
    else
        quarter = 4;
    return `${year}Q${quarter}`;
}
/**
 * 将日期格式(YYYYMMDD)转换为月份格式(YYYYMM)
 */
function dateToMonth(dateStr) {
    if (!dateStr || dateStr.length < 8)
        return "";
    return dateStr.substring(0, 6);
}
