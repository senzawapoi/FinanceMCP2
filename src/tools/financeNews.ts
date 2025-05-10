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
  async run(args?: { count?: number; source?: string }) {
    try {
      // 默认获取5条新闻，最多30条
      const count = args?.count && args.count > 0 ? Math.min(args.count, 30) : 5;
      // 默认使用新浪财经作为新闻源
      const source = args?.source || 'sina';
      
      console.log(`使用Tushare API获取${count}条${source}财经新闻`);
      
      // Tushare API配置
      const TUSHARE_API_KEY = "7c8d386c326dabf9661dcbcdc317e3626dd0ec51b6cdaaa5d556f9ae";
      const TUSHARE_API_URL = "http://api.tushare.pro";
      
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
      
      // 发送请求
      const response = await fetch(TUSHARE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
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
      const newsItems = data.data.items.slice(0, count).map((item: any) => {
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
      const formattedNews = newsItems.map((news: { datetime: string; title: string; content: string; channels: string }) => {
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
    } catch (error) {
      console.error("获取财经新闻失败:", error);
      
      // 提供模拟数据作为后备
      const mockNews = [
        {
          title: "央行下调支农支小再贷款利率0.25个百分点",
          time: new Date().toLocaleString('zh-CN'),
          content: "根据国务院部署，为加大金融对强农惠农政策支持，更好发挥再贷款政策工具的引导和杠杆作用，促进进一步降低\"三农\"和小微企业综合融资成本，央行决定自2023年9月25日起下调支农支小再贷款利率0.25个百分点，优惠贷款政策有所扩大。",
        },
        {
          title: "证监会持续加强资本市场监管执法",
          time: new Date().toLocaleString('zh-CN'),
          content: "证监会新闻发言人表示，近期将持续加强资本市场监管执法力度，严厉打击财务造假、内幕交易等违法行为，特别是对重大财务欺诈案件将从严从重处罚，切实保护投资者合法权益，维护市场秩序，促进资本市场健康发展。",
        },
        {
          title: "两部门发布新能源汽车下乡活动实施方案",
          time: new Date().toLocaleString('zh-CN'),
          content: "工业和信息化部、商务部联合发布《新能源汽车下乡活动实施方案》，从即日起至年底，在全国范围内组织开展新一轮新能源汽车下乡活动。对消费者购买新能源汽车给予一定的补贴，促进农村汽车消费升级。",
        },
        {
          title: "A股三大指数震荡上行 沪指涨0.53%",
          time: new Date().toLocaleString('zh-CN'),
          content: "今日A股三大指数震荡上行，截至收盘，沪指涨0.53%，报3261.62点；深证成指涨0.91%，报10930.47点；创业板指涨1.14%，报2180.38点。两市超3500只个股上涨，成交额连续两日破万亿。半导体、航运等板块涨幅居前。",
        },
        {
          title: "国家发改委：推动能耗双控向碳排放双控转变",
          time: new Date().toLocaleString('zh-CN'),
          content: "国家发改委相关负责人表示，将推动能耗双控向碳排放双控转变，加快形成有利于绿色低碳发展的能源消费强度和总量双控政策，促进能源资源高效利用。碳排放强度持续下降，为实现'双碳'目标奠定坚实基础。",
        }
      ];
      
      // 选择指定数量的模拟新闻
      const selectedNews = mockNews.slice(0, args?.count || 5);
      
      // 格式化模拟新闻
      const formattedMockNews = selectedNews.map(news => {
        return `## ${news.title}\n**时间**: ${news.time}\n\n${news.content}\n\n---\n`;
      });
      
      return {
        content: [
          {
            type: "text",
            text: `# 最新财经新闻 (模拟数据)\n\n${formattedMockNews.join("\n")}\n\n> 注：由于Tushare API请求失败，显示的是模拟数据。错误: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};
