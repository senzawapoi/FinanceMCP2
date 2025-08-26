import { TUSHARE_CONFIG } from '../config.js';
import { removeDuplicates, containsKeywords } from './crawler/utils.js';

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishTime: string;
  keywords: string[];
}

export const financeNews = {
  name: "finance_news",
  description: "基于 Tushare 新闻快讯接口的财经新闻查询，按关键字过滤结果",
  parameters: {
    type: "object",
    properties: {
      keyword: {
        type: "string",
        description: "关键字，多个关键字请用空格分隔，例如：'美联储 加息'"
      },
      start_date: {
        type: "string",
        description: "起始日期时间，格式：YYYY-MM-DD HH:mm:ss"
      },
      end_date: {
        type: "string",
        description: "结束日期时间，格式：YYYY-MM-DD HH:mm:ss"
      }
    },
    required: ["keyword", "start_date", "end_date"]
  },
  async run(args: { 
    keyword: string;
    start_date: string;
    end_date: string;
  }) {
    try {
      if (!args.keyword || args.keyword.trim().length === 0) {
        throw new Error("关键字不能为空");
      }

      if (!args.start_date || args.start_date.trim().length === 0) {
        throw new Error("起始日期不能为空，格式：YYYY-MM-DD HH:mm:ss");
      }

      const keyword = args.keyword.trim();
      const startDate = args.start_date.trim();
      const endDate = args.end_date.trim();

      console.log(`开始从 Tushare 获取财经新闻，关键字: ${keyword}，起始日期: ${startDate}，结束日期: ${endDate}`);

      const newsResults = await searchFinanceNewsByTushare(keyword, startDate, endDate);
    
      if (newsResults.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `# ${keyword} 财经新闻搜索结果\n\n未找到相关财经新闻`
            }
          ]
        };
      }
    
      console.log(`搜索完成，共找到 ${newsResults.length} 条新闻`);
      
      // 简化返回格式，参考stock_data的格式
      const formattedNews = newsResults.map((news) => {
        return `${news.title}\n来源: ${news.source}  时间: ${news.publishTime}\n摘要: ${news.summary}${news.url ? `\n链接: ${news.url}` : ''}\n`;
      }).join('\n---\n\n');
      
      return {
        content: [
          {
            type: "text",
            text: `# ${keyword} 财经新闻搜索结果\n\n${formattedNews}\n\n数据来源: Tushare 新闻快讯接口 (<https://tushare.pro/document/2?doc_id=143>)`
          }
        ]
      };
    } catch (error) {
      console.error('搜索财经新闻时发生错误:', error);
      return {
        content: [
          {
            type: "text",
            text: `# 财经新闻 搜索失败\n\n错误信息: ${error instanceof Error ? error.message : '未知错误'}`
          }
        ]
      };
    }
  }
};

async function searchFinanceNewsByTushare(keyword: string, startDate: string, endDate: string): Promise<NewsItem[]> {
  if (!TUSHARE_CONFIG.API_TOKEN) {
    throw new Error('请配置TUSHARE_TOKEN环境变量');
  }

  const keywords = keyword.split(' ').filter(k => k.trim().length > 0);

  // 支持的新闻来源（Tushare 文档列出的 src 标识）
  const sources = ['sina', 'wallstreetcn', '10jqka', 'eastmoney', 'yuncaijing', 'fenghuang', 'jinrongjie', 'cls', 'yicai'];

  const fetchOneSource = async (src: string): Promise<NewsItem[]> => {
    const aggregated: NewsItem[] = [];
    const MAX_PER_CALL = 1500;

    const toDate = (s: string): Date => new Date(s.replace(/-/g, '/'));
    const addOneSecond = (s: string): string => {
      const d = toDate(s);
      d.setSeconds(d.getSeconds() + 1);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    let cursorStart = startDate;
    let safetyCounter = 0; // 防无限循环
    while (true) {
      if (safetyCounter++ > 200) {
        console.warn(`来源 ${src} 拉取次数过多，提前停止`);
        break;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TUSHARE_CONFIG.TIMEOUT);
      try {
        const body = {
          api_name: 'news',
          token: TUSHARE_CONFIG.API_TOKEN,
          params: {
            src,
            start_date: cursorStart,
            end_date: endDate
          },
          fields: 'datetime,content,title,channels'
        } as const;

        const resp = await fetch(TUSHARE_CONFIG.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!resp.ok) {
          throw new Error(`Tushare请求失败: ${resp.status}`);
        }
        const data = await resp.json();
        if (data.code !== 0) {
          throw new Error(`Tushare返回错误: ${data.msg || data.message || '未知错误'}`);
        }

        const fields: string[] = data.data?.fields ?? [];
        const items: any[][] = data.data?.items ?? [];

        if (!items.length) {
          break; // 没有更多数据
        }

        const idxDatetime = fields.indexOf('datetime');
        const idxContent = fields.indexOf('content');
        const idxTitle = fields.indexOf('title');

        // 过滤并收集
        let batchMaxDatetime: string | null = null;
        for (const row of items) {
          const title = row[idxTitle] ?? '';
          const content = row[idxContent] ?? '';
          const datetime = String(row[idxDatetime] ?? '').trim();
          if (datetime) {
            if (!batchMaxDatetime || toDate(datetime) > toDate(batchMaxDatetime)) {
              batchMaxDatetime = datetime;
            }
          }
          const textForMatch = `${title}\n${content}`;
          if (containsKeywords(textForMatch, keywords)) {
            aggregated.push({
              title: String(title || '').trim(),
              summary: String(content || '').trim(),
              url: '',
              source: `Tushare:${src}`,
              publishTime: datetime,
              keywords
            });
          }
        }

        // 若不足上限，认为已取尽
        if (items.length < MAX_PER_CALL) {
          break;
        }

        // 达到上限，推进游标；若无法解析时间或已到终点，则停止
        if (!batchMaxDatetime) {
          break;
        }
        const nextStart = addOneSecond(batchMaxDatetime);
        if (toDate(nextStart) >= toDate(endDate)) {
          break;
        }
        cursorStart = nextStart;
      } catch (err) {
        clearTimeout(timeoutId);
        console.error(`获取来源 ${src} 时出错:`, err);
        break;
      }
    }

    return aggregated;
  };

  const settled = await Promise.allSettled(sources.map(src => fetchOneSource(src)));
  const all: NewsItem[] = [];
  for (const r of settled) {
    if (r.status === 'fulfilled') {
      all.push(...r.value);
    }
  }

  const uniqueNews = removeDuplicates(all);
  return uniqueNews.slice(0, 50);
}
