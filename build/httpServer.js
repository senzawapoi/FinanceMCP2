#!/usr/bin/env node
import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { runWithRequestContext } from "./config.js";
// 工具导入
import { financeNews } from "./tools/financeNews.js";
import { stockData } from "./tools/stockData.js";
import { indexData } from "./tools/indexData.js";
import { macroEcon } from "./tools/macroEcon.js";
import { companyPerformance } from "./tools/companyPerformance.js";
import { fundData } from "./tools/fundData.js";
import { fundManagerByName, runFundManagerByName } from "./tools/fundManagerByName.js";
import { convertibleBond } from "./tools/convertibleBond.js";
import { blockTrade } from "./tools/blockTrade.js";
import { moneyFlow } from "./tools/moneyFlow.js";
import { marginTrade } from "./tools/marginTrade.js";
import { companyPerformance_hk } from "./tools/companyPerformance_hk.js";
import { companyPerformance_us } from "./tools/companyPerformance_us.js";
import { csiIndexConstituents } from "./tools/csiIndexConstituents.js";
import { dragonTigerInst } from "./tools/dragonTigerInst.js";
import { hotNews } from "./tools/hotNews.js";
// 时间戳工具（保留）
const timestampTool = {
    name: "current_timestamp",
    description: "获取当前东八区（中国时区）的时间戳，包括年月日时分秒信息",
    parameters: {
        type: "object",
        properties: {
            format: {
                type: "string",
                description: "时间格式，可选值：datetime(完整日期时间，默认)、date(仅日期)、time(仅时间)、timestamp(Unix时间戳)、readable(可读格式)"
            }
        }
    },
    async run(args) {
        const now = new Date();
        const chinaTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
        const format = args?.format || 'datetime';
        const pad = (n) => n.toString().padStart(2, '0');
        const y = chinaTime.getUTCFullYear();
        const m = pad(chinaTime.getUTCMonth() + 1);
        const d = pad(chinaTime.getUTCDate());
        const hh = pad(chinaTime.getUTCHours());
        const mm = pad(chinaTime.getUTCMinutes());
        const ss = pad(chinaTime.getUTCSeconds());
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const wd = weekdays[chinaTime.getUTCDay()];
        let result = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
        if (format === 'date')
            result = `${y}-${m}-${d}`;
        if (format === 'time')
            result = `${hh}:${mm}:${ss}`;
        if (format === 'timestamp')
            result = Math.floor(chinaTime.getTime() / 1000).toString();
        if (format === 'readable')
            result = `${y}年${m}月${d}日 ${wd} ${hh}时${mm}分${ss}秒`;
        return { content: [{ type: 'text', text: `## 🕐 当前东八区时间\n\n格式: ${format}\n时间: ${result}\n星期: ${wd}` }] };
    }
};
const toolList = [
    { name: timestampTool.name, description: timestampTool.description, inputSchema: timestampTool.parameters },
    { name: financeNews.name, description: financeNews.description, inputSchema: financeNews.parameters },
    { name: stockData.name, description: stockData.description, inputSchema: stockData.parameters },
    { name: indexData.name, description: indexData.description, inputSchema: indexData.parameters },
    { name: macroEcon.name, description: macroEcon.description, inputSchema: macroEcon.parameters },
    { name: companyPerformance.name, description: companyPerformance.description, inputSchema: companyPerformance.parameters },
    { name: fundData.name, description: fundData.description, inputSchema: fundData.parameters },
    { name: fundManagerByName.name, description: fundManagerByName.description, inputSchema: fundManagerByName.inputSchema },
    { name: convertibleBond.name, description: convertibleBond.description, inputSchema: convertibleBond.parameters },
    { name: blockTrade.name, description: blockTrade.description, inputSchema: blockTrade.parameters },
    { name: moneyFlow.name, description: moneyFlow.description, inputSchema: moneyFlow.parameters },
    { name: marginTrade.name, description: marginTrade.description, inputSchema: marginTrade.parameters },
    { name: companyPerformance_hk.name, description: companyPerformance_hk.description, inputSchema: companyPerformance_hk.parameters },
    { name: companyPerformance_us.name, description: companyPerformance_us.description, inputSchema: companyPerformance_us.parameters },
    { name: csiIndexConstituents.name, description: csiIndexConstituents.description, inputSchema: csiIndexConstituents.parameters },
    { name: dragonTigerInst.name, description: dragonTigerInst.description, inputSchema: dragonTigerInst.parameters },
    { name: hotNews.name, description: hotNews.description, inputSchema: hotNews.parameters }
];
const sessions = new Map();
function extractTokenFromHeaders(req) {
    const h = req.headers;
    const tokenHeader = (h['x-tushare-token'] || h['x-api-key']);
    if (tokenHeader && tokenHeader.trim())
        return tokenHeader.trim();
    const auth = h['authorization'];
    if (typeof auth === 'string' && auth.toLowerCase().startsWith('bearer '))
        return auth.slice(7).trim();
    return undefined;
}
const app = express();
const PORT = Number(process.env.PORT || 3000);
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 'Accept', 'Authorization', 'Mcp-Session-Id', 'Last-Event-ID', 'X-Tenant-Id', 'X-Api-Key', 'X-Tushare-Token'
    ],
    exposedHeaders: ['Content-Type', 'Mcp-Session-Id']
}));
app.use(express.json({ limit: '10mb' }));
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', transport: 'streamable-http', activeSessions: sessions.size });
});
app.get('/mcp', (req, res) => {
    const accept = req.headers.accept || '';
    const forceSse = req.query.sse === '1' || req.query.sse === 'true';
    if (forceSse || (typeof accept === 'string' && accept.includes('text/event-stream'))) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        });
        // 仅发送注释型心跳，避免发送非 JSON-RPC 的 data 事件
        res.write(': stream established\n\n');
        const keep = setInterval(() => res.write(': keepalive\n\n'), 30000);
        req.on('close', () => clearInterval(keep));
        return;
    }
    return res.status(400).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Accept must include text/event-stream' }, id: null });
});
app.post('/mcp', async (req, res) => {
    const body = req.body;
    if (!body)
        return res.status(400).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Empty body' }, id: null });
    const isNotification = (body.id === undefined || body.id === null) && typeof body.method === 'string' && body.method.startsWith('notifications/');
    if (isNotification) {
        const sid = req.headers['mcp-session-id'];
        if (sid && sessions.has(sid))
            sessions.get(sid).lastActivity = new Date();
        return res.status(204).end();
    }
    const method = body.method;
    if (method === 'initialize') {
        const newId = randomUUID();
        sessions.set(newId, { id: newId, createdAt: new Date(), lastActivity: new Date() });
        res.setHeader('Mcp-Session-Id', newId);
        return res.json({ jsonrpc: '2.0', result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'FinanceMCP', version: '1.0.0' } }, id: body.id });
    }
    if (method === 'tools/list') {
        return res.json({ jsonrpc: '2.0', result: { tools: toolList }, id: body.id });
    }
    if (method === 'tools/call') {
        const { name, arguments: args } = body.params || {};
        const token = extractTokenFromHeaders(req);
        try {
            const result = await runWithRequestContext(token, async () => {
                switch (name) {
                    case 'current_timestamp':
                        return await timestampTool.run({ format: args?.format ? String(args.format) : undefined });
                    case 'finance_news':
                        return await financeNews.run({
                            query: String(args?.query)
                        });
                    case 'stock_data':
                        return await stockData.run({
                            code: String(args?.code),
                            market_type: String(args?.market_type),
                            start_date: args?.start_date ? String(args.start_date) : undefined,
                            end_date: args?.end_date ? String(args.end_date) : undefined,
                            indicators: args?.indicators ? String(args.indicators) : undefined,
                        });
                    case 'index_data':
                        return await indexData.run({
                            code: String(args?.code),
                            start_date: args?.start_date ? String(args.start_date) : undefined,
                            end_date: args?.end_date ? String(args.end_date) : undefined,
                        });
                    case 'macro_econ':
                        return await macroEcon.run({
                            indicator: String(args?.indicator),
                            start_date: args?.start_date ? String(args.start_date) : undefined,
                            end_date: args?.end_date ? String(args.end_date) : undefined,
                        });
                    case 'company_performance':
                        return await companyPerformance.run({
                            ts_code: String(args?.ts_code),
                            data_type: String(args?.data_type),
                            start_date: String(args?.start_date),
                            end_date: String(args?.end_date),
                            period: args?.period ? String(args.period) : undefined,
                        });
                    case 'fund_data':
                        return await fundData.run({
                            ts_code: args?.ts_code ? String(args.ts_code) : undefined,
                            data_type: String(args?.data_type),
                            start_date: args?.start_date ? String(args.start_date) : undefined,
                            end_date: args?.end_date ? String(args.end_date) : undefined,
                            period: args?.period ? String(args.period) : undefined,
                        });
                    case 'fund_manager_by_name':
                        return await runFundManagerByName({
                            name: String(args?.name),
                            ann_date: args?.ann_date ? String(args.ann_date) : undefined,
                        });
                    case 'convertible_bond':
                        return await convertibleBond.run({
                            ts_code: args?.ts_code ? String(args.ts_code) : undefined,
                            data_type: String(args?.data_type),
                            start_date: args?.start_date ? String(args.start_date) : undefined,
                            end_date: args?.end_date ? String(args.end_date) : undefined,
                        });
                    case 'block_trade':
                        return await blockTrade.run({
                            code: args?.code ? String(args.code) : undefined,
                            start_date: String(args?.start_date),
                            end_date: String(args?.end_date),
                        });
                    case 'money_flow':
                        return await moneyFlow.run({
                            ts_code: args?.ts_code ? String(args.ts_code) : undefined,
                            start_date: String(args?.start_date),
                            end_date: String(args?.end_date),
                        });
                    case 'margin_trade':
                        return await marginTrade.run({
                            data_type: String(args?.data_type),
                            ts_code: args?.ts_code ? String(args.ts_code) : undefined,
                            start_date: String(args?.start_date),
                            end_date: args?.end_date ? String(args.end_date) : undefined,
                            exchange: args?.exchange ? String(args.exchange) : undefined,
                        });
                    case 'company_performance_hk':
                        return await companyPerformance_hk.run({
                            ts_code: String(args?.ts_code),
                            data_type: String(args?.data_type),
                            start_date: String(args?.start_date),
                            end_date: String(args?.end_date),
                            period: args?.period ? String(args.period) : undefined,
                            ind_name: args?.ind_name ? String(args.ind_name) : undefined,
                        });
                    case 'company_performance_us':
                        return await companyPerformance_us.run({
                            ts_code: String(args?.ts_code),
                            data_type: String(args?.data_type),
                            start_date: String(args?.start_date),
                            end_date: String(args?.end_date),
                            period: args?.period ? String(args.period) : undefined,
                        });
                    case 'csi_index_constituents':
                        return await csiIndexConstituents.run({
                            index_code: String(args?.index_code),
                            start_date: String(args?.start_date),
                            end_date: String(args?.end_date),
                        });
                    case 'dragon_tiger_inst':
                        return await dragonTigerInst.run({
                            trade_date: String(args?.trade_date),
                            ts_code: args?.ts_code ? String(args.ts_code) : undefined,
                        });
                    case 'hot_news_7x24':
                        return await hotNews.run({});
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            });
            return res.json({ jsonrpc: '2.0', result, id: body.id });
        }
        catch (error) {
            const message = error?.message || String(error);
            return res.status(400).json({ jsonrpc: '2.0', error: { code: -32000, message }, id: body.id });
        }
    }
    return res.status(400).json({ jsonrpc: '2.0', error: { code: -32601, message: `Method not found: ${method}` }, id: body.id });
});
// 兼容性终止路由：部分客户端在结束会话时会调用此端点
app.post('/mcp/terminate', (_req, res) => {
    return res.status(200).json({ ok: true });
});
// 备用别名
app.post('/terminate', (_req, res) => {
    return res.status(200).json({ ok: true });
});
// 兼容 GET 终止
app.get('/mcp/terminate', (_req, res) => {
    return res.status(200).json({ ok: true });
});
app.get('/terminate', (_req, res) => {
    return res.status(200).json({ ok: true });
});
app.listen(PORT, () => {
    console.log(`Streamable HTTP MCP Server http://localhost:${PORT}`);
    console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
    console.log(`Health: http://localhost:${PORT}/health`);
});
