import { TUSHARE_CONFIG } from '../config.js';
import { formatBasicBalance, formatAllBalance } from './companyPerformanceDetail/balanceFormatters.js';
export const balance = {
    name: "balance",
    description: "获取上市公司资产负债表数据：核心资产负债表、资产明细、负债明细、股东权益、银行业务、保险业务、证券业务等详细数据",
    parameters: {
        type: "object",
        properties: {
            ts_code: {
                type: "string",
                description: "股票代码，如'000001.SZ'表示平安银行，'600000.SH'表示浦发银行"
            },
            data_type: {
                type: "string",
                description: "资产负债表数据类型：basic核心资产负债表、all完整资产负债表(智能过滤空列)",
                enum: ["basic", "all"]
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
            console.log('资产负债表查询请求:', args);
            const { ts_code, data_type, start_date, end_date, period } = args;
            if (!TUSHARE_CONFIG.API_TOKEN) {
                throw new Error('Tushare token 未配置');
            }
            // 数据类型字段映射
            const fieldConfigs = {
                'basic': 'ts_code,ann_date,f_ann_date,end_date,report_type,comp_type,total_assets,total_cur_assets,total_nca,total_liab,total_cur_liab,total_ncl,total_hldr_eqy_exc_min_int,total_hldr_eqy_inc_min_int,total_liab_hldr_eqy',
                'all': '' // 空字符串表示获取所有字段
            };
            const fields = fieldConfigs[data_type];
            if (fields === undefined) {
                throw new Error(`不支持的数据类型: ${data_type}`);
            }
            // 构建API请求参数
            const apiParams = {
                api_name: 'balancesheet',
                token: TUSHARE_CONFIG.API_TOKEN,
                params: {
                    ts_code: ts_code
                }
            };
            // 添加字段参数（如果不是all类型）
            if (fields) {
                apiParams.fields = fields;
            }
            // 添加时间参数
            if (period) {
                apiParams.params.period = period;
            }
            else {
                apiParams.params.start_date = start_date;
                apiParams.params.end_date = end_date;
            }
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
                return `未找到股票代码 ${ts_code} 在指定时间范围内的资产负债表数据。\n请检查：\n1. 股票代码是否正确\n2. 时间范围是否合理\n3. 是否为交易日`;
            }
            // 转换数据格式
            const items = result.data.items;
            const fieldsArray = result.data.fields;
            const formattedData = items.map((item) => {
                const obj = {};
                fieldsArray.forEach((field, index) => {
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
                    output = formatBasicBalance(formattedData);
                    break;
                case 'all':
                    output = formatAllBalance(formattedData);
                    break;
                default:
                    output = formatBasicBalance(formattedData);
            }
            return output;
        }
        catch (error) {
            console.error('资产负债表查询错误:', error);
            if (error instanceof Error) {
                return `资产负债表数据查询失败: ${error.message}`;
            }
            return '资产负债表数据查询失败: 未知错误';
        }
    }
};
