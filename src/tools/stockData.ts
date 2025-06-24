import { TUSHARE_CONFIG } from '../config.js';

export const stockData = {
  name: "stock_data",
  description: "获取指定股票的历史行情数据，支持A股、美股、港股、外汇、期货、基金、债券逆回购、可转债、期权",
  parameters: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "股票代码，如'000001.SZ'表示平安银行(A股)，'AAPL'表示苹果(美股)，'00700.HK'表示腾讯(港股)，'USDCNY'表示美元人民币(外汇)，'CU2501.SHF'表示铜期货，'159919.SZ'表示沪深300ETF(基金)，'204001.SH'表示GC001国债逆回购，'113008.SH'表示可转债，'10001313.SH'表示期权合约"
      },
      market_type: {
        type: "string",
        description: "市场类型（必需），可选值：cn(A股),us(美股),hk(港股),fx(外汇),futures(期货),fund(基金),repo(债券逆回购),convertible_bond(可转债),options(期权)"
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
  async run(args: { code: string; market_type: string; start_date?: string; end_date?: string; fields?: string }) {
    try {
      // 添加调试日志
      console.log('接收到的参数:', args);
      
      // 检查market_type参数
      if (!args.market_type) {
        throw new Error('请指定market_type参数：cn(A股)、us(美股)、hk(港股)、fx(外汇)、futures(期货)、fund(基金)、repo(债券逆回购)、convertible_bond(可转债)、options(期权)');
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
      const validMarkets = ['cn', 'us', 'hk', 'fx', 'futures', 'fund', 'repo', 'convertible_bond', 'options'];
      if (!validMarkets.includes(marketType)) {
        throw new Error(`不支持的市场类型: ${marketType}。支持的类型有: ${validMarkets.join(', ')}`);
      }
      
      // 构建请求参数
      const params: any = {
        token: TUSHARE_API_KEY,
        params: {
          ts_code: args.code,
          start_date: args.start_date || defaultStartDate,
          end_date: args.end_date || defaultEndDate
        },
        fields: ""
      };

      // 根据不同市场类型设置不同的API名称、参数和字段
      switch(marketType) {
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
          
        case 'futures':
          params.api_name = "fut_daily";
          params.fields = args.fields || "ts_code,trade_date,open,high,low,close,settle,change1,change2,vol,amount,oi";
          break;
          
        case 'fund':
          params.api_name = "fund_daily";
          params.fields = args.fields || "ts_code,trade_date,open,high,low,close,pre_close,change,pct_chg,vol,amount";
          break;
          
        case 'repo':
          params.api_name = "repo_daily";
          params.fields = args.fields || "ts_code,trade_date,name,rate,amount";
          break;
          
        case 'convertible_bond':
          params.api_name = "cb_daily";
          params.fields = args.fields || "ts_code,trade_date,pre_close,open,high,low,close,change,pct_chg,vol,amount,bond_value,bond_over_rate,cb_value,cb_over_rate";
          break;
          
        case 'options':
          params.api_name = "opt_daily";
          params.fields = args.fields || "ts_code,trade_date,exchange,pre_settle,pre_close,open,high,low,close,settle,vol,amount,oi";
          // 期权接口优先使用trade_date，如果没有指定则使用end_date作为trade_date
          if (!args.start_date && !args.end_date) {
            // 如果都没指定，使用默认的end_date作为trade_date
            params.params = {
              trade_date: defaultEndDate
            };
          } else if (args.end_date && !args.start_date) {
            // 只指定了end_date，使用作为trade_date
            params.params = {
              trade_date: args.end_date
            };
          } else {
            // 如果指定了start_date或日期范围，保持原有逻辑但添加ts_code
            params.params = {
              ts_code: args.code,
              start_date: args.start_date || defaultStartDate,
              end_date: args.end_date || defaultEndDate
            };
          }
          // 如果指定了具体的期权代码，添加到params中
          if (args.code && args.code.length > 0) {
            params.params.ts_code = args.code;
          }
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
        const stockData = data.data.items.map((item: any) => {
          const result: Record<string, any> = {};
          fields.forEach((field: string, index: number) => {
            result[field] = item[index];
          });
          return result;
        });
        
        console.log(`成功获取到${stockData.length}条${args.code}股票数据记录`);
        
        // 生成市场类型标题
        const marketTitleMap: Record<string, string> = {
          'cn': 'A股',
          'us': '美股',
          'hk': '港股',
          'fx': '外汇',
          'futures': '期货',
          'fund': '基金',
          'repo': '债券逆回购',
          'convertible_bond': '可转债',
          'options': '期权'
        };
        
        // 格式化输出（根据不同市场类型构建不同的格式）
        let formattedData = '';
        
        if (marketType === 'fx') {
          // 外汇数据展示
          formattedData = stockData.map((data: Record<string, any>) => {
            return ` ${data.trade_date}\n开盘: ${data.open}  最高: ${data.high}  最低: ${data.low}  收盘: ${data.close}\n`;
          }).join('\n---\n\n');
        } else if (marketType === 'futures') {
          // 期货数据展示
          formattedData = stockData.map((data: Record<string, any>) => {
            return ` ${data.trade_date}\n开盘: ${data.open}  最高: ${data.high}  最低: ${data.low}  收盘: ${data.close}  结算: ${data.settle}\n涨跌1: ${data.change1}  涨跌2: ${data.change2}  成交量: ${data.vol}  持仓量: ${data.oi}\n`;
          }).join('\n---\n\n');
        } else if (marketType === 'repo') {
          // 债券逆回购数据展示
          formattedData = stockData.map((data: Record<string, any>) => {
            return ` ${data.trade_date}\n品种: ${data.name}  利率: ${data.rate}%  成交金额: ${data.amount}万元\n`;
          }).join('\n---\n\n');
        } else if (marketType === 'convertible_bond') {
          // 可转债数据展示
          formattedData = stockData.map((data: Record<string, any>) => {
            let row = ` ${data.trade_date}\n开盘: ${data.open}  最高: ${data.high}  最低: ${data.low}  收盘: ${data.close}\n涨跌: ${data.change}  涨跌幅: ${data.pct_chg}%  成交量: ${data.vol}手  成交金额: ${data.amount}万元\n`;
            if (data.bond_value) {
              row += `纯债价值: ${data.bond_value}  纯债溢价率: ${data.bond_over_rate}%\n`;
            }
            if (data.cb_value) {
              row += `转股价值: ${data.cb_value}  转股溢价率: ${data.cb_over_rate}%\n`;
            }
            return row;
          }).join('\n---\n\n');
        } else if (marketType === 'options') {
          // 期权数据展示
          formattedData = stockData.map((data: Record<string, any>) => {
            return ` ${data.trade_date}\n交易所: ${data.exchange}  昨结算: ${data.pre_settle}  前收盘: ${data.pre_close}\n开盘: ${data.open}  最高: ${data.high}  最低: ${data.low}  收盘: ${data.close}  结算: ${data.settle}\n成交量: ${data.vol}手  成交金额: ${data.amount}万元  持仓量: ${data.oi}手\n`;
          }).join('\n---\n\n');
        } else {
          // 股票数据展示
          formattedData = stockData.map((data: Record<string, any>) => {
            let row = '';
            for (const [key, value] of Object.entries(data)) {
              if (key !== 'ts_code' && key !== 'trade_date') {
                row += `${key}: ${value}  `;
              }
            }
            return ` ${data.trade_date}\n${row}\n`;
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
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("获取股票数据失败:", error);
      
      return {
        content: [
          {
            type: "text",
            text: `# 获取股票${args.code}数据失败\n\n无法从Tushare API获取数据：${error instanceof Error ? error.message : String(error)}\n\n请检查股票代码和市场类型是否正确：\n- A股格式："000001.SZ"\n- 美股格式："AAPL"\n- 港股格式："00700.HK"\n- 外汇格式："USDCNY"\n- 期货格式："CU2501.SHF"\n- 基金格式："159919.SZ"\n- 债券逆回购格式："204001.SH"\n- 可转债格式："113008.SH"\n- 期权格式："10001313.SH"`
          }
        ]
      };
    }
  }
}; 