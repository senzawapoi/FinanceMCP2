import { TUSHARE_CONFIG } from '../config.js';

export const fundData = {
  name: "fund_data",
  description: "获取公募基金全面数据，包括基金列表、基金经理、基金净值、基金分红、基金持仓等数据",
  parameters: {
    type: "object",
    properties: {
      ts_code: {
        type: "string",
        description: "基金代码，如'150018.SZ'表示银华深证100分级，'001753.OF'表示场外基金"
      },
      data_type: {
        type: "string",
        description: "数据类型，可选值：basic(基金列表)、manager(基金经理)、nav(基金净值)、dividend(基金分红)、portfolio(基金持仓)、all(全部数据)",
        enum: ["basic", "manager", "nav", "dividend", "portfolio", "all"]
      },
      start_date: {
        type: "string",
        description: "起始日期，格式为YYYYMMDD，如'20230101'。不指定则获取默认时间范围数据"
      },
      end_date: {
        type: "string",
        description: "结束日期，格式为YYYYMMDD，如'20231231'。不指定则获取到最新数据"
      },
      period: {
        type: "string",
        description: "特定报告期，格式为YYYYMMDD，如'20231231'表示2023年年报。指定此参数时将忽略start_date和end_date"
      }
    },
    required: ["data_type"]
  },
  async run(args: { 
    ts_code?: string; 
    data_type: string; 
    start_date?: string; 
    end_date?: string; 
    period?: string;
  }) {
    try {
      console.log('基金数据查询参数:', args);
      
      const TUSHARE_API_KEY = TUSHARE_CONFIG.API_TOKEN;
      const TUSHARE_API_URL = TUSHARE_CONFIG.API_URL;
      
      if (!TUSHARE_API_KEY) {
        throw new Error('请配置TUSHARE_TOKEN环境变量');
      }

      // 默认日期设置
      const today = new Date();
      const currentYear = today.getFullYear();
      const defaultEndDate = `${currentYear}1231`;
      const defaultStartDate = `${currentYear - 1}0101`;

      const results: any[] = [];

      // 根据data_type决定要查询的API
      const dataTypes = args.data_type === 'all' 
        ? ['basic', 'manager', 'nav', 'dividend', 'portfolio']
        : [args.data_type];

      for (const dataType of dataTypes) {
        try {
          const result = await fetchFundData(
            dataType,
            args.ts_code,
            args.period,
            args.start_date || defaultStartDate,
            args.end_date || defaultEndDate,
            TUSHARE_API_KEY,
            TUSHARE_API_URL
          );
          
          if (result.data && result.data.length > 0) {
            results.push({
              type: dataType,
              data: result.data,
              fields: result.fields
            });
          }
        } catch (error) {
          console.warn(`获取${dataType}数据失败:`, error);
          results.push({
            type: dataType,
            error: error instanceof Error ? error.message : '未知错误'
          });
        }
      }

      if (results.length === 0) {
        throw new Error(`未找到相关基金数据`);
      }

      // 格式化输出
      const formattedOutput = formatFundData(results, args.ts_code);
      
      return {
        content: [{ type: "text", text: formattedOutput }]
      };

    } catch (error) {
      console.error('基金数据查询错误:', error);
      return {
        content: [{ 
          type: "text", 
          text: `查询基金数据时发生错误: ${error instanceof Error ? error.message : '未知错误'}` 
        }]
      };
    }
  }
};

// 获取基金数据的通用函数
async function fetchFundData(
  dataType: string,
  tsCode?: string,
  period?: string,
  startDate?: string,
  endDate?: string,
  apiKey?: string,
  apiUrl?: string
) {
  const apiConfigs: Record<string, any> = {
    basic: {
      api_name: "fund_basic",
      default_fields: "ts_code,name,management,custodian,fund_type,found_date,due_date,list_date,issue_date,delist_date,issue_amount,m_fee,c_fee,duration_year,p_value,min_amount,exp_return,benchmark,status,invest_type,type,trustee,purc_startdate,redm_startdate,market"
    },
    manager: {
      api_name: "fund_manager",
      default_fields: "ts_code,ann_date,name,gender,birth_year,edu,nationality,begin_date,end_date,resume"
    },
    nav: {
      api_name: "fund_nav",
      default_fields: "ts_code,ann_date,nav_date,unit_nav,accum_nav,accum_div,net_asset,total_netasset,adj_nav"
    },
    dividend: {
      api_name: "fund_div",
      default_fields: "ts_code,ann_date,imp_anndate,base_date,div_proc,record_date,ex_date,pay_date,earpay_date,net_ex_date,div_cash,base_unit,ear_distr,ear_amount,account_date,base_year"
    },
    portfolio: {
      api_name: "fund_portfolio",
      default_fields: "ts_code,ann_date,end_date,symbol,mkv,amount,stk_mkv_ratio,stk_float_ratio"
    }
  };

  const config = apiConfigs[dataType];
  if (!config) {
    throw new Error(`不支持的数据类型: ${dataType}`);
  }

  // 构建请求参数
  const params: any = {
    api_name: config.api_name,
    token: apiKey,
    params: {},
    fields: config.default_fields
  };

  // 根据不同的API添加特定参数
  if (dataType === 'basic') {
    if (tsCode) params.params.ts_code = tsCode;
  } else if (dataType === 'manager') {
    if (tsCode) params.params.ts_code = tsCode;
  } else if (dataType === 'nav') {
    if (tsCode) params.params.ts_code = tsCode;
    if (period) {
      params.params.nav_date = period;
    } else {
      if (startDate) params.params.start_date = startDate;
      if (endDate) params.params.end_date = endDate;
    }
  } else if (dataType === 'dividend') {
    if (tsCode) params.params.ts_code = tsCode;
  } else if (dataType === 'portfolio') {
    if (tsCode) params.params.ts_code = tsCode;
    if (period) {
      params.params.period = period;
    } else {
      if (startDate) params.params.start_date = startDate;
      if (endDate) params.params.end_date = endDate;
    }
  }

  console.log(`调用${config.api_name} API，参数:`, JSON.stringify(params, null, 2));

  // 设置请求超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TUSHARE_CONFIG.TIMEOUT);

  try {
    const response = await fetch(apiUrl || 'https://api.tushare.pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.code !== 0) {
      throw new Error(`API返回错误: ${result.msg || '未知错误'}`);
    }

    if (!result.data || !result.data.items) {
      return { data: [], fields: result.data?.fields || [] };
    }

    // 转换数据格式
    const formattedData = result.data.items.map((item: any[]) => {
      const obj: any = {};
      result.data.fields.forEach((field: string, index: number) => {
        obj[field] = item[index];
      });
      return obj;
    });

    // 对某些数据类型进行日期范围过滤
    let filteredData = formattedData;
    if (['dividend'].includes(dataType) && startDate && endDate && !period) {
      filteredData = formattedData.filter((item: any) => {
        const annDate = item.ann_date;
        if (!annDate) return true;
        return annDate >= startDate && annDate <= endDate;
      });
      console.log(`日期范围过滤后剩余${filteredData.length}条${dataType}记录`);
    }

    console.log(`成功获取到${filteredData.length}条${dataType}数据记录`);
    return {
      data: filteredData,
      fields: result.data.fields
    };

  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// 格式化基金数据输出
function formatFundData(results: any[], tsCode?: string): string {
  let output = `# 基金数据查询结果\n\n`;
  
  if (tsCode) {
    output += `基金代码: ${tsCode}\n\n`;
  }

  for (const result of results) {
    if (result.error) {
      output += `## ${getDataTypeName(result.type)}\n❌ 查询失败: ${result.error}\n\n`;
      continue;
    }

    output += `## ${getDataTypeName(result.type)}\n`;
    output += `数据条数: ${result.data.length}\n\n`;

    if (result.data.length > 0) {
      switch (result.type) {
        case 'basic':
          output += formatBasicData(result.data);
          break;
        case 'manager':
          output += formatManagerData(result.data);
          break;
        case 'nav':
          output += formatNavData(result.data);
          break;
        case 'dividend':
          output += formatDividendData(result.data);
          break;
        case 'portfolio':
          output += formatPortfolioData(result.data);
          break;
        default:
          output += formatGenericFundData(result.data, result.fields);
      }
    }
    output += '\n';
  }

  return output;
}

function getDataTypeName(type: string): string {
  const names: Record<string, string> = {
    basic: '基金基本信息',
    manager: '基金经理',
    nav: '基金净值',
    dividend: '基金分红',
    portfolio: '基金持仓'
  };
  return names[type] || type;
}

function formatBasicData(data: any[]): string {
  let output = '';
  data.forEach((item, index) => {
    output += `### ${index + 1}. ${item.name || '未知基金'} (${item.ts_code})\n`;
    output += `- **管理人**: ${item.management || 'N/A'}\n`;
    output += `- **托管人**: ${item.custodian || 'N/A'}\n`;
    output += `- **投资类型**: ${item.fund_type || 'N/A'}\n`;
    output += `- **成立日期**: ${item.found_date || 'N/A'}\n`;
    output += `- **上市时间**: ${item.list_date || 'N/A'}\n`;
    output += `- **存续状态**: ${item.status || 'N/A'}\n`;
    output += `- **市场**: ${item.market === 'E' ? '场内' : item.market === 'O' ? '场外' : item.market || 'N/A'}\n`;
    if (item.m_fee) output += `- **管理费**: ${formatPercent(item.m_fee)}%\n`;
    if (item.c_fee) output += `- **托管费**: ${formatPercent(item.c_fee)}%\n`;
    output += '\n';
  });
  
  return output;
}



function formatManagerData(data: any[]): string {
  let output = '';
  data.forEach((item, index) => {
    output += `### ${index + 1}. ${item.name || '未知经理'} (${item.ts_code})\n`;
    output += `- **性别**: ${item.gender === 'M' ? '男' : item.gender === 'F' ? '女' : item.gender || 'N/A'}\n`;
    output += `- **出生年份**: ${item.birth_year || 'N/A'}\n`;
    output += `- **学历**: ${item.edu || 'N/A'}\n`;
    output += `- **国籍**: ${item.nationality || 'N/A'}\n`;
    output += `- **任职日期**: ${item.begin_date || 'N/A'}\n`;
    output += `- **离任日期**: ${item.end_date || '在任'}\n`;
    output += `- **公告日期**: ${item.ann_date || 'N/A'}\n`;
    if (item.resume) {
      const resumeShort = item.resume.length > 100 ? item.resume.substring(0, 100) + '...' : item.resume;
      output += `- **简历**: ${resumeShort}\n`;
    }
    output += '\n';
  });
  
  return output;
}

function formatNavData(data: any[]): string {
  let output = '';
  
  // 按日期排序，最新的在前
  const sortedData = data.sort((a, b) => {
    const dateA = a.nav_date || a.ann_date || '';
    const dateB = b.nav_date || b.ann_date || '';
    return dateB.localeCompare(dateA);
  });
  
  output += '| 净值日期 | 单位净值 | 累计净值 | 复权净值 | 资产净值 |\n';
  output += '|---------|----------|----------|----------|----------|\n';
  
  sortedData.forEach(item => {
    output += `| ${item.nav_date || 'N/A'} | ${formatNumber(item.unit_nav)} | ${formatNumber(item.accum_nav)} | ${formatNumber(item.adj_nav)} | ${formatNumber(item.net_asset)} |\n`;
  });
  
  return output;
}

function formatDividendData(data: any[]): string {
  let output = '';
  
  // 按公告日期排序，最新的在前
  const sortedData = data.sort((a, b) => {
    const dateA = a.ann_date || '';
    const dateB = b.ann_date || '';
    return dateB.localeCompare(dateA);
  });
  
  output += '| 公告日期 | 基准日期 | 分红方案 | 每股派息(元) | 除息日 | 派息日 | 权益登记日 |\n';
  output += '|---------|----------|----------|-------------|-------|-------|----------|\n';
  
  sortedData.forEach(item => {
    output += `| ${item.ann_date || 'N/A'} | ${item.base_date || 'N/A'} | ${item.div_proc || 'N/A'} | ${formatNumber(item.div_cash)} | ${item.ex_date || 'N/A'} | ${item.pay_date || 'N/A'} | ${item.record_date || 'N/A'} |\n`;
  });
  
  return output;
}

function formatPortfolioData(data: any[]): string {
  let output = '';
  
  // 按持有市值排序，从大到小
  const sortedData = data.sort((a, b) => {
    const mvkA = parseFloat(a.mkv) || 0;
    const mvkB = parseFloat(b.mkv) || 0;
    return mvkB - mvkA;
  });
  
  output += '| 股票代码 | 持有市值(万元) | 持有数量(股) | 占基金净值比(%) | 占流通股本比(%) |\n';
  output += '|---------|---------------|-------------|----------------|----------------|\n';
  
  sortedData.forEach(item => {
    const mkv = formatNumber(parseFloat(item.mkv) / 10000); // 转换为万元
    const amount = formatNumber(item.amount);
    const mkvRatio = formatPercent(item.stk_mkv_ratio);
    const floatRatio = formatPercent(item.stk_float_ratio);
    output += `| ${item.symbol || 'N/A'} | ${mkv} | ${amount} | ${mkvRatio} | ${floatRatio} |\n`;
  });
  
  return output;
}

function formatGenericFundData(data: any[], fields: string[]): string {
  let output = '';
  
  if (data.length === 0) return '暂无数据\n';
  
  // 表头
  output += '| ' + fields.slice(0, 6).join(' | ') + ' |\n';
  output += '|' + fields.slice(0, 6).map(() => '-------').join('|') + '|\n';
  
  // 数据行
  data.forEach(item => {
    const row = fields.slice(0, 6).map(field => {
      const value = item[field];
      if (value === null || value === undefined) return 'N/A';
      if (typeof value === 'string' && value.length > 15) {
        return value.substring(0, 12) + '...';
      }
      return String(value);
    });
    output += '| ' + row.join(' | ') + ' |\n';
  });
  
  return output;
}

function formatNumber(num: any): string {
  if (num === null || num === undefined || num === '') return 'N/A';
  const value = parseFloat(num);
  if (isNaN(value)) return 'N/A';
  
  if (Math.abs(value) >= 1e8) {
    return (value / 1e8).toFixed(2) + '亿';
  } else if (Math.abs(value) >= 1e4) {
    return (value / 1e4).toFixed(2) + '万';
  } else {
    return value.toFixed(2);
  }
}

function formatPercent(num: any): string {
  if (num === null || num === undefined || num === '') return 'N/A';
  const value = parseFloat(num);
  if (isNaN(value)) return 'N/A';
  return value.toFixed(2);
} 