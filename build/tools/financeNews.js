import { TUSHARE_CONFIG } from '../config.js';
export const financeNews = {
    name: "finance_news",
    description: "获取最新财经新闻",
    parameters: {
        type: "object",
        properties: {
            count: {
                type: "number",
                description: "要获取的新闻条数，默认为5条"
            },
            source: {
                type: "string",
                description: "新闻来源，可选值：sina(新浪财经)、wallstreetcn(华尔街见闻)、10jqka(同花顺)、eastmoney(东方财富)等"
            }
        }
    },
    async run(args) {
        try {
            // 默认获取5条新闻，最多30条
            const count = args?.count && args.count > 0 ? Math.min(args.count, 30) : 5;
            // 默认使用新浪财经作为新闻源
            const source = args?.source || 'sina';
            console.log(`使用Tushare API获取${count}条${source}财经新闻`);
            // 使用全局配置中的Tushare API设置
            const TUSHARE_API_KEY = TUSHARE_CONFIG.API_TOKEN;
            const TUSHARE_API_URL = TUSHARE_CONFIG.API_URL;
            // 设置时间范围（过去24小时）
            const now = new Date();
            const endDate = now.toISOString().replace('T', ' ').substring(0, 19);
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const startDate = yesterday.toISOString().replace('T', ' ').substring(0, 19);
            // 构建请求参数
            const params = {
                api_name: "news",
                token: TUSHARE_API_KEY,
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    src: source
                },
                fields: "datetime,title,content,channels"
            };
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
                    throw new Error("Tushare API未返回新闻数据");
                }
                // 提取指定数量的新闻
                const newsItems = data.data.items.slice(0, count).map((item) => {
                    const datetime = item[0] || "未知时间";
                    const title = item[1] || "无标题";
                    const content = item[2] || "无内容";
                    const channels = item[3] || "";
                    return {
                        datetime,
                        title,
                        content,
                        channels
                    };
                });
                // 格式化输出
                const formattedNews = newsItems.map((news) => {
                    return `## ${news.title}\n**时间**: ${news.datetime}${news.channels ? `\n**分类**: ${news.channels}` : ''}\n\n${news.content}\n\n---\n`;
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: `# 最新财经新闻 (来源: ${source})\n\n${formattedNews.join("\n")}`
                        }
                    ]
                };
            }
            finally {
                clearTimeout(timeoutId);
            }
        }
        catch (error) {
            console.error("获取财经新闻失败:", error);
            return {
                content: [
                    {
                        type: "text",
                        text: `# 获取财经新闻失败\n\n无法从Tushare API获取新闻数据：${error instanceof Error ? error.message : String(error)}\n\n请检查API TOKEN权限或尝试其他新闻来源，可用来源包括：sina(新浪财经)、wallstreetcn(华尔街见闻)、10jqka(同花顺)、eastmoney(东方财富)等。`
                    }
                ]
            };
        }
    }
};
