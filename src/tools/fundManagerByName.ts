// 基金经理按姓名查询工具
export const fundManagerByName = {
  name: "fund_manager_by_name",
  description: "根据基金经理姓名查询基金经理详细信息，包括管理的基金列表、个人背景、任职经历等",
  inputSchema: {
    type: "object" as const,
    properties: {
      name: {
        type: "string",
        description: "基金经理姓名，如'张凯'、'刘彦春'等"
      },
      ann_date: {
        type: "string",
        description: "公告日期，格式为YYYYMMDD，如'20230101'。用于限制查询的公告日期"
      }
    },
    required: ["name"]
  }
};

// 获取基金经理数据
async function fetchFundManagerData(
  name: string,
  annDate?: string,
  apiKey?: string,
  apiUrl?: string
) {
  if (!apiKey || !apiUrl) {
    throw new Error("API配置未找到");
  }

  const params: any = {
    api_name: "fund_manager",
    token: apiKey,
    params: {
      name: name
    },
    fields: "ts_code,ann_date,name,gender,birth_year,edu,nationality,begin_date,end_date,resume"
  };

  if (annDate) {
    params.params.ann_date = annDate;
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.code !== 0) {
    throw new Error(`API返回错误: ${result.msg}`);
  }

  return result.data;
}

// 格式化基金经理数据输出
function formatFundManagerData(data: any, name: string): string {
  let output = `# 基金经理查询结果\n\n`;
  output += `基金经理姓名: ${name}\n\n`;

  if (!data || !data.items || data.items.length === 0) {
    return output + "没有找到相关的基金经理信息。\n";
  }

  const items = data.items;
  output += `找到 ${items.length} 条相关记录\n\n`;

  // 按基金代码分组显示
  const fundGroups = new Map();
  
  items.forEach((item: any) => {
    const tsCode = item[0]; // ts_code
    if (!fundGroups.has(tsCode)) {
      fundGroups.set(tsCode, []);
    }
    fundGroups.get(tsCode).push(item);
  });

  let fundIndex = 1;
  for (const [tsCode, records] of fundGroups) {
    const firstRecord = records[0];
    const [, annDate, managerName, gender, birthYear, edu, nationality, beginDate, endDate, resume] = firstRecord;
    
    output += `## ${fundIndex}. 基金代码: ${tsCode}\n\n`;
    
    output += `| 项目 | 信息 |\n`;
    output += `|------|------|\n`;
    output += `| 基金经理 | ${managerName || 'N/A'} |\n`;
    output += `| 性别 | ${gender || 'N/A'} |\n`;
    output += `| 出生年份 | ${birthYear || 'N/A'} |\n`;
    output += `| 学历 | ${edu || 'N/A'} |\n`;
    output += `| 国籍 | ${nationality || 'N/A'} |\n`;
    output += `| 任职开始日期 | ${beginDate || 'N/A'} |\n`;
    output += `| 任职结束日期 | ${endDate || '在任'} |\n`;
    output += `| 公告日期 | ${annDate || 'N/A'} |\n`;
    
    if (resume) {
      output += `\n个人简历:\n${resume}\n`;
    }
    
    // 如果该基金有多条记录（历史任职记录），显示历史信息
    if (records.length > 1) {
      output += `\n历史任职记录:\n`;
      records.slice(1).forEach((record: any, index: number) => {
        const [, histAnnDate, , , , , , histBeginDate, histEndDate] = record;
        output += `- 第${index + 2}次任职: ${histBeginDate || 'N/A'} 至 ${histEndDate || '在任'} (公告日期: ${histAnnDate || 'N/A'})\n`;
      });
    }
    
    output += `\n---\n\n`;
    fundIndex++;
  }

  return output;
}

// 工具实现函数
export async function runFundManagerByName(args: { 
  name: string; 
  ann_date?: string; 
}) {
  try {
    const TUSHARE_API_KEY = process.env.TUSHARE_TOKEN;
    const TUSHARE_API_URL = "https://api.tushare.pro";

    if (!TUSHARE_API_KEY) {
      return {
        content: [{ type: "text", text: "错误: 未设置TUSHARE_TOKEN环境变量" }]
      };
    }

    const data = await fetchFundManagerData(
      args.name,
      args.ann_date,
      TUSHARE_API_KEY,
      TUSHARE_API_URL
    );

    const formattedOutput = formatFundManagerData(data, args.name);
    
    return {
      content: [{ type: "text", text: formattedOutput }]
    };

  } catch (error) {
    return {
      content: [{ type: "text", text: `查询基金经理信息时发生错误: ${error instanceof Error ? error.message : String(error)}` }]
    };
  }
} 