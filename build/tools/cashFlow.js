import { TUSHARE_CONFIG } from '../config.js';
import { formatBasicCashFlow, formatOperatingCashFlow, formatInvestingCashFlow, formatFinancingCashFlow, formatCashflowSupplement, formatSpecialCashFlow, formatCashflowAll } from './companyPerformanceDetail/cashflowFormatters.js';
export const cashFlow = {
    name: "cash_flow",
    description: "获取上市公司现金流量数据：基础现金流、经营活动现金流(含员工薪酬)、投资活动现金流、筹资活动现金流、补充信息、特殊业务等",
    parameters: {
        type: "object",
        properties: {
            ts_code: {
                type: "string",
                description: "股票代码，如'000001.SZ'表示平安银行，'600000.SH'表示浦发银行"
            },
            data_type: {
                type: "string",
                description: "现金流类型：basic基础现金流概览、operating经营活动含员工薪酬具体支付、investing投资活动资产处置购建、financing筹资活动借款发债分红、supplement折旧摊销间接法调整、special债转股融资租赁、all完整现金流数据",
                enum: ["basic", "operating", "investing", "financing", "supplement", "special", "all"]
            },
            start_date: {
                type: "string",
                description: "起始日期，格式为YYYYMMDD，如'20230101'"
            },
            end_date: {
                type: "string",
                description: "结束日期，格式为YYYYMMDD，如'20231231'"
            },
            period: {
                type: "string",
                description: "特定报告期，格式为YYYYMMDD，如'20231231'表示2023年年报。指定此参数时将忽略start_date和end_date"
            }
        },
        required: ["ts_code", "data_type", "start_date", "end_date"]
    },
    async handler(args) {
        try {
            console.log('现金流查询请求:', args);
            const { ts_code, data_type, start_date, end_date, period } = args;
            if (!TUSHARE_CONFIG.API_TOKEN) {
                throw new Error('Tushare token 未配置');
            }
            // 参数映射到原始API参数
            const apiDataTypeMap = {
                'basic': 'basic_cashflow',
                'operating': 'operating_cashflow',
                'investing': 'investing_cashflow',
                'financing': 'financing_cashflow',
                'supplement': 'cashflow_supplement',
                'special': 'special_cashflow',
                'all': 'cashflow_all'
            };
            const apiDataType = apiDataTypeMap[data_type] || data_type;
            // 构建API请求参数
            const apiParams = {
                api_name: 'cashflow',
                token: TUSHARE_CONFIG.API_TOKEN,
                params: {
                    ts_code: ts_code,
                    start_date: period || start_date,
                    end_date: period || end_date
                }
            };
            console.log('API请求参数:', apiParams);
            const response = await fetch('http://api.tushare.pro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiParams)
            });
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            console.log('API响应:', result);
            if (result.code !== 0) {
                throw new Error(`API错误: ${result.msg || '未知错误'}`);
            }
            if (!result.data || !result.data.items || result.data.items.length === 0) {
                return `未找到股票代码 ${ts_code} 在指定时间范围内的现金流数据。\n请检查：\n1. 股票代码是否正确\n2. 时间范围是否合理\n3. 是否为交易日`;
            }
            // 转换数据格式
            const items = result.data.items;
            const fields = result.data.fields;
            const formattedData = items.map((item) => {
                const obj = {};
                fields.forEach((field, index) => {
                    obj[field] = item[index];
                });
                return obj;
            });
            // 按报告期排序（降序）
            formattedData.sort((a, b) => {
                return (b.end_date || '').localeCompare(a.end_date || '');
            });
            // 根据数据类型格式化输出
            let output = '';
            switch (data_type) {
                case 'basic':
                    output = formatBasicCashFlow(formattedData);
                    break;
                case 'operating':
                    output = formatOperatingCashFlow(formattedData);
                    break;
                case 'investing':
                    output = formatInvestingCashFlow(formattedData);
                    break;
                case 'financing':
                    output = formatFinancingCashFlow(formattedData);
                    break;
                case 'supplement':
                    output = formatCashflowSupplement(formattedData);
                    break;
                case 'special':
                    output = formatSpecialCashFlow(formattedData);
                    break;
                case 'all':
                    output = formatCashflowAll(formattedData);
                    break;
                default:
                    output = formatBasicCashFlow(formattedData);
            }
            return output;
        }
        catch (error) {
            console.error('现金流查询错误:', error);
            if (error instanceof Error) {
                return `现金流数据查询失败: ${error.message}`;
            }
            return '现金流数据查询失败: 未知错误';
        }
    }
};
