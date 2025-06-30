import { TUSHARE_CONFIG } from '../config.js';

export const stockData = {
  name: "stock_data",
  description: "获取指定股票的历史行情数据，支持A股、美股、港股、外汇、期货、基金、债券逆回购、可转债、期权",
  parameters: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "股票代码，如'000001.SZ'表示平安银行(A股)，'AAPL'表示苹果(美股)，'00700.HK'表示腾讯(港股)，'USDCNH.FXCM'表示美元人民币(外汇)，'CU2501.SHF'表示铜期货，'159919.SZ'表示沪深300ETF(基金)，'204001.SH'表示GC001国债逆回购，'113008.SH'表示可转债，'10001313.SH'表示期权合约"
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

    },
    required: ["code", "market_type"]
  },
  async run(args: { code: string; market_type: string; start_date?: string; end_date?: string }) {
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
        }
        // 不设置fields参数，默认返回所有字段
      };

      // 根据不同市场类型设置不同的API名称和参数，默认返回所有字段
      switch(marketType) {
        case 'cn':
          params.api_name = "daily";
          // 不设置fields，返回所有可用字段
          break;
          
        case 'us':
          params.api_name = "us_daily";
          // 不设置fields，返回所有可用字段
          break;
          
        case 'hk':
          params.api_name = "hk_daily";
          // 不设置fields，返回所有可用字段
          break;
          
        case 'fx':
          params.api_name = "fx_daily";
          // 不设置fields，返回所有可用字段
          break;
          
        case 'futures':
          params.api_name = "fut_daily";
          // 不设置fields，返回所有可用字段
          break;
          
        case 'fund':
          params.api_name = "fund_daily";
          // 不设置fields，返回所有可用字段
          break;
          
        case 'repo':
          params.api_name = "repo_daily";
          // 不设置fields，返回所有可用字段
          break;
          
        case 'convertible_bond':
          params.api_name = "cb_daily";
          // 不设置fields，返回所有可用字段
          break;
          
        case 'options':
          params.api_name = "opt_daily";
          // 不设置fields，返回所有可用字段
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
      console.log(`字段设置: 返回所有可用字段`);
      
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
        
        // 格式化输出（根据不同市场类型构建表格格式）
        let formattedData = '';
        
        if (marketType === 'fx') {
          // 外汇数据表格展示
          formattedData = `| 交易日期 | 买入开盘 | 买入最高 | 买入最低 | 买入收盘 | 卖出开盘 | 卖出最高 | 卖出最低 | 卖出收盘 | 报价笔数 |\n`;
          formattedData += `|---------|---------|---------|---------|---------|---------|---------|---------|---------|----------|\n`;
          stockData.forEach((data: Record<string, any>) => {
            formattedData += `| ${data.trade_date} | ${data.bid_open || 'N/A'} | ${data.bid_high || 'N/A'} | ${data.bid_low || 'N/A'} | ${data.bid_close || 'N/A'} | ${data.ask_open || 'N/A'} | ${data.ask_high || 'N/A'} | ${data.ask_low || 'N/A'} | ${data.ask_close || 'N/A'} | ${data.tick_qty || 'N/A'} |\n`;
          });
        } else if (marketType === 'futures') {
          // 期货数据表格展示
          formattedData = `| 交易日期 | 开盘 | 最高 | 最低 | 收盘 | 结算 | 涨跌1 | 涨跌2 | 成交量 | 持仓量 |\n`;
          formattedData += `|---------|------|------|------|------|------|-------|-------|--------|--------|\n`;
          stockData.forEach((data: Record<string, any>) => {
            formattedData += `| ${data.trade_date} | ${data.open || 'N/A'} | ${data.high || 'N/A'} | ${data.low || 'N/A'} | ${data.close || 'N/A'} | ${data.settle || 'N/A'} | ${data.change1 || 'N/A'} | ${data.change2 || 'N/A'} | ${data.vol || 'N/A'} | ${data.oi || 'N/A'} |\n`;
          });
        } else if (marketType === 'repo') {
          // 债券逆回购数据表格展示
          formattedData = `| 交易日期 | 品种名称 | 利率(%) | 成交金额(万元) |\n`;
          formattedData += `|---------|---------|---------|---------------|\n`;
          stockData.forEach((data: Record<string, any>) => {
            formattedData += `| ${data.trade_date} | ${data.name || 'N/A'} | ${data.rate || 'N/A'} | ${data.amount || 'N/A'} |\n`;
          });
        } else if (marketType === 'convertible_bond') {
          // 可转债数据表格展示
          formattedData = `| 交易日期 | 开盘 | 最高 | 最低 | 收盘 | 涨跌 | 涨跌幅(%) | 成交量(手) | 成交金额(万元) | 纯债价值 | 纯债溢价率(%) | 转股价值 | 转股溢价率(%) |\n`;
          formattedData += `|---------|------|------|------|------|------|-----------|------------|---------------|----------|---------------|----------|---------------|\n`;
          stockData.forEach((data: Record<string, any>) => {
            formattedData += `| ${data.trade_date} | ${data.open || 'N/A'} | ${data.high || 'N/A'} | ${data.low || 'N/A'} | ${data.close || 'N/A'} | ${data.change || 'N/A'} | ${data.pct_chg || 'N/A'} | ${data.vol || 'N/A'} | ${data.amount || 'N/A'} | ${data.bond_value || 'N/A'} | ${data.bond_over_rate || 'N/A'} | ${data.cb_value || 'N/A'} | ${data.cb_over_rate || 'N/A'} |\n`;
          });
        } else if (marketType === 'options') {
          // 期权数据表格展示
          formattedData = `| 交易日期 | 交易所 | 昨结算 | 前收盘 | 开盘 | 最高 | 最低 | 收盘 | 结算 | 成交量(手) | 成交金额(万元) | 持仓量(手) |\n`;
          formattedData += `|---------|--------|--------|--------|------|------|------|------|------|------------|---------------|------------|\n`;
          stockData.forEach((data: Record<string, any>) => {
            formattedData += `| ${data.trade_date} | ${data.exchange || 'N/A'} | ${data.pre_settle || 'N/A'} | ${data.pre_close || 'N/A'} | ${data.open || 'N/A'} | ${data.high || 'N/A'} | ${data.low || 'N/A'} | ${data.close || 'N/A'} | ${data.settle || 'N/A'} | ${data.vol || 'N/A'} | ${data.amount || 'N/A'} | ${data.oi || 'N/A'} |\n`;
          });
        } else {
          // 股票数据表格展示（A股、美股、港股、基金等）- 只显示基础核心字段
          if (stockData.length > 0) {
            // 只显示最基础的7个核心字段
            const coreFields = ['trade_date', 'open', 'close', 'high', 'low', 'vol', 'amount'];
            const availableFields = Object.keys(stockData[0]);
            const displayFields = coreFields.filter(field => availableFields.includes(field));
            
            // 生成表头
            const fieldNameMap: Record<string, string> = {
              'trade_date': '交易日期',
              'open': '开盘',
              'close': '收盘',
              'high': '最高', 
              'low': '最低',
              'vol': '成交量',
              'amount': '成交额'
            };
            
            const headers = displayFields.map(field => fieldNameMap[field] || field).join(' | ');
            formattedData = `| ${headers} |\n`;
            formattedData += `|${displayFields.map(() => '--------').join('|')}|\n`;
            
            // 生成数据行
            stockData.forEach((data: Record<string, any>) => {
              const row = displayFields.map(field => data[field] || 'N/A').join(' | ');
              formattedData += `| ${row} |\n`;
            });
          }
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
            text: `# 获取股票${args.code}数据失败\n\n无法从Tushare API获取数据：${error instanceof Error ? error.message : String(error)}\n\n请检查股票代码和市场类型是否正确：\n- A股格式："000001.SZ"\n- 美股格式："AAPL"\n- 港股格式："00700.HK"\n- 外汇格式："USDCNH.FXCM"（美元人民币）\n- 期货格式："CU2501.SHF"\n- 基金格式："159919.SZ"\n- 债券逆回购格式："204001.SH"\n- 可转债格式："113008.SH"\n- 期权格式："10001313.SH"`
          }
        ]
      };
    }
  }
}; 