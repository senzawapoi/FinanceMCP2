import { JUHE_CONFIG } from '../config.js';
import { containsKeywords, removeDuplicates } from './crawler/utils.js';
export const juheNews = {
    name: "juhe_news",
    description: "基于聚合数据新闻头条的新闻查询与关键词过滤",
    parameters: {
        type: "object",
        properties: {
            keyword: {
                type: "string",
                description: "关键字，多个请用空格分隔"
            },
            category: {
                type: "string",
                description: "新闻分类，如 top, shehui, guonei, guoji, yule, tiyu, junshi, keji, caijing, shishang 等，可选"
            },
            api_key: {
                type: "string",
                description: "可选：直接传入聚合数据API Key，用于覆盖环境变量JUHE_API_KEY"
            }
        },
        required: ["keyword"]
    },
    async run(args) {
        try {
            const apiKey = (args.api_key ?? JUHE_CONFIG.API_KEY)?.trim();
            if (!apiKey) {
                throw new Error('未提供API Key。请设置环境变量 JUHE_API_KEY，或在调用时传参 api_key');
            }
            if (!args.keyword || args.keyword.trim().length === 0) {
                throw new Error('关键字不能为空');
            }
            const keyword = args.keyword.trim();
            const keywords = keyword.split(' ').filter(k => k.trim().length > 0);
            const category = args.category?.trim();
            const items = await fetchJuheNews(apiKey, category);
            const filtered = items.filter(item => containsKeywords(`${item.title}`, keywords));
            const unique = removeDuplicates(filtered.map(it => ({
                title: it.title,
                summary: it.title,
                url: it.url,
                source: `聚合数据:${it.source}`,
                publishTime: it.date,
                keywords: it.keywords
            })));
            if (unique.length === 0) {
                return {
                    content: [{ type: 'text', text: `# ${keyword} 聚合新闻结果\n\n未找到相关新闻\n\n数据来源: <https://www.juhe.cn/docs/api/id/235>` }]
                };
            }
            const formatted = unique.map(n => `${n.title}\n来源: ${n.source}  时间: ${n.publishTime}\n链接: ${n.url}\n`).join('\n---\n\n');
            return {
                content: [{ type: 'text', text: `# ${keyword} 聚合新闻结果\n\n${formatted}\n\n数据来源: <https://www.juhe.cn/docs/api/id/235>` }]
            };
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: `# 聚合新闻 查询失败\n\n错误: ${error instanceof Error ? error.message : '未知错误'}` }],
                isError: true
            };
        }
    }
};
async function fetchJuheNews(apiKey, category) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), JUHE_CONFIG.TIMEOUT);
    try {
        const url = new URL(JUHE_CONFIG.API_URL);
        url.searchParams.set('key', apiKey);
        if (category) {
            url.searchParams.set('type', category);
        }
        const resp = await fetch(url.toString(), { method: 'GET', signal: controller.signal });
        clearTimeout(timeoutId);
        if (!resp.ok) {
            throw new Error(`聚合请求失败: ${resp.status}`);
        }
        const json = await resp.json();
        // 按聚合文档解析（不同套餐字段可能不同，这里按常见返回：result.data[]）
        if (json.error_code && json.error_code !== 0) {
            throw new Error(`聚合返回错误: ${json.reason || json.error_code}`);
        }
        const data = json.result?.data ?? [];
        const items = data.map((d) => ({
            title: String(d.title ?? ''),
            date: String(d.date ?? ''),
            category: String(d.category ?? ''),
            author_name: String(d.author_name ?? ''),
            url: String(d.url ?? ''),
            source: String(d.author_name ?? d.category ?? '聚合'),
            keywords: []
        }));
        return items;
    }
    catch (err) {
        clearTimeout(timeoutId);
        console.error('聚合新闻获取失败:', err);
        return [];
    }
}
