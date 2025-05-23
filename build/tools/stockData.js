import { TUSHARE_CONFIG } from '../config.js';
export const stockData = {
    name: "stock_data",
    description: "获取指定股票的历史行情数据，支持A股、美股、港股和外汇",
    parameters: {
        type: "object",
        properties: {
            code: {
                type: "string",
                description: "股票代码，如'000001.SZ'表示平安银行(A股)，'AAPL'表示苹果(美股)，'00700.HK'表示腾讯(港股)，'USDCNY'表示美元人民币(外汇)"
            },
            market_type: {
                type: "string",
                description: "市场类型（必需），可选值：cn(A股),us(美股),hk(港股),fx(外汇)"
            },
            start_date: {
                type: "string",
                description: "起始日期，格式为YYYYMMDD，如'20230101'"
            },
            end_date: {
                type: "string",
                description: "结束日期，格式为YYYYMMDD，如'20230131'"
            },
            fields: {
                type: "string",
                description: "需要的字段，可选值包括：open,high,low,close,vol等，多个字段用逗号分隔"
            }
        },
        required: ["code", "market_type"]
    },
    async run(args) {
        try {
            // 添加调试日志
            console.log('接收到的参数:', args);
            // 检查market_type参数
            if (!args.market_type) {
                throw new Error('请指定market_type参数：cn(A股)、us(美股)、hk(港股)、fx(外汇)');
            }
            const marketType = args.market_type.trim().toLowerCase();
            console.log(`使用的市场类型: ${marketType}`);
            console.log(`使用Tushare API获取${marketType}市场股票${args.code}的行情数据`);
            // 使用全局配置中的Tushare API设置
            const TUSHARE_API_KEY = TUSHARE_CONFIG.API_TOKEN;
            const TUSHARE_API_URL = TUSHARE_CONFIG.API_URL;
            // 默认参数设置
            const today = new Date();
            const defaultEndDate = today.toISOString().slice(0, 10).replace(/-/g, '');
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            const defaultStartDate = oneMonthAgo.toISOString().slice(0, 10).replace(/-/g, '');
            // 验证市场类型
            const validMarkets = ['cn', 'us', 'hk', 'fx'];
            if (!validMarkets.includes(marketType)) {
                throw new Error(`不支持的市场类型: ${marketType}。支持的类型有: ${validMarkets.join(', ')}`);
            }
            // 构建请求参数
            const params = {
                token: TUSHARE_API_KEY,
                params: {
                    ts_code: args.code,
                    start_date: args.start_date || defaultStartDate,
                    end_date: args.end_date || defaultEndDate
                },
                fields: ""
            };
            // 根据不同市场类型设置不同的API名称、参数和字段
            switch (marketType) {
                case 'cn':
                    params.api_name = "daily";
                    params.fields = args.fields || "ts_code,trade_date,open,high,low,close,vol,amount";
                    break;
                case 'us':
                    params.api_name = "us_daily";
                    params.fields = args.fields || "ts_code,trade_date,open,high,low,close,pre_close,change,pct_change,vol,amount";
                    break;
                case 'hk':
                    params.api_name = "hk_daily";
                    params.fields = args.fields || "ts_code,trade_date,open,high,low,close,pre_close,change,pct_change,vol,amount";
                    break;
                case 'fx':
                    params.api_name = "fx_daily";
                    params.fields = args.fields || "ts_code,trade_date,open,high,low,close";
                    break;
            }
            console.log(`选择的API接口: ${params.api_name}`);
            console.log(`使用的字段: ${params.fields}`);
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
                    throw new Error(`未找到${marketType}市场股票${args.code}的行情数据`);
                }
                // 获取字段名
                const fields = data.data.fields;
                // 将数据转换为对象数组
                const stockData = data.data.items.map((item) => {
                    const result = {};
                    fields.forEach((field, index) => {
                        result[field] = item[index];
                    });
                    return result;
                });
                console.log(`成功获取到${stockData.length}条${args.code}股票数据记录`);
                // 生成市场类型标题
                const marketTitleMap = {
                    'cn': 'A股',
                    'us': '美股',
                    'hk': '港股',
                    'fx': '外汇'
                };
                // 格式化输出（根据不同市场类型构建不同的格式）
                let formattedData = '';
                if (marketType === 'fx') {
                    // 外汇数据展示
                    formattedData = stockData.map((data) => {
                        return `## ${data.trade_date}\n**开盘**: ${data.open}  **最高**: ${data.high}  **最低**: ${data.low}  **收盘**: ${data.close}\n`;
                    }).join('\n---\n\n');
                }
                else {
                    // 股票数据展示
                    formattedData = stockData.map((data) => {
                        let row = '';
                        for (const [key, value] of Object.entries(data)) {
                            if (key !== 'ts_code' && key !== 'trade_date') {
                                row += `**${key}**: ${value}  `;
                            }
                        }
                        return `## ${data.trade_date}\n${row}\n`;
                    }).join('\n---\n\n');
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: `# ${args.code} ${marketTitleMap[marketType]}行情数据\n\n${formattedData}`
                        }
                    ]
                };
            }
            finally {
                clearTimeout(timeoutId);
            }
        }
        catch (error) {
            console.error("获取股票数据失败:", error);
            return {
                content: [
                    {
                        type: "text",
                        text: `# 获取股票${args.code}数据失败\n\n无法从Tushare API获取数据：${error instanceof Error ? error.message : String(error)}\n\n请检查股票代码和市场类型是否正确：\n- A股格式："000001.SZ"\n- 美股格式："AAPL"\n- 港股格式："00700.HK"\n- 外汇格式："USDCNY"`
                    }
                ]
            };
        }
    }
};
