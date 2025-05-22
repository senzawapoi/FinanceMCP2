# FinanceMCP 财经数据服务器

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

欢迎使用 **FinanceMCP 财经数据服务器**！本项目提供一个基于模型上下文协议 (MCP) 的服务器，使语言模型（如 Claude）能够访问通过 **Tushare API** 获取的实时财经数据。这使得AI助手能够基于最新的市场信息进行财经分析和预测。

## 🌟 功能特性

* **股票数据查询**：获取指定股票代码的历史行情数据
* **指数数据查询**：获取如上证指数、深证成指等主要市场指数的数据
* **财经新闻获取**：从多个来源（如新浪财经、东方财富等）获取最新财经新闻
* **宏观经济数据**：获取以下宏观经济指标数据：
  * Shibor利率（上海银行间同业拆放利率）
  * LPR利率（贷款基础利率）
  * GDP（国内生产总值）
  * CPI（居民消费价格指数）
  * PPI（工业品出厂价格指数）
* **笔记功能**：创建和管理简单的文本笔记
* **MCP 集成**：与支持MCP的客户端（如Claude）无缝集成

## 🚦 环境要求

在开始使用前，请确保您已安装：

1. **Node.js 和 npm**：
   * 要求 Node.js 版本 >= 18
   * 从 [nodejs.org](https://nodejs.org/) 下载安装

2. **Tushare API Token**：
   * 访问 [tushare.pro](https://tushare.pro/register) 注册并获取API Token
   * 此Token将用于访问Tushare提供的金融数据

## 🛠️ 安装与设置

### 通过 Smithery 安装 (推荐)

如果您使用Claude Desktop，可以通过[Smithery](https://smithery.ai/server/@guangxiangdebizi/finance-mcp)快速安装：

```bash
npx -y @smithery/cli install @guangxiangdebizi/finance-mcp --client claude
```

### 手动安装

1. **获取代码**：
   ```bash
   git clone https://github.com/guangxiangdebizi/FinanceMCP.git
   cd FinanceMCP
   ```

2. **安装依赖**：
   ```bash
   npm install
   ```

3. **配置 Tushare API Token**：
   * 创建`.env`文件在项目根目录
   * 添加以下内容：
     ```
     TUSHARE_TOKEN=您的Tushare_API_Token
     ```
   * 或直接在`src/config.ts`文件中设置

4. **构建项目**：
   ```bash
   npm run build
   ```

## 🚀 运行服务器

启动服务器有两种方式：

### 方式1：使用 stdio 模式 (直接运行)

```bash
node build/index.js
```

### 方式2：使用 Supergateway (推荐用于开发)

```bash
npx supergateway --stdio "node build/index.js" --port 3100
```

## 📝 配置MCP客户端

要在Claude或其他MCP客户端中使用此服务器，需要进行以下配置：

### Claude配置

在Claude的配置文件中添加以下内容：

```json
{
  "mcpServers": {
    "finance-data-server": {
      "url": "http://localhost:3100/sse", // 如果使用Supergateway
      "type": "sse",
      "disabled": false,
      "autoApprove": [
        "finance_news",
        "stock_data",
        "index_data",
        "macro_econ",
        "create_note"
      ]
    }
  }
}
```

如果直接使用stdio模式（不使用Supergateway），则配置如下：

```json
{
  "mcpServers": {
    "finance-data-server": {
      "command": "C:/path/to/FinanceMCP/build/index.js", // 修改为实际路径
      "type": "stdio",
      "disabled": false,
      "autoApprove": [
        "finance_news",
        "stock_data",
        "index_data",
        "macro_econ",
        "create_note"
      ]
    }
  }
}
```

## 💡 使用示例

以下是使用FinanceMCP服务器的一些示例查询：

### 1. 查询股票数据

您可以向Claude提问：
> "查询平安银行(000001.SZ)最近30天的股价数据"

这将使用`stock_data`工具获取股票数据。

### 2. 获取财经新闻

您可以向Claude提问：
> "获取最新的10条财经新闻"

这将使用`finance_news`工具获取最新新闻。

### 3. 查询宏观经济数据

您可以向Claude提问：
> "查询最近两年的GDP数据"

这将使用`macro_econ`工具获取GDP数据。

### 4. 结合数据进行分析

您可以向Claude提问更复杂的问题：
> "结合最近的新闻和股价数据，分析平安银行(000001.SZ)的投资前景"

Claude将调用多个工具获取所需数据，然后基于这些数据提供分析。

## 📊 支持的数据接口

目前项目已接入以下Tushare API接口：

| 功能 | Tushare接口 | 描述 |
|-----|------------|-----|
| 股票数据 | daily | 获取股票日线行情数据 |
| 指数数据 | index_daily | 获取指数每日行情数据 |
| 财经新闻 | news | 获取主流财经网站的快讯新闻 |
| Shibor利率 | shibor_data | 获取上海银行间同业拆放利率 |
| LPR利率 | lpr_data | 获取贷款基础利率 |
| GDP | cn_gdp | 获取国内生产总值数据 |
| CPI | cn_cpi | 获取居民消费价格指数数据 |
| PPI | cn_ppi | 获取工业品出厂价格指数数据 |

## 🔮 未来计划

未来计划接入更多Tushare数据接口，包括但不限于：

1. **基础数据**：股票列表、交易日历等
2. **财务数据**：利润表、资产负债表、现金流量表等
3. **基金数据**：基金净值、基金持仓等
4. **更多新闻数据**：公告信息、长篇财经新闻等

详见`tushare-interfaces.md`文件，其中列出了更多可能接入的数据接口。

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 👨‍💻 作者

- 名称: Xingyu_Chen
- 邮箱: guangxiangdebizi@gmail.com
- GitHub: [guangxiangdebizi](https://github.com/guangxiangdebizi)
