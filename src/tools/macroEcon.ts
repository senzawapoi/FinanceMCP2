import { TUSHARE_CONFIG } from '../config.js';

export const macroEcon = {
  name: "macro_econ",
  description: "Get macroeconomic data including Shibor rates, LPR rates, GDP, CPI, PPI, money supply, PMI, social financing, Shibor quotes, Libor, Hibor, etc.",
  parameters: {
    type: "object",
    properties: {
      indicator: {
        type: "string",
        description: "Indicator type, options: shibor(Shanghai Interbank Offered Rate), lpr(Loan Prime Rate), gdp(Gross Domestic Product), cpi(Consumer Price Index), ppi(Producer Price Index), cn_m(Money Supply), cn_pmi(Purchasing Managers Index), cn_sf(Total Social Financing), shibor_quote(Shibor Bank Quotes), libor(Libor Rate), hibor(Hibor Rate)"
      },
      start_date: {
        type: "string",
        description: "Start date in YYYYMMDD format, e.g., '20230101'"
      },
      end_date: {
        type: "string",
        description: "End date in YYYYMMDD format, e.g., '20230131'"
      }
    },
    required: ["indicator"]
  },
  async run(args: { indicator: string; start_date?: string; end_date?: string }) {
    try {
      console.log(`Using Tushare API to get ${args.indicator} macroeconomic data`);
      
      // 使用全局配置中的Tushare API设置
      const TUSHARE_API_KEY = TUSHARE_CONFIG.API_TOKEN;
      const TUSHARE_API_URL = TUSHARE_CONFIG.API_URL;
      
      // 验证指标类型
      const validIndicators = ['shibor', 'lpr', 'gdp', 'cpi', 'ppi', 'cn_m', 'cn_pmi', 'cn_sf', 'shibor_quote', 'libor', 'hibor'];
      if (!validIndicators.includes(args.indicator)) {
        throw new Error(`Unsupported indicator type: ${args.indicator}. Supported types: ${validIndicators.join(', ')}`);
      }

      // 根据指标类型设置不同的默认时间范围
      const today = new Date();
      const defaultEndDate = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      let defaultStartDate = '';
      
      // 日期格式数据：默认30天
      const dailyIndicators = ['shibor', 'lpr', 'shibor_quote', 'libor', 'hibor'];
      // 月份格式数据：默认12个月
      const monthlyIndicators = ['cpi', 'ppi', 'cn_m', 'cn_pmi', 'cn_sf'];
      // 季度格式数据：默认8个季度
      const quarterlyIndicators = ['gdp'];
      
      if (dailyIndicators.includes(args.indicator)) {
        // 30天前
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        defaultStartDate = thirtyDaysAgo.toISOString().slice(0, 10).replace(/-/g, '');
      } else if (monthlyIndicators.includes(args.indicator)) {
        // 12个月前
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        defaultStartDate = twelveMonthsAgo.toISOString().slice(0, 10).replace(/-/g, '');
      } else if (quarterlyIndicators.includes(args.indicator)) {
        // 8个季度前（约24个月）
        const eightQuartersAgo = new Date();
        eightQuartersAgo.setMonth(eightQuartersAgo.getMonth() - 24);
        defaultStartDate = eightQuartersAgo.toISOString().slice(0, 10).replace(/-/g, '');
      } else {
        // 其他情况默认3个月
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        defaultStartDate = threeMonthsAgo.toISOString().slice(0, 10).replace(/-/g, '');
      }
      
      // 构建请求参数
      const params: any = {
        token: TUSHARE_API_KEY,
        params: {}, // 这里留空，后面根据不同的API添加特定参数
        fields: ""
      };

      // 根据不同指标类型设置不同的API名称、参数和字段
      switch(args.indicator) {
        case 'shibor':
          params.api_name = "shibor";
          params.fields = "date,on,1w,2w,1m,3m,6m,9m,1y";
          // shibor接口使用date作为日期参数
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
          params.fields = "month,nt_val,nt_yoy,nt_mom,nt_accu,town_val,town_yoy,town_mom,town_accu,cnt_val,cnt_yoy,cnt_mom,cnt_accu";
          // CPI数据使用月份格式
          const startMonth = dateToMonth(args.start_date || defaultStartDate);
          const endMonth = dateToMonth(args.end_date || defaultEndDate);
          params.params = {
            start_m: startMonth,
            end_m: endMonth
          };
          break;
          
        case 'ppi':
          params.api_name = "cn_ppi";
          params.fields = "month,ppi_val,ppi_yoy,ppi_mom,ppi_accu,rpi_val,rpi_yoy,rpi_mom,rpi_accu";
          // PPI数据使用月份格式
          const startMonthPPI = dateToMonth(args.start_date || defaultStartDate);
          const endMonthPPI = dateToMonth(args.end_date || defaultEndDate);
          params.params = {
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
            start_m: startMonthM,
            end_m: endMonthM
          };
          break;
          
        case 'cn_pmi':
          params.api_name = "cn_pmi";
          // 根据Tushare文档使用正确的PMI字段
          params.fields = "month,pmi010000,pmi010100,pmi010200,pmi010300,pmi010400,pmi010500,pmi010600,pmi010700,pmi010800,pmi010900,pmi011000,pmi011100,pmi011200,pmi011300,pmi011400,pmi011500,pmi011600,pmi011700,pmi011800,pmi011900,pmi012000,pmi020100,pmi020101,pmi020102,pmi020200,pmi020300,pmi020400,pmi020500,pmi020600,pmi030000";
          // PMI数据使用月份格式
          const startMonthPMI = dateToMonth(args.start_date || defaultStartDate);
          const endMonthPMI = dateToMonth(args.end_date || defaultEndDate);
          params.params = {
            start_m: startMonthPMI,
            end_m: endMonthPMI
          };
          break;
          
        case 'cn_sf':
          params.api_name = "cn_sf";  // 修正API名称
          params.fields = "month,inc_month,inc_cumval,stk_endval";
          // 社融增量数据使用月份格式
          const startMonthSF = dateToMonth(args.start_date || defaultStartDate);
          const endMonthSF = dateToMonth(args.end_date || defaultEndDate);
          params.params = {
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
          
        case 'libor':
          params.api_name = "libor";
          params.fields = "date,curr,on,1w,1m,2m,3m,6m,12m";
          // Libor利率数据使用日期格式
          params.params = {
            start_date: args.start_date || defaultStartDate,
            end_date: args.end_date || defaultEndDate,
            curr: "USD"  // 默认美元
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
        console.log(`Requesting Tushare API: ${params.api_name}, parameters:`, params.params);
        
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
          throw new Error(`Tushare API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 处理响应数据
        if (data.code !== 0) {
          throw new Error(`Tushare API error: ${data.msg}`);
        }
        
        // 确保data.data和data.data.items存在
        if (!data.data || !data.data.items || data.data.items.length === 0) {
          throw new Error(`No ${args.indicator} macroeconomic data found`);
        }
        
        // 获取字段名
        const fields = data.data.fields;
        
        // 将数据转换为对象数组
        const econData = data.data.items.map((item: any) => {
          const result: Record<string, any> = {};
          fields.forEach((field: string, index: number) => {
            result[field] = item[index];
          });
          return result;
        });
        
        // 生成指标表头
        let titleMap: Record<string, string> = {
          'shibor': 'Shibor Interest Rate',
          'lpr': 'LPR Loan Prime Rate',
          'gdp': 'Gross Domestic Product (GDP)',
          'cpi': 'Consumer Price Index (CPI)',
          'ppi': 'Producer Price Index (PPI)',
          'cn_m': 'Money Supply',
          'cn_pmi': 'Purchasing Managers Index (PMI)',
          'cn_sf': 'Total Social Financing',
          'shibor_quote': 'Shibor Bank Quote Data',
          'libor': 'Libor Interest Rate',
          'hibor': 'Hibor Interest Rate'
        };
        
        // 格式化数据（根据不同指标类型构建不同的格式）
        let formattedData = '';
        
        if (args.indicator === 'shibor' || args.indicator === 'lpr') {
          // 日期型数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            let row = '';
            for (const [key, value] of Object.entries(data)) {
              if (key !== 'date') {
                const displayName = getRateDisplayName(key);
                row += `**${displayName}**: ${value}%  `;
              }
            }
            return `## ${formatDate(data.date)}\n${row}\n`;
          }).join('\n---\n\n');
        } else if (args.indicator === 'shibor_quote') {
          // Shibor报价数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            return `## ${formatDate(data.date)} - ${data.bank}\n**隔夜**: 买价${data.on_b}% 卖价${data.on_a}%  **1周**: 买价${data['1w_b']}% 卖价${data['1w_a']}%\n**1月**: 买价${data['1m_b']}% 卖价${data['1m_a']}%  **3月**: 买价${data['3m_b']}% 卖价${data['3m_a']}%\n**6月**: 买价${data['6m_b']}% 卖价${data['6m_a']}%  **1年**: 买价${data['1y_b']}% 卖价${data['1y_a']}%\n`;
          }).join('\n---\n\n');
        } else if (args.indicator === 'libor' || args.indicator === 'hibor') {
          // 其他利率数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            let row = '';
            for (const [key, value] of Object.entries(data)) {
              if (key !== 'date' && key !== 'curr') {
                const displayName = getRateDisplayName(key);
                row += `**${displayName}**: ${value}%  `;
              }
            }
            const currencyInfo = data.curr ? ` (${data.curr})` : '';
            return `## ${formatDate(data.date)}${currencyInfo}\n${row}\n`;
          }).join('\n---\n\n');
        } else if (args.indicator === 'gdp') {
          // 季度型数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            return `## ${data.quarter}\n**GDP总值**: ${data.gdp}亿元  **同比增长**: ${data.gdp_yoy}%\n**第一产业**: ${data.pi}亿元  **同比**: ${data.pi_yoy}%\n**第二产业**: ${data.si}亿元  **同比**: ${data.si_yoy}%\n**第三产业**: ${data.ti}亿元  **同比**: ${data.ti_yoy}%\n`;
          }).join('\n---\n\n');
        } else if (args.indicator === 'cpi') {
          // CPI数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            return `## ${formatMonth(data.month)}\n**全国CPI**: ${data.nt_val}  **同比**: ${data.nt_yoy}%  **环比**: ${data.nt_mom}%  **累计**: ${data.nt_accu}%\n**城市CPI**: ${data.town_val}  **同比**: ${data.town_yoy}%  **环比**: ${data.town_mom}%  **累计**: ${data.town_accu}%\n**农村CPI**: ${data.cnt_val}  **同比**: ${data.cnt_yoy}%  **环比**: ${data.cnt_mom}%  **累计**: ${data.cnt_accu}%\n`;
          }).join('\n---\n\n');
        } else if (args.indicator === 'ppi') {
          // PPI数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            return `## ${formatMonth(data.month)}\n**PPI当月值**: ${data.ppi_val}  **同比**: ${data.ppi_yoy}%  **环比**: ${data.ppi_mom}%  **累计**: ${data.ppi_accu}%\n**原料购进价格当月值**: ${data.rpi_val}  **同比**: ${data.rpi_yoy}%  **环比**: ${data.rpi_mom}%  **累计**: ${data.rpi_accu}%\n`;
          }).join('\n---\n\n');
        } else if (args.indicator === 'cn_m') {
          // 货币供应量数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            return `## ${formatMonth(data.month)}\n**M0**: ${data.m0}亿元  **同比**: ${data.m0_yoy}%  **环比**: ${data.m0_mom}%\n**M1**: ${data.m1}亿元  **同比**: ${data.m1_yoy}%  **环比**: ${data.m1_mom}%\n**M2**: ${data.m2}亿元  **同比**: ${data.m2_yoy}%  **环比**: ${data.m2_mom}%\n`;
          }).join('\n---\n\n');
        } else if (args.indicator === 'cn_pmi') {
          // PMI数据展示 - 使用正确的字段名
          formattedData = econData.map((data: Record<string, any>) => {
            return `## ${formatMonth(data.month)}\n### 制造业PMI\n**制造业PMI**: ${data.pmi010000}  **生产指数**: ${data.pmi010100}  **新订单指数**: ${data.pmi010200}\n**新出口订单**: ${data.pmi010300}  **在手订单**: ${data.pmi010400}  **产成品库存**: ${data.pmi010500}\n**采购量指数**: ${data.pmi010600}  **进口指数**: ${data.pmi010700}  **购进价格指数**: ${data.pmi010800}\n**原材料库存**: ${data.pmi010900}  **从业人员指数**: ${data.pmi011000}  **供应商配送时间**: ${data.pmi011100}\n**生产经营活动预期**: ${data.pmi011200}\n\n### 非制造业PMI\n**商务活动指数**: ${data.pmi020100}  **建筑业**: ${data.pmi020101}  **服务业**: ${data.pmi020102}\n**新订单指数**: ${data.pmi020200}  **投入品价格**: ${data.pmi020300}  **销售价格**: ${data.pmi020400}\n**从业人员**: ${data.pmi020500}  **业务活动预期**: ${data.pmi020600}\n\n**综合PMI产出指数**: ${data.pmi030000}\n`;
          }).join('\n---\n\n');
        } else if (args.indicator === 'cn_sf') {
          // 社融增量数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            return `## ${formatMonth(data.month)}\n**当月增量**: ${data.inc_month}亿元  **累计增量**: ${data.inc_cumval}亿元\n**存量期末值**: ${data.stk_endval}万亿元\n`;
          }).join('\n---\n\n');
        }
        
        return {
          content: [
            {
              type: "text",
              text: `# ${titleMap[args.indicator]} data\n\n**Query time range**: ${args.start_date || defaultStartDate} - ${args.end_date || defaultEndDate}\n**Data count**: ${econData.length} records\n\n---\n\n${formattedData}`
            }
          ]
        };
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("Failed to get macroeconomic data:", error);
      
      return {
        content: [
          {
            type: "text",
            text: `# Failed to get ${args.indicator} macroeconomic data\n\n**Error information**: ${error instanceof Error ? error.message : String(error)}\n\n**Supported indicator types**: \n- shibor: Shanghai Interbank Offered Rate\n- lpr: Loan Prime Rate\n- gdp: Gross Domestic Product\n- cpi: Consumer Price Index\n- ppi: Producer Price Index\n- cn_m: Money Supply\n- cn_pmi: Purchasing Managers Index\n- cn_sf: Total Social Financing\n- shibor_quote: Shibor Bank Quotes\n- libor: Libor Rate\n- hibor: Hibor Rate`
          }
        ]
      };
    }
  }
};

/**
 * 获取利率字段的显示名称
 */
function getRateDisplayName(key: string): string {
  const nameMap: Record<string, string> = {
    'on': '隔夜',
    '1w': '1周',
    '2w': '2周',
    '1m': '1月',
    '2m': '2月',
    '3m': '3月',
    '4m': '4月',
    '5m': '5月',
    '6m': '6月',
    '9m': '9月',
    '1y': '1年',
    '5y': '5年',
    '12m': '12月'
  };
  return nameMap[key] || key;
}

/**
 * 格式化日期显示
 */
function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}年${month}月${day}日`;
}

/**
 * 格式化月份显示
 */
function formatMonth(monthStr: string): string {
  if (!monthStr || monthStr.length !== 6) return monthStr;
  const year = monthStr.substring(0, 4);
  const month = monthStr.substring(4, 6);
  return `${year}年${month}月`;
}

/**
 * 将日期格式(YYYYMMDD)转换为季度格式(YYYYQN)
 */
function dateToQuarter(dateStr: string): string {
  if (!dateStr || dateStr.length < 8) return "";
  
  const year = dateStr.substring(0, 4);
  const month = parseInt(dateStr.substring(4, 6));
  
  // 确定季度
  let quarter;
  if (month >= 1 && month <= 3) quarter = 1;
  else if (month >= 4 && month <= 6) quarter = 2;
  else if (month >= 7 && month <= 9) quarter = 3;
  else quarter = 4;
  
  return `${year}Q${quarter}`;
}

/**
 * 将日期格式(YYYYMMDD)转换为月份格式(YYYYMM)
 */
function dateToMonth(dateStr: string): string {
  if (!dateStr || dateStr.length < 8) return "";
  return dateStr.substring(0, 6);
} 