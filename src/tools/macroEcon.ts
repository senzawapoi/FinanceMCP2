import { TUSHARE_CONFIG } from '../config.js';

export const macroEcon = {
  name: "macro_econ",
  description: "获取宏观经济数据，包括Shibor利率、LPR利率、GDP、CPI、PPI等",
  parameters: {
    type: "object",
    properties: {
      indicator: {
        type: "string",
        description: "指标类型，可选值：shibor(上海银行间同业拆放利率),lpr(贷款基础利率),gdp(国内生产总值),cpi(居民消费价格指数),ppi(工业品出厂价格指数)"
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
  async run(args: { indicator: string; start_date?: string; end_date?: string }) {
    try {
      console.log(`使用Tushare API获取${args.indicator}宏观经济数据`);
      
      // 使用全局配置中的Tushare API设置
      const TUSHARE_API_KEY = TUSHARE_CONFIG.API_TOKEN;
      const TUSHARE_API_URL = TUSHARE_CONFIG.API_URL;
      
      // 默认参数设置
      const today = new Date();
      const defaultEndDate = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const defaultStartDate = oneYearAgo.toISOString().slice(0, 10).replace(/-/g, '');

      // 验证指标类型
      const validIndicators = ['shibor', 'lpr', 'gdp', 'cpi', 'ppi'];
      if (!validIndicators.includes(args.indicator)) {
        throw new Error(`不支持的指标类型: ${args.indicator}。支持的类型有: ${validIndicators.join(', ')}`);
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
            m: "",  // 可选单月
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
            m: "",  // 可选单月
            start_m: startMonthPPI,
            end_m: endMonthPPI
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
        const econData = data.data.items.map((item: any) => {
          const result: Record<string, any> = {};
          fields.forEach((field: string, index: number) => {
            result[field] = item[index];
          });
          return result;
        });
        
        // 生成指标表头
        let titleMap: Record<string, string> = {
          'shibor': 'Shibor利率',
          'lpr': 'LPR贷款基础利率',
          'gdp': '国内生产总值(GDP)',
          'cpi': '居民消费价格指数(CPI)',
          'ppi': '工业品出厂价格指数(PPI)'
        };
        
        // 格式化数据（根据不同指标类型构建不同的格式）
        let formattedData = '';
        
        if (args.indicator === 'shibor' || args.indicator === 'lpr') {
          // 日期型数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            let row = '';
            for (const [key, value] of Object.entries(data)) {
              if (key !== 'date') {
                row += `**${key}**: ${value}%  `;
              }
            }
            return `## ${data.date}\n${row}\n`;
          }).join('\n---\n\n');
        } else if (args.indicator === 'gdp') {
          // 季度型数据展示
          formattedData = econData.map((data: Record<string, any>) => {
            return `## ${data.quarter}\n**GDP总值**: ${data.gdp}亿元  **同比增长**: ${data.gdp_yoy}%\n**第一产业**: ${data.pi}亿元  **同比**: ${data.pi_yoy}%\n**第二产业**: ${data.si}亿元  **同比**: ${data.si_yoy}%\n**第三产业**: ${data.ti}亿元  **同比**: ${data.ti_yoy}%\n`;
          }).join('\n---\n\n');
        } else {
          // 月度型数据展示 (CPI, PPI)
          formattedData = econData.map((data: Record<string, any>) => {
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
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
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