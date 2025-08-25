import { TUSHARE_CONFIG } from '../config.js';
function normalizeIndexCode(input) {
    const s = (input || '').trim();
    if (!s)
        return s;
    if (s.includes('.') && s.split('.').length === 2) {
        const [left, right] = s.split('.');
        return `${left}.${right.toUpperCase()}`;
    }
    const low = s.toLowerCase();
    if (low.startsWith('sz') || low.startsWith('sh')) {
        const market = s.substring(0, 2).toUpperCase();
        const digits = s.substring(2);
        return `${digits}.${market}`;
    }
    return s;
}
function parseDateString(input) {
    const s = (input || '').trim();
    if (!s)
        throw new Error('日期不能为空');
    if (s.includes('-')) {
        // YYYY-MM-DD -> YYYYMMDD
        return s.replaceAll('-', '');
    }
    if (/^\d{8}$/.test(s))
        return s;
    throw new Error('日期格式不正确，应为 YYYYMMDD 或 YYYY-MM-DD');
}
function addDaysYYYYMMDD(base, deltaDays) {
    const year = Number(base.slice(0, 4));
    const month = Number(base.slice(4, 6)) - 1;
    const day = Number(base.slice(6, 8));
    const dt = new Date(Date.UTC(year, month, day));
    dt.setUTCDate(dt.getUTCDate() + deltaDays);
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dt.getUTCDate()).padStart(2, '0');
    return `${y}${m}${d}`;
}
function mapTushareItemsToObjects(fields, items) {
    return items.map((row) => {
        const obj = {};
        fields.forEach((f, idx) => {
            obj[f] = row[idx];
        });
        return obj;
    });
}
async function callTushare(api_name, params, fields) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TUSHARE_CONFIG.TIMEOUT);
    try {
        const body = {
            api_name,
            token: TUSHARE_CONFIG.API_TOKEN,
            params,
            ...(fields ? { fields } : {})
        };
        const resp = await fetch(TUSHARE_CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal
        });
        if (!resp.ok)
            throw new Error(`Tushare API请求失败: ${resp.status}`);
        const data = await resp.json();
        if (data.code !== 0)
            throw new Error(`Tushare API错误: ${data.msg}`);
        const fieldsArr = data.data?.fields ?? [];
        const items = data.data?.items ?? [];
        return mapTushareItemsToObjects(fieldsArr, items);
    }
    finally {
        clearTimeout(timeoutId);
    }
}
function summarizePrices(rows) {
    if (!rows || rows.length === 0) {
        return {
            open_at_start: null,
            low_min: null,
            low_min_date: null,
            high_max: null,
            high_max_date: null,
            close_at_end: null
        };
    }
    // 确保按日期升序
    const sorted = [...rows].sort((a, b) => String(a.trade_date).localeCompare(String(b.trade_date)));
    const openAtStart = sorted[0]?.open != null ? Number(sorted[0].open) : null;
    const closeAtEnd = sorted[sorted.length - 1]?.close != null ? Number(sorted[sorted.length - 1].close) : null;
    let lowMin = null;
    let lowMinDate = null;
    let highMax = null;
    let highMaxDate = null;
    for (const r of sorted) {
        const low = r.low != null ? Number(r.low) : null;
        const high = r.high != null ? Number(r.high) : null;
        const date = String(r.trade_date);
        if (low != null && (lowMin == null || low < lowMin)) {
            lowMin = low;
            lowMinDate = date;
        }
        if (high != null && (highMax == null || high > highMax)) {
            highMax = high;
            highMaxDate = date;
        }
    }
    return {
        open_at_start: openAtStart,
        low_min: lowMin,
        low_min_date: lowMinDate,
        high_max: highMax,
        high_max_date: highMaxDate,
        close_at_end: closeAtEnd
    };
}
function calcReturn(openStart, closeEnd) {
    if (openStart == null || closeEnd == null || openStart === 0)
        return null;
    return (closeEnd - openStart) / openStart;
}
async function getIndexDaily(ts_code, start, end) {
    const rows = await callTushare('index_daily', { ts_code, start_date: start, end_date: end }, 'trade_date,open,high,low,close');
    return rows;
}
async function getStockDaily(ts_code, start, end) {
    const rows = await callTushare('daily', { ts_code, start_date: start, end_date: end }, 'trade_date,open,high,low,close');
    return rows;
}
async function getIndexWeights(index_code, end) {
    const norm = normalizeIndexCode(index_code);
    // 回退最多120天找到最近一次权重
    for (let i = 0; i <= 120; i++) {
        const d = addDaysYYYYMMDD(end, -i);
        const rows = await callTushare('index_weight', { index_code: norm, trade_date: d }, 'index_code,con_code,trade_date,weight');
        if (rows && rows.length > 0) {
            const arr = rows
                .map(r => ({ ts_code: String(r.con_code || r.ts_code || '').trim(), weight: Number(r.weight ?? 0) }))
                .filter(c => !!c.ts_code);
            // 按权重降序
            arr.sort((a, b) => b.weight - a.weight);
            return arr;
        }
    }
    return [];
}
export const csiIndexConstituents = {
    name: 'csi_index_constituents',
    description: '获取中证指数公司(CSI)指数的区间行情与成分股权重摘要。仅支持CSI指数，如 000300.SH/000905.SH/000852.SH；输入日期支持YYYYMMDD或YYYY-MM-DD。输出包括指数与全部成分股（按权重降序）的区间价格摘要与区间涨跌幅。',
    parameters: {
        type: 'object',
        properties: {
            index_code: {
                type: 'string',
                description: "指数代码(仅限CSI)，如 '000300.SH'、'000905.SH'，也支持 'sh000300'、'sz399006' 形式"
            },
            start_date: {
                type: 'string',
                description: '开始日期，YYYYMMDD 或 YYYY-MM-DD'
            },
            end_date: {
                type: 'string',
                description: '结束日期，YYYYMMDD 或 YYYY-MM-DD'
            }
        },
        required: ['index_code', 'start_date', 'end_date']
    },
    async run(args) {
        try {
            const normIndex = normalizeIndexCode(args.index_code);
            const start = parseDateString(args.start_date);
            const end = parseDateString(args.end_date);
            if (!TUSHARE_CONFIG.API_TOKEN) {
                throw new Error('请配置TUSHARE_TOKEN环境变量');
            }
            // 指数行情
            const indexDaily = await getIndexDaily(normIndex, start, end);
            const indexSummary = summarizePrices(indexDaily);
            const indexRet = calcReturn(indexSummary.open_at_start, indexSummary.close_at_end);
            // 成分权重（以end为基准回退查找）
            const weights = await getIndexWeights(normIndex, end);
            if (weights.length === 0) {
                return {
                    content: [
                        { type: 'text', text: `# ${normIndex} 指数区间与成分股摘要\n\n❌ 未能获取到指数成分权重（仅支持中证指数公司CSI），请检查指数代码或日期范围。` }
                    ]
                };
            }
            // 使用全部成分股（按权重降序）
            const allConstituents = weights;
            // 并发拉取全部成分股行情
            const stockRows = await Promise.all(allConstituents.map(c => getStockDaily(normalizeIndexCode(c.ts_code), start, end).catch(() => [])));
            const stockSummaries = stockRows.map(rows => summarizePrices(rows));
            // 组装输出
            const pct = (v) => v == null ? 'N/A' : (v * 100).toFixed(2) + '%';
            const num = (v) => v == null ? 'N/A' : String(Number(v.toFixed(4)));
            let out = `# ${normIndex} 指数区间与成分股摘要 (CSI专用)\n\n` +
                `仅支持中证指数公司(CSI)指数。查询区间: ${start} - ${end}\n\n` +
                `## 指数价格摘要\n` +
                `- 起始开盘: ${num(indexSummary.open_at_start)}\n` +
                `- 区间最低: ${num(indexSummary.low_min)} (${indexSummary.low_min_date || 'N/A'})\n` +
                `- 区间最高: ${num(indexSummary.high_max)} (${indexSummary.high_max_date || 'N/A'})\n` +
                `- 结束收盘: ${num(indexSummary.close_at_end)}\n` +
                `- 区间涨跌幅: ${pct(indexRet)}\n\n` +
                `## 成分股列表（按权重降序）\n`;
            out += `| 代码 | 权重(%) | 起始开盘 | 区间最低 | 区间最高 | 结束收盘 | 区间涨跌幅 |\n`;
            out += `|-----|---------|-----------|-----------|-----------|-----------|-----------|\n`;
            allConstituents.forEach((c, i) => {
                const s = stockSummaries[i];
                const r = calcReturn(s.open_at_start, s.close_at_end);
                out += `| ${normalizeIndexCode(c.ts_code)} | ${num(c.weight)} | ${num(s.open_at_start)} | ${num(s.low_min)} | ${num(s.high_max)} | ${num(s.close_at_end)} | ${pct(r)} |\n`;
            });
            return {
                content: [{ type: 'text', text: out }]
            };
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: `❌ CSI指数成分摘要查询失败: ${error instanceof Error ? error.message : String(error)}` }],
                isError: true
            };
        }
    }
};
