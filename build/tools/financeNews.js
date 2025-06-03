import { TUSHARE_CONFIG } from '../config.js';
export const financeNews = {
    name: "finance_news",
    description: "获取财经新闻数据，支持快讯和长篇新闻两种类型，覆盖主流财经媒体",
    parameters: {
        type: "object",
        properties: {
            news_type: {
                type: "string",
                description: "新闻类型，可选值：news(新闻快讯，默认)、major_news(长篇通讯)"
            },
            source: {
                type: "string",
                description: "新闻来源。快讯支持：sina(新浪财经)、wallstreetcn(华尔街见闻)、10jqka(同花顺)、eastmoney(东方财富)、yuncaijing(云财经)、fenghuang(凤凰新闻)、jinrongjie(金融界)。长篇支持：新华网、凤凰财经、同花顺、新浪财经、华尔街见闻、中证网"
            },
            count: {
                type: "number",
                description: "要获取的新闻条数，快讯默认为10条（最多1500条），长篇默认为5条（最多400条）"
            },
            hours: {
                type: "number",
                description: "获取过去多少小时的新闻，默认为24小时"
            },
            start_date: {
                type: "string",
                description: "开始时间，格式：YYYY-MM-DD HH:MM:SS，如'2024-01-01 09:00:00'"
            },
            end_date: {
                type: "string",
                description: "结束时间，格式：YYYY-MM-DD HH:MM:SS，如'2024-01-01 18:00:00'"
            }
        }
    },
    async run(args) {
        try {
            // 默认参数
            const newsType = args?.news_type || 'news';
            const hours = args?.hours && args.hours > 0 ? args.hours : 24;
            // 验证新闻类型
            const validNewsTypes = ['news', 'major_news'];
            if (!validNewsTypes.includes(newsType)) {
                throw new Error(`不支持的新闻类型: ${newsType}。支持的类型有: ${validNewsTypes.join(', ')}`);
            }
            // 根据新闻类型设置默认值和验证
            let count;
            let source;
            let validSources;
            let maxCount;
            if (newsType === 'news') {
                // 快讯新闻
                count = args?.count && args.count > 0 ? Math.min(args.count, 1500) : 10;
                maxCount = 1500;
                validSources = ['sina', 'wallstreetcn', '10jqka', 'eastmoney', 'yuncaijing', 'fenghuang', 'jinrongjie'];
                source = args?.source || 'sina';
            }
            else {
                // 长篇新闻
                count = args?.count && args.count > 0 ? Math.min(args.count, 400) : 5;
                maxCount = 400;
                validSources = ['xinhua', 'fenghuang', '10jqka', 'sina', 'wallstreetcn', 'zhongzheng'];
                source = args?.source || 'sina';
            }
            // 验证新闻源
            if (source && !validSources.includes(source)) {
                throw new Error(`${newsType}不支持的新闻来源: ${source}。支持的来源有: ${validSources.join(', ')}`);
            }
            console.log(`使用Tushare API获取${count}条${source}${newsType === 'news' ? '快讯' : '长篇'}新闻`);
            // 使用全局配置中的Tushare API设置
            const TUSHARE_API_KEY = TUSHARE_CONFIG.API_TOKEN;
            const TUSHARE_API_URL = TUSHARE_CONFIG.API_URL;
            // 设置时间范围
            let startDate, endDate;
            if (args?.start_date && args?.end_date) {
                // 使用用户指定的时间
                startDate = args.start_date;
                endDate = args.end_date;
            }
            else {
                // 使用默认时间范围
                const now = new Date();
                endDate = now.toISOString().replace('T', ' ').substring(0, 19);
                const pastTime = new Date(now);
                pastTime.setHours(pastTime.getHours() - hours);
                startDate = pastTime.toISOString().replace('T', ' ').substring(0, 19);
            }
            // 构建请求参数
            const params = {
                api_name: newsType,
                token: TUSHARE_API_KEY,
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    src: source
                }
            };
            // 根据新闻类型设置字段
            if (newsType === 'news') {
                params.fields = "datetime,title,content,channels";
            }
            else {
                params.fields = "title,content,pub_time,src";
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
                    throw new Error(`未找到${newsType === 'news' ? '快讯' : '长篇'}新闻数据`);
                }
                // 获取字段名
                const fields = data.data.fields;
                // 提取指定数量的新闻并转换为对象数组
                const newsItems = data.data.items.slice(0, count).map((item) => {
                    const newsItem = {};
                    fields.forEach((field, index) => {
                        newsItem[field] = item[index] || "";
                    });
                    return newsItem;
                });
                // 生成新闻源显示名称
                const sourceNameMap = {
                    'sina': '新浪财经',
                    'wallstreetcn': '华尔街见闻',
                    '10jqka': '同花顺',
                    'eastmoney': '东方财富',
                    'yuncaijing': '云财经',
                    'fenghuang': '凤凰新闻',
                    'jinrongjie': '金融界',
                    'xinhua': '新华网',
                    'zhongzheng': '中证网'
                };
                const sourceDisplayName = sourceNameMap[source] || source;
                // 格式化输出
                let formattedNews;
                if (newsType === 'news') {
                    // 快讯新闻格式
                    formattedNews = newsItems.map((news, index) => {
                        const datetime = formatDateTime(news.datetime) || "未知时间";
                        const title = news.title || "无标题";
                        const content = news.content || "无内容";
                        const channels = news.channels || "";
                        return `## ${index + 1}. ${title}\n\n**📅 时间**: ${datetime}${channels ? `  **🏷️ 分类**: ${channels}` : ''}\n\n**📄 内容**: ${content}\n\n---\n`;
                    }).join("\n");
                }
                else {
                    // 长篇新闻格式
                    formattedNews = newsItems.map((news, index) => {
                        const pubTime = formatDateTime(news.pub_time) || "未知时间";
                        const title = news.title || "无标题";
                        const content = news.content || "无内容";
                        const src = news.src || source;
                        // 截取内容前500字符用于预览
                        const preview = content.length > 500 ? content.substring(0, 500) + "..." : content;
                        return `## ${index + 1}. ${title}\n\n**📅 发布时间**: ${pubTime}  **📰 来源**: ${src}\n\n**📄 内容预览**: ${preview}\n\n---\n`;
                    }).join("\n");
                }
                const newsTypeDisplay = newsType === 'news' ? '财经快讯' : '长篇财经新闻';
                const timeRange = args?.start_date && args?.end_date ?
                    `${args.start_date} 至 ${args.end_date}` :
                    `过去${hours}小时`;
                return {
                    content: [
                        {
                            type: "text",
                            text: `# ${newsTypeDisplay} (来源: ${sourceDisplayName})\n\n**📊 查询信息**:\n- **时间范围**: ${timeRange}\n- **数据条数**: ${newsItems.length}/${count}条\n- **新闻类型**: ${newsTypeDisplay}\n- **数据来源**: ${sourceDisplayName}\n\n---\n\n${formattedNews}`
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
                        text: `# 获取财经新闻失败\n\n**❌ 错误信息**: ${error instanceof Error ? error.message : String(error)}\n\n**📋 使用说明**:\n\n### 支持的新闻类型:\n- **news**: 新闻快讯（默认）\n- **major_news**: 长篇通讯\n\n### 快讯新闻支持的来源:\n- sina: 新浪财经\n- wallstreetcn: 华尔街见闻\n- 10jqka: 同花顺\n- eastmoney: 东方财富\n- yuncaijing: 云财经\n- fenghuang: 凤凰新闻\n- jinrongjie: 金融界\n\n### 长篇新闻支持的来源:\n- sina: 新浪财经\n- wallstreetcn: 华尔街见闻\n- 10jqka: 同花顺\n- fenghuang: 凤凰财经\n- xinhua: 新华网\n- zhongzheng: 中证网\n\n**💡 提示**: 请检查API TOKEN权限或尝试其他新闻来源。某些接口需要单独开通权限。`
                    }
                ]
            };
        }
    }
};
/**
 * 格式化日期时间显示
 */
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr)
        return "";
    // 处理格式：2024-01-01 09:00:00
    if (dateTimeStr.includes('-') && dateTimeStr.includes(':')) {
        try {
            const date = new Date(dateTimeStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}年${month}月${day}日 ${hours}:${minutes}`;
        }
        catch (e) {
            return dateTimeStr;
        }
    }
    return dateTimeStr;
}
