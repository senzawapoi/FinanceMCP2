import http from 'node:http';
import { withRequestContext } from './requestContext.js';
// 导入工具，与 src/index.ts 保持一致
import { financeNews } from './tools/financeNews.js';
import { stockData } from './tools/stockData.js';
import { indexData } from './tools/indexData.js';
import { macroEcon } from './tools/macroEcon.js';
import { companyPerformance } from './tools/companyPerformance.js';
import { fundData } from './tools/fundData.js';
import { runFundManagerByName } from './tools/fundManagerByName.js';
import { convertibleBond } from './tools/convertibleBond.js';
import { blockTrade } from './tools/blockTrade.js';
import { moneyFlow } from './tools/moneyFlow.js';
import { marginTrade } from './tools/marginTrade.js';
import { companyPerformance_hk } from './tools/companyPerformance_hk.js';
import { companyPerformance_us } from './tools/companyPerformance_us.js';
import { csiIndexConstituents } from './tools/csiIndexConstituents.js';
function extractTokenFromHeaders(headers) {
    // 支持 x-tushare-token: <token>
    const direct = headers['x-tushare-token'];
    if (typeof direct === 'string' && direct.trim().length > 0)
        return direct.trim();
    // 支持 authorization: Bearer <token> 或直接 <token>
    const auth = headers['authorization'];
    if (typeof auth === 'string' && auth.trim().length > 0) {
        const parts = auth.trim().split(/\s+/);
        if (parts.length === 2 && /^bearer$/i.test(parts[0]))
            return parts[1];
        return auth.trim();
    }
    return undefined;
}
async function runTool(name, args) {
    switch (name) {
        case 'finance_news': {
            const query = String(args?.query ?? '');
            return await financeNews.run({ query });
        }
        case 'stock_data': {
            const code = String(args?.code ?? '');
            const market_type = String(args?.market_type ?? '');
            const start_date = args?.start_date ? String(args.start_date) : undefined;
            const end_date = args?.end_date ? String(args.end_date) : undefined;
            const indicators = args?.indicators ? String(args.indicators) : undefined;
            return await stockData.run({ code, market_type, start_date, end_date, indicators });
        }
        case 'index_data': {
            const code = String(args?.code ?? '');
            const start_date = args?.start_date ? String(args.start_date) : undefined;
            const end_date = args?.end_date ? String(args.end_date) : undefined;
            return await indexData.run({ code, start_date, end_date });
        }
        case 'macro_econ': {
            const indicator = String(args?.indicator ?? '');
            const start_date = args?.start_date ? String(args.start_date) : undefined;
            const end_date = args?.end_date ? String(args.end_date) : undefined;
            return await macroEcon.run({ indicator, start_date, end_date });
        }
        case 'company_performance': {
            const ts_code = String(args?.ts_code ?? '');
            const data_type = String(args?.data_type ?? '');
            const start_date = String(args?.start_date ?? '');
            const end_date = String(args?.end_date ?? '');
            const period = args?.period ? String(args.period) : undefined;
            return await companyPerformance.run({ ts_code, data_type, start_date, end_date, period });
        }
        case 'fund_data': {
            const ts_code = args?.ts_code ? String(args.ts_code) : undefined;
            const data_type = String(args?.data_type ?? '');
            const start_date = args?.start_date ? String(args.start_date) : undefined;
            const end_date = args?.end_date ? String(args.end_date) : undefined;
            const period = args?.period ? String(args.period) : undefined;
            return await fundData.run({ ts_code, data_type, start_date, end_date, period });
        }
        case 'fund_manager_by_name': {
            const nameArg = String(args?.name ?? '');
            const ann_date = args?.ann_date ? String(args.ann_date) : undefined;
            return await runFundManagerByName({ name: nameArg, ann_date });
        }
        case 'convertible_bond': {
            const ts_code = args?.ts_code ? String(args.ts_code) : undefined;
            const data_type = String(args?.data_type ?? '');
            const start_date = args?.start_date ? String(args.start_date) : undefined;
            const end_date = args?.end_date ? String(args.end_date) : undefined;
            return await convertibleBond.run({ ts_code, data_type, start_date, end_date });
        }
        case 'block_trade': {
            const code = args?.code ? String(args.code) : undefined;
            const start_date = String(args?.start_date ?? '');
            const end_date = String(args?.end_date ?? '');
            return await blockTrade.run({ code, start_date, end_date });
        }
        case 'money_flow': {
            const ts_code = args?.ts_code ? String(args.ts_code) : undefined;
            const start_date = String(args?.start_date ?? '');
            const end_date = String(args?.end_date ?? '');
            return await moneyFlow.run({ ts_code, start_date, end_date });
        }
        case 'margin_trade': {
            const data_type = String(args?.data_type ?? '');
            const ts_code = args?.ts_code ? String(args.ts_code) : undefined;
            const start_date = String(args?.start_date ?? '');
            const end_date = args?.end_date ? String(args.end_date) : undefined;
            const exchange = args?.exchange ? String(args.exchange) : undefined;
            return await marginTrade.run({ data_type, ts_code, start_date, end_date, exchange });
        }
        case 'company_performance_hk': {
            const ts_code = String(args?.ts_code ?? '');
            const data_type = String(args?.data_type ?? '');
            const start_date = String(args?.start_date ?? '');
            const end_date = String(args?.end_date ?? '');
            const period = args?.period ? String(args.period) : undefined;
            const ind_name = args?.ind_name ? String(args.ind_name) : undefined;
            return await companyPerformance_hk.run({ ts_code, data_type, start_date, end_date, period, ind_name });
        }
        case 'company_performance_us': {
            const ts_code = String(args?.ts_code ?? '');
            const data_type = String(args?.data_type ?? '');
            const start_date = String(args?.start_date ?? '');
            const end_date = String(args?.end_date ?? '');
            const period = args?.period ? String(args.period) : undefined;
            return await companyPerformance_us.run({ ts_code, data_type, start_date, end_date, period });
        }
        case 'csi_index_constituents': {
            const index_code = String(args?.index_code ?? '');
            const start_date = String(args?.start_date ?? '');
            const end_date = String(args?.end_date ?? '');
            return await csiIndexConstituents.run({ index_code, start_date, end_date });
        }
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
function sendJson(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
const server = http.createServer(async (req, res) => {
    // 业务直连：POST /message（携带Authorization或x-tushare-token）
    if (req.method === 'POST' && req.url && req.url.startsWith('/message')) {
        try {
            const token = extractTokenFromHeaders(req.headers);
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                try {
                    const payload = JSON.parse(body || '{}');
                    if (!payload || typeof payload !== 'object' || !payload.name) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid payload: require { name, arguments }' }));
                        return;
                    }
                    const result = await withRequestContext({ tushareToken: token }, async () => {
                        return await runTool(payload.name, payload.arguments);
                    });
                    sendJson(res, 200, result);
                }
                catch (err) {
                    sendJson(res, 500, { error: (err instanceof Error ? err.message : String(err)) });
                }
            });
        }
        catch (err) {
            sendJson(res, 500, { error: (err instanceof Error ? err.message : String(err)) });
        }
        return;
    }
    // SSE：GET /sse（仅保活心跳，实际调用走 /message）
    if (req.method === 'GET' && req.url && req.url.startsWith('/sse')) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write(`event: open\n`);
        res.write(`data: {}\n\n`);
        const interval = setInterval(() => {
            res.write(`event: ping\n`);
            res.write(`data: {}\n\n`);
        }, 15000);
        req.on('close', () => {
            clearInterval(interval);
        });
        return;
    }
    sendJson(res, 404, { error: 'Not Found' });
});
const PORT = Number(process.env.PORT || 3100);
server.listen(PORT, () => {
    console.log(`HTTP server listening on http://localhost:${PORT} (routes: /message, /sse)`);
});
