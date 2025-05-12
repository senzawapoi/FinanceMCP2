import { TUSHARE_CONFIG } from '../config.js';

export const stockData = {
  name: "stock_data",
  description: "获取指定股票的历史行情数据",
  parameters: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "股票代码，如'000001.SZ'表示平安银行"
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
    required: ["code"]
  },
  async run(args: { code: string; start_date?: string; end_date?: string; fields?: string }) {
    try {
      console.log(`使用Tushare API获取股票${args.code}的行情数据`);
      
      // 使用全局配置中的Tushare API设置
      const TUSHARE_API_KEY = TUSHARE_CONFIG.API_TOKEN;
      const TUSHARE_API_URL = TUSHARE_CONFIG.API_URL;
      
      // 默认参数设置
      const today = new Date();
      const defaultEndDate = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const defaultStartDate = oneMonthAgo.toISOString().slice(0, 10).replace(/-/g, '');
      
      // 构建请求参数
      const params = {
        api_name: "daily",
        token: TUSHARE_API_KEY,
        params: {
          ts_code: args.code,
          start_date: args.start_date || defaultStartDate,
          end_date: args.end_date || defaultEndDate
        },
        fields: args.fields || "ts_code,trade_date,open,high,low,close,vol,amount"
      };
      
      // 设置请求超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TUSHARE_CONFIG.TIMEOUT);
      
      try {
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
          throw new Error(`未找到股票${args.code}的行情数据`);
        }
        
        // 获取字段名
        const fields = data.data.fields;
        
        // 将数据转换为对象数组
        const stockData = data.data.items.map((item: any) => {
          const result: Record<string, any> = {};
          fields.forEach((field: string, index: number) => {
            result[field] = item[index];
          });
          return result;
        });
        
        // 格式化输出
        const formattedData = stockData.map((data: Record<string, any>) => {
          let row = '';
          for (const [key, value] of Object.entries(data)) {
            row += `**${key}**: ${value}  `;
          }
          return `## ${data.trade_date}\n${row}\n`;
        }).join('\n---\n\n');
        
        return {
          content: [
            {
              type: "text",
              text: `# ${args.code}股票行情数据\n\n${formattedData}`
            }
          ]
        };
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("获取股票数据失败:", error);
      
      return {
        content: [
          {
            type: "text",
            text: `# 获取股票${args.code}数据失败\n\n无法从Tushare API获取数据：${error instanceof Error ? error.message : String(error)}\n\n请检查股票代码是否正确，格式应为"000001.SZ"（股票代码+市场代码）`
          }
        ]
      };
    }
  }
}; 