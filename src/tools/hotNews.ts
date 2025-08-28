import { TUSHARE_CONFIG } from '../config.js';
import { NewsItem } from './financeNews.js';

function normalizeText(text: string): string {
  return (text || '')
    .replace(/<[^>]+>/g, '')
    .replace(/[\s\u3000]+/g, '')
    .toLowerCase();
}

function toBigrams(text: string): string[] {
  const s = normalizeText(text);
  const grams: string[] = [];
  for (let i = 0; i < s.length - 1; i++) {
    grams.push(s.slice(i, i + 2));
  }
  return grams.length ? grams : s ? [s] : [];
}

function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const g of setA) if (setB.has(g)) inter++;
  const union = setA.size + setB.size - inter;
  return union === 0 ? 0 : inter / union;
}

function isSimilar(a: string, b: string, threshold: number): boolean {
  const sim = jaccard(toBigrams(a), toBigrams(b));
  return sim >= threshold;
}

function deduplicateByContent(items: NewsItem[], threshold = 0.8): NewsItem[] {
  const representatives: NewsItem[] = [];
  for (const item of items) {
    const content = `${item.title}\n${item.summary}`;
    let dup = false;
    for (const rep of representatives) {
      const repContent = `${rep.title}\n${rep.summary}`;
      if (isSimilar(content, repContent, threshold)) {
        dup = true;
        break;
      }
    }
    if (!dup) representatives.push(item);
  }
  return representatives;
}

async function fetchTushareNewsBatch(maxTotal: number): Promise<NewsItem[]> {
  if (!TUSHARE_CONFIG.API_TOKEN) {
    throw new Error('请配置TUSHARE_TOKEN环境变量');
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TUSHARE_CONFIG.TIMEOUT);
  try {
    const body = {
      api_name: 'news',
      token: TUSHARE_CONFIG.API_TOKEN,
      // 不传任何筛选参数，直接获取默认的最新数据
      params: {},
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
    const idxDatetime = fields.indexOf('datetime');
    const idxContent = fields.indexOf('content');
    const idxTitle = fields.indexOf('title');
    const results: NewsItem[] = [];
    for (const row of items) {
      if (results.length >= maxTotal) break;
      const title = String(row[idxTitle] ?? '').trim();
      const content = String(row[idxContent] ?? '').trim();
      const datetime = String(row[idxDatetime] ?? '').trim();
      results.push({
        title,
        summary: content,
        url: '',
        source: 'Tushare',
        publishTime: datetime,
        keywords: []
      });
    }
    return results;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('获取Tushare新闻失败:', err);
    return [];
  }
}

export const hotNews = {
  name: 'hot_news_7x24',
  description: '7x24热点：从Tushare新闻接口抓取单次上限1500条，并按80%相似度去重',
  parameters: {
    type: 'object',
    properties: {}
  },
  async run(_args?: {}) {
    try {
      const raw = await fetchTushareNewsBatch(1500);
      const deduped = deduplicateByContent(raw, 0.8);

      if (deduped.length === 0) {
        return { content: [{ type: 'text', text: '# 7x24 热点\n\n暂无数据' }] };
      }

      // 逐条仅展示摘要（如有标题可作为前缀），不展示来源/时间/分隔线
      const formattedList = deduped.map(n => {
        const title = n.title ? `${n.title}\n` : '';
        return `${title}${n.summary}`.trim();
      }).join('\n\n');

      // 底部统计：来源统计 + 时间范围/日期
      const sourceCounts = new Map<string, number>();
      const daySet = new Set<string>();
      for (const n of deduped) {
        sourceCounts.set(n.source, (sourceCounts.get(n.source) || 0) + 1);
        const day = (n.publishTime || '').split(' ')[0] || '';
        if (day) daySet.add(day);
      }
      const sourceStats = Array.from(sourceCounts.entries())
        .sort((a,b) => b[1]-a[1])
        .map(([s, c]) => `${s}: ${c}`)
        .join('，');
      const uniqueDays = Array.from(daySet.values()).sort();
      const dayInfo = uniqueDays.length ? `日期：${uniqueDays.join('、')}` : `日期：未知`;

      const footer = `\n\n—\n统计：共 ${deduped.length} 条；来源分布：${sourceStats || '无'}\n${dayInfo}\n数据来源：Tushare 新闻快讯 (<https://tushare.pro/document/2?doc_id=143>)`;

      return {
        content: [
          { type: 'text', text: `# 7x24 热点（按80%相似度降重）\n\n${formattedList}${footer}` }
        ]
      };
    } catch (error) {
      return { content: [{ type: 'text', text: `# 7x24 热点 获取失败\n\n错误: ${error instanceof Error ? error.message : '未知错误'}` }] };
    }
  }
};


