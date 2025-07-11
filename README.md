# FinanceMCP - Professional Financial Data MCP Server 🚀

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

**Language:** [English](README.md) | [简体中文](README_CN.md)

Welcome to **FinanceMCP** - A professional financial data server based on Model Context Protocol (MCP)! This project integrates **Tushare API** to provide comprehensive real-time financial data access for language models (like Claude), supporting multi-dimensional financial data analysis including stocks, funds, bonds, macroeconomic indicators, and more.

## 📺 Video Tutorial

**🎥 Complete Usage Tutorial**: [FinanceMCP - Comprehensive Financial Data Query Super MCP Tool Based on Tushare Data Interface](https://www.bilibili.com/video/BV1qeNnzEEQi/?share_source=copy_web&vd_source=9dab1cef4f662ff8e4e4a96790c3417c)

Watch our detailed bilibili video tutorial to learn how to:
- 🔧 Install and configure FinanceMCP
- 📊 Query various types of financial data
- 💡 Use advanced features and analysis capabilities
- 🚀 Integrate with Claude and other MCP clients



## 🎯 Tool Overview

This server provides **12 professional financial tools**:

| Tool Name | Function Description | Key Features |
|-----------|---------------------|--------------|
| 🕐 **current_timestamp** | Current timestamp utility | UTC+8 timezone, multiple formats (datetime/date/time/timestamp/readable), Chinese weekday display |
| 📰 **finance_news** | Financial news search | Smart keyword search across 7+ media sources (Sina, Wallstreetcn, 10jqka, etc.), supports single/multiple keyword queries |
| 📈 **stock_data** | Stock & technical indicator data | A-Shares/US/HK/Forex/Futures/Funds/Bonds/Options + Technical indicators (MACD/RSI/KDJ/BOLL/MA) with smart data prefetch |
| 📊 **index_data** | Index data query | Major market indices (Shanghai Composite, Shenzhen Component, etc.) with historical data |
| 📉 **macro_econ** | Macroeconomic data | 11 indicators: Shibor/LPR/GDP/CPI/PPI/Money Supply/PMI(30+ sub-indicators)/Social Financing/Libor/Hibor |
| 🏢 **company_performance** | Company financial analysis | Financial statements (Income/Balance/Cash Flow) + Management info + Company basics + Performance data (13 data types) |
| 💰 **fund_data** | Fund data query | Fund list/NAV/dividends/holdings/performance with 85% speed optimization (5.2s→0.8s), automatic share data integration |
| 👨‍💼 **fund_manager_by_name** | Fund manager query | Personal background, career history, managed funds list, professional resume by manager name |
| 🪙 **convertible_bond** | Convertible bond data | Basic info (bond details/trading/conversion terms/clauses) + Issuance data (online/offline/underwriting) |
| 🔄 **block_trade** | Block trade data | Trade details (price/volume/amount) + Trading parties (buyer/seller business departments) + Market statistics |
| 💹 **money_flow** | Money flow data | Main/Super large/Large/Medium/Small order flows + Individual stock analysis + Market trend statistics |
| 💰 **margin_trade** | Margin trade data | 4 APIs: Margin securities list (SSE/SZSE/BSE) + Trading summary/details + Market making with inventory data |

## 🔧 Technical Specifications

### Data Sources
- **Primary API**: [Tushare Pro](https://tushare.pro) - Professional financial data platform
- **Coverage**: Chinese mainland markets, Hong Kong, US markets, and global indices
- **Update Frequency**: Real-time to daily, depending on data type
- **Integrated Endpoints**: Over 40 Tushare API endpoints across all tools
- **Historical Data**: Multi-year historical coverage for most data types

### Supported Markets & Instruments
- **A-Shares**: Shanghai Stock Exchange (SH) and Shenzhen Stock Exchange (SZ)
- **Hong Kong**: Hong Kong Stock Exchange (HK)
- **US Markets**: NASDAQ, NYSE, and other US exchanges
- **Bonds**: Government bonds, corporate bonds, convertible bonds
- **Funds**: ETFs, mutual funds, index funds
- **Derivatives**: Futures, options, currency pairs
- **Indices**: Major market indices and sector indices

### API Interface Mapping
| Tool | Tushare API | Description |
|------|-------------|-------------|
| 🕐 Timestamp | `current_timestamp` | Current time information |
| 📰 Financial News | `Search API` | Smart news search |
| 📈 Stock Data | `daily`, `us_daily`, `hk_daily`, etc. | Multi-market stock data |
| 📊 Index Data | `index_daily` | Market indices |
| 📉 Macro Economics | `shibor`, `gdp`, `cpi`, etc. | Economic indicators |
| 🏢 Company Performance | `income`, `balancesheet`, `cashflow`, `stk_managers`, etc. | Financial statements + management info |
| 💰 Fund Data | `fund_basic`, `fund_nav`, etc. | Fund information |
| 👨‍💼 Fund Manager | `fund_manager` | Fund manager information |
| 🪙 Convertible Bond | `cb_basic`, `cb_issue` | Convertible bond data |
| 🔄 Block Trade | `block_trade` | Block trade data |
| 💹 Money Flow | `moneyflow` | Money flow data |
| 💰 Margin Trade | `margin_secs`, `margin`, `margin_detail`, `slb_len_mm` | Multiple margin trading APIs |

## 🚦 Requirements

Before getting started, please ensure you have:

1. **Node.js and npm**
   * Requires Node.js version >= 18
   * Download and install from [nodejs.org](https://nodejs.org/)

2. **Tushare API Token**
   * Visit [tushare.pro](https://tushare.pro/register) to register and get an API Token
   * This token will be used to access financial data provided by Tushare
   * Note: Some premium data requires point permissions

## 🎓 Free Tushare Credits for Students & Teachers

### For Students - Get 2000 Free Credits

[Tushare](https://tushare.pro/document/1?doc_id=360) provides **2000 free credits** for student users, covering basic stock/index/futures/options/fund/convertible bond information, daily market data, and financial reports.

**How to Get Student Credits:**

1. **Follow on Xiaohongshu (Little Red Book)**
   - Search and follow Tushare's official Xiaohongshu account
   - Like and comment on any post, mentioning your data needs and usage

2. **Join Student QQ Group**
   - Search QQ Group: **290541801**
   - When joining, mention your university name

3. **Complete Profile on Tushare**
   - Login to [tushare.pro](https://tushare.pro)
   - Fill in your school and personal information in Profile
   - Use your university email address; if unavailable, provide student ID photo or Xuexin.net screenshot

4. **Submit for Credits**
   - Send screenshots of steps 1 & 3, plus your Tushare ID to group admin via QQ
   - Receive 2000 credits after verification

### For Teachers - Get 5000 Free Credits

[Tushare](https://tushare.pro/document/1?doc_id=361) provides **5000 free credits** for university teachers with higher data permissions and support.

**How to Get Teacher Credits:**

1. **Add WeChat Contact**
   - Add WeChat: **waditu_a**
   - Note: "XX University Teacher"

2. **Complete Profile**
   - Login to [tushare.pro](https://tushare.pro)
   - Update institution and personal information in Profile
   - Provide your Tushare ID via WeChat or QQ

3. **Student Template (Optional)**
   - Download student credit template for batch student registration
   - Arrange students to fill template and send to Tushare contact

## 🛠️ Installation & Setup

### Install via Smithery (Recommended)

If you're using Claude Desktop, you can quickly install via [Smithery](https://smithery.ai/server/@guangxiangdebizi/finance-mcp):

```bash
npx -y @smithery/cli install @guangxiangdebizi/finance-mcp --client claude
```

### Manual Installation

1. **Get the code**
   ```bash
   git clone https://github.com/guangxiangdebizi/FinanceMCP.git
   cd FinanceMCP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Tushare API Token**
   * Create a `.env` file in the project root directory
   * Add the following content:
     ```
     TUSHARE_TOKEN=Your_Tushare_API_Token
     ```
   * Or set it directly in the `src/config.ts` file

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Running the Server

There are two ways to start the server:

### Method 1: Using stdio mode (Direct run)

```bash
node build/index.js
```

### Method 2: Using Supergateway (Recommended for development)

```bash
npx supergateway --stdio "node build/index.js" --port 3100
```

## 📝 Configuring MCP Clients

To use this server in Claude or other MCP clients, you need the following configuration:

### Claude Configuration

Add the following to Claude's configuration file:

```json
{
  "mcpServers": {
    "finance-data-server": {
      "url": "http://localhost:3100/sse", // If using Supergateway
      "type": "sse",
    }
  }
}
```

If using stdio mode directly (without Supergateway), configure as follows:

```json
{
  "mcpServers": {
    "finance-data-server": {
      "command": "C:/path/to/FinanceMCP/build/index.js", // Modify to actual path
      "type": "stdio",
      "disabled": false,
      "autoApprove": [
        "current_timestamp",
        "finance_news",
        "stock_data",
        "index_data",
        "macro_econ",
        "company_performance",
        "fund_data",
        "fund_manager_by_name",
        "convertible_bond",
        "block_trade",
        "money_flow",
        "margin_trade"
      ]
    }
  }
}
```

## 💡 Usage Examples

Once configured, you can ask Claude natural language questions about financial data:

### Basic Queries
- **Stock Data**: "Query Apple (AAPL) stock price for the last month"
- **Financial News**: "Search for latest news about Tesla"
- **Company Financials**: "Show Ping An Bank's recent financial statements"
- **Fund Data**: "Query CSI 300 ETF basic information and NAV trends"
- **Macro Data**: "Get latest GDP and CPI data"

### Advanced Analysis
- **Combined Analysis**: "Analyze CATL's money flow and recent news sentiment"
- **Multi-market**: "Compare A-share, US stock, and Hong Kong stock performance"
- **Risk Assessment**: "Evaluate margin trading risks for specific stocks"

Claude will automatically call the appropriate tools and provide comprehensive analysis based on the requested data.

## 📊 Supported Data Interfaces

The project currently integrates the following Tushare API interfaces:

| Function | Tushare Interface | Description |
|----------|-------------------|-------------|
| Current Timestamp | current_timestamp | Get current China timezone (UTC+8) time information ⭐️ |
| A-share Data | daily | Get A-share daily market data |
| US Stock Data | us_daily | Get US stock daily market data |
| HK Stock Data | hk_daily | Get Hong Kong stock daily market data |
| Forex Data | fx_daily | Get forex daily market data ⭐️ Fixed |
| Futures Data | fut_daily | Get futures daily market data |
| Fund Data | fund_daily | Get fund daily market data |
| Index Data | index_daily | Get index daily market data |
| Financial News | Search API | Smart search mainstream financial websites ⭐️ |
| Shibor Rates | shibor_data | Get Shanghai Interbank Offered Rate |
| LPR Rates | lpr_data | Get Loan Prime Rate |
| GDP | cn_gdp | Get Gross Domestic Product data |
| CPI | cn_cpi | Get Consumer Price Index data |
| PPI | cn_ppi | Get Producer Price Index data ⭐️ Fixed |
| Money Supply | cn_m | Get money supply data (M0, M1, M2) |
| PMI Index | cn_pmi | Get Purchasing Managers Index data ⭐️ Optimized |
| Social Financing | cn_sf | Get Total Social Financing data |
| Shibor Quotes | shibor_quote | Get Shibor bank quote data (bid, ask) |
| Libor Rates | libor | Get London Interbank Offered Rate |
| Hibor Rates | hibor | Get Hong Kong Interbank Offered Rate |
| Bond Repos | repo_daily | Get bond repo daily market data |
| Convertible Bonds | cb_daily | Get convertible bond daily market data |
| Options Data | opt_daily | Get options daily market data |
| Income Statement | income | Get listed company income statement data ⭐️ Integrated |
| Balance Sheet | balancesheet | Get listed company balance sheet data ⭐️ Integrated |
| Cash Flow Statement | cashflow | Get listed company cash flow statement data ⭐️ Integrated |
| Earnings Forecast | forecast | Get listed company earnings forecast data |
| Earnings Express | express | Get listed company earnings express data |
| Financial Indicators | fina_indicator | Get listed company financial indicator data |
| Dividends & Distribution | dividend | Get listed company dividend and distribution data |
| Main Business | fina_mainbz | Get main business composition data |
| Shareholder Count | stk_holdernumber | Get shareholder count data |
| Shareholder Trading | stk_holdertrade | Get shareholder trading data |
| Fund List | fund_basic | Get public fund basic information ⭐️ Optimized |
| Fund NAV | fund_nav | Get fund net asset value data ⭐️ Optimized |
| Fund Dividends | fund_div | Get fund dividend and distribution data ⭐️ Fixed |
| Fund Holdings | fund_portfolio | Get fund holdings details ⭐️ Optimized |
| Fund Managers | fund_manager | Get fund manager information ⭐️ Independent Tool |
| Convertible Bond Basic | cb_basic | Get convertible bond basic information ⭐️ |
| Convertible Bond Issue | cb_issue | Get convertible bond issuance data ⭐️ |
| Block Trade | block_trade | Get block trade data ⭐️ New |
| Money Flow | moneyflow | Get individual stock and market money flow data ⭐️ New |
| Margin Securities | margin_secs | Get margin trading eligible securities list ⭐️ Enhanced |
| Margin Summary | margin | Get margin trading summary data ⭐️ Enhanced |
| Margin Details | margin_detail | Get detailed margin trading records ⭐️ Enhanced |
| Securities Lending | slb_len_mm | Get market making securities lending data ⭐️ Enhanced |

## 🔮 Future Plans

Future plans include integrating more Tushare data interfaces, including but not limited to:

1. **Basic Data** - Stock lists, trading calendars, suspension/resumption info, etc.
2. **More Financial Data** - Financial audit opinions, main business composition, shareholder info, etc. ⭐️ Partially implemented
3. **More News Data** - Announcement info, research report data, etc. ⭐️ Partially implemented
4. **Technical Analysis Indicators** - MACD, RSI, Bollinger Bands, and other technical indicators
5. **Industry Data** - Industry classification, industry indices, industry comparative analysis, etc.
6. **Derivatives Data** - More options and futures contract data
7. **Alternative Data** - ESG ratings, institutional research, shareholder meetings, etc.

See the `tushare-interfaces.md` file for more potential data interfaces that could be integrated.

## 📈 Latest Updates

### v0.2.0 Major Updates
- ✅ **Financial Statements Integration** - Income statement, balance sheet, cash flow statement fully integrated into company_performance tool
- ✅ **Smart Data Filtering** - Automatically filter empty fields, only display items with actual data
- ✅ **Fund Data Optimization** - Query performance improved by 85%, split fund manager query into independent tool
- ✅ **Forex Data Fix** - Fixed forex field mapping error, correctly display bid/ask prices
- ✅ **PPI Data Fix** - Fixed PPI field mapping bug, correctly display Producer Price Index
- ✅ **New Block Trade Tool** - Support individual stock and market-wide block trade data queries
- ✅ **New Money Flow Tool** - Support individual stock and market money flow analysis
- ✅ **Enhanced Margin Trade Tool** - Support 4 margin trading APIs: securities list, trading summary/details, and market making
- ✅ **Chinese Localization** - Full Chinese localization of macroeconomic module
- ✅ **Batch Display Optimization** - Smart batch display for large data tables, improved readability

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- Name: Xingyu Chen (陈星宇)
- Email: guangxiangdebizi@gmail.com
- GitHub: [guangxiangdebizi](https://github.com/guangxiangdebizi)

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve this project!

## ⭐ Support the Project

If this project helps you, please give us a Star! Your support is our motivation for continuous improvement.
