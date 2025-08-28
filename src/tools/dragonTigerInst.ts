import { TUSHARE_CONFIG } from '../config.js';

export const dragonTigerInst = {
  name: 'dragon_tiger_inst',
  description: '龙虎榜机构成交明细（top_inst）。必填：交易日期；可选：股票TS代码。返回表格包含买入/卖出/净额及上榜理由等。',
  parameters: {
    type: 'object',
    properties: {
      trade_date: {
        type: 'string',
        description: '交易日期，格式YYYYMMDD'
      },
      ts_code: {
        type: 'string',
        description: '可选，股票TS代码，如 000001.SZ'
      }
    },
    required: ['trade_date']
  },
  async run(args: { trade_date: string; ts_code?: string }) {
    try {
      if (!args.trade_date || args.trade_date.trim().length !== 8) {
        throw new Error('trade_date 必须为YYYYMMDD');
      }

      if (!TUSHARE_CONFIG.API_TOKEN) {
        throw new Error('请配置TUSHARE_TOKEN环境变量');
      }

      const params: any = {
        api_name: 'top_inst',
        token: TUSHARE_CONFIG.API_TOKEN,
        params: {
          trade_date: args.trade_date
        }
      };
      if (args.ts_code) params.params.ts_code = args.ts_code;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TUSHARE_CONFIG.TIMEOUT);
      try {
        const resp = await fetch(TUSHARE_CONFIG.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: controller.signal
        });
        if (!resp.ok) throw new Error(`Tushare API请求失败: ${resp.status}`);
        const data = await resp.json();
        if (data.code !== 0) throw new Error(`Tushare API错误: ${data.msg}`);

        const fields: string[] = data.data?.fields ?? [];
        const items: any[] = data.data?.items ?? [];
        if (items.length === 0) {
          return {
            content: [
              { type: 'text', text: `# 龙虎榜机构明细 ${args.trade_date}${args.ts_code ? ` - ${args.ts_code}` : ''}\n\n暂无数据` }
            ]
          };
        }

        // 字段顺序按需求固定
        const desired = ['trade_date','ts_code','exalter','side','buy','buy_rate','sell','sell_rate','net_buy','reason'];
        const headers = desired.filter(h => fields.includes(h));

        let table = `| ${headers.join(' | ')} |\n`;
        table += `|${headers.map(() => '--------').join('|')}|\n`;
        for (const row of items) {
          const obj: Record<string, any> = {};
          fields.forEach((f: string, idx: number) => obj[f] = row[idx]);
          const side = obj.side === 0 ? '买入前5' : obj.side === 1 ? '卖出前5' : obj.side;
          const line = headers.map(h => {
            if (h === 'side') return String(side ?? 'N/A');
            const v = obj[h];
            return (v === null || v === undefined || v === '') ? 'N/A' : String(v);
          });
          table += `| ${line.join(' | ')} |\n`;
        }

        const title = `# 龙虎榜机构明细 ${args.trade_date}${args.ts_code ? ` - ${args.ts_code}` : ''}`;
        return { content: [ { type: 'text', text: `${title}\n\n${table}` } ] };
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      return {
        content: [ { type: 'text', text: `❌ 查询失败: ${error instanceof Error ? error.message : String(error)}` } ],
        isError: true
      };
    }
  }
};


