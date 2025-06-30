# FinanceMCP - Professional Financial Data MCP Server 🚀

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

**Language:** [English](README.md) | [简体中文](README_CN.md)

Welcome to **FinanceMCP** - A professional financial data server based on Model Context Protocol (MCP)! This project integrates **Tushare API** to provide comprehensive real-time financial data access for language models (like Claude), supporting multi-dimensional financial data analysis including stocks, funds, bonds, macroeconomic indicators, and more.

## 🌟 Core Features

### 📈 Multi-Market Stock Data
Support stock data queries from major global markets:
* **A-Shares** (Shanghai & Shenzhen) - e.g., Ping An Bank (000001.SZ)
* **US Stocks** (NASDAQ, NYSE, etc.) - e.g., Apple (AAPL)
* **Hong Kong Stocks** (HKEX) - e.g., Tencent Holdings (00700.HK)
* **Forex** (Major currency pairs) - e.g., USD/CNH (USDCNH.FXCM)
* **Futures** (Commodity & financial futures) - e.g., Copper Futures (CU2501.SHF)
* **Funds** (ETFs, LOFs, etc.) - e.g., CSI 300 ETF (159919.SZ)
* **Bond Repos** (Government & corporate bonds) - e.g., GC001 (204001.SH)
* **Convertible Bonds** (Including conversion value, premium) - e.g., Ping An CB (113008.SH)
* **Options** (Stock & index options) - e.g., 50ETF Options (10001313.SH)

### 📊 Index Data Query
Get data for major market indices like Shanghai Composite Index, Shenzhen Component Index, etc.

### 📰 Financial News Search ⭐️ Smart Optimization
Get financial news content from mainstream financial media through real search API, supporting intelligent search with single or multiple keywords:
* **Supported Sources**: Sina Finance, Wallstreetcn, 10jqka, Eastmoney, Yuncaijing, Phoenix News, JRJ, etc.
* **Search Function**: Support single keywords like 'WuXi AppTec', 'Tencent', or multiple keywords separated by spaces like 'Federal Reserve Interest Rate', 'Bitcoin Regulation'
* **Smart Matching**: System intelligently searches relevant historical news
* **Real-time Updates**: Provide latest financial news and market dynamics

### 🏢 Company Financial Performance Analysis ⭐️ Complete Integration
Get comprehensive financial data for listed companies with smart data filtering and batch display:

#### Financial Statements (Fully Integrated)
* **Income Statement** - Operating revenue, net profit, gross margin, etc., supporting basic and complete versions
* **Balance Sheet** - Total assets, liabilities, shareholders' equity, etc., with smart empty field filtering
* **Cash Flow Statement** - Operating, investing, financing cash flows with clearer categorized display

#### Company Performance Data
* **Earnings Forecast** - Net profit change predictions, forecast types
* **Earnings Express** - Quick financial data, year-over-year growth rates
* **Financial Indicators** - ROE, ROA, current ratio, debt-to-asset ratio, etc.
* **Dividends & Stock Distribution** - Cash dividends, stock splits, key dates

#### Main Business Composition
* **By Product Analysis** - Main product revenue, profit, cost composition
* **By Region Analysis** - Regional revenue distribution, regional performance comparison
* **By Industry Analysis** - Industry revenue composition, industry competitive position

#### Shareholder Information
* **Shareholder Count** - Shareholder number change trends
* **Shareholder Trading** - Important shareholder buy/sell activities, shareholding changes

#### Management Information ⭐️ New Feature
* **Management Team** - Senior executives, directors, supervisors information
* **Profile Analysis** - Gender, education, nationality, age statistics
* **Position Distribution** - Position categories, title hierarchy analysis
* **Tenure Tracking** - Appointment dates, resignation status, career timeline

### 💰 Fund Data Query ⭐️ Complete Refactoring
Performance optimized with 85% speed improvement (from 5.2s to 0.8s):
* **Fund List** - Fund basic information, investment types, management fees, etc.
* **Fund NAV** - Unit NAV, cumulative NAV, adjusted NAV, etc., with automatic share data integration
* **Fund Dividends** - Dividend plans, cash dividends, ex-dividend dates, etc.
* **Fund Holdings** - Heavy positions, market value ratios, shareholding percentages, etc.
* **Fund Managers** - Manager profiles, tenure, managed funds, etc. (now independent tool)

### 👨‍💼 Fund Manager Query ⭐️ Independent Tool
Query detailed information by fund manager name:
* **Personal Background** - Gender, birth year, education, nationality
* **Career History** - Managed fund list, tenure, departure status
* **Professional Resume** - Detailed resume information, career development track

### 📈 Macroeconomic Data ⭐️ Chinese Optimization
Get key macroeconomic indicator data with full Chinese localization:
* **Shibor Rates** - Shanghai Interbank Offered Rate
* **LPR Rates** - Loan Prime Rate
* **GDP** - Gross Domestic Product
* **CPI** - Consumer Price Index
* **PPI** - Producer Price Index (fixed field mapping bug)
* **Money Supply** - M0, M1, M2 money supply data
* **PMI Index** - Manufacturing, services, composite PMI with 30+ detailed sub-indicators
* **Social Financing** - Total Social Financing data
* **Shibor Quotes** - Bank quote data (bid price, ask price)
* **Libor Rates** - London Interbank Offered Rate
* **Hibor Rates** - Hong Kong Interbank Offered Rate

### 🪙 Convertible Bond Data ⭐️ Professional Tool
Get comprehensive non-market data for convertible bonds:

#### Basic Information Query
* **Bond Details** - Bond name, underlying stock code/name, maturity period, par value
* **Trading Info** - Exchange, listing date, delisting date, issue date
* **Conversion Terms** - Initial conversion price, current conversion price, conversion period
* **Bond Clauses** - Interest rate clause, put clause, forced redemption clause, resale clause

#### Issuance Data Query
* **Issue Overview** - Planned/actual issue size, issue price, issue method, issue cost
* **Online Issuance** - Subscription code/name, issue date, subscription volume, winning rate
* **Shareholder Allotment** - Allotment code/name, record date, payment date, allotment ratio
* **Offline Issuance** - Issue volume, deposit ratio, subscription statistics
* **Underwriting Info** - Lead underwriter, underwriting volume

### 🔄 Block Trade Data ⭐️ New Feature
Get detailed block trade data:
* **Trade Details** - Transaction price, volume, amount
* **Trading Parties** - Buyer and seller business departments
* **Market Statistics** - Support whole market or individual stock block trade queries
* **Time Range** - Flexible date range queries

### 💹 Money Flow Data ⭐️ New Feature
Get individual stock and market money flow data:
* **Main Funds** - Main fund net inflow amount and net ratio
* **Super Large Orders** - Super large order fund flow statistics
* **Large/Medium/Small Orders** - Various fund inflow and outflow situations
* **Individual Analysis** - Individual stock money flow analysis
* **Market Statistics** - Overall market money flow trends

### 🕐 Current Timestamp ⭐️ Utility Tool
Get current time information for China timezone (UTC+8):
* **Multiple Formats** - datetime, date, time, timestamp, readable
* **China Timezone** - Accurate UTC+8 timezone calculation
* **Weekday Info** - Chinese weekday display
* **Real-time Precision** - Current timestamp accurate to seconds
* **Beautiful Display** - Markdown format with timezone information

### 🤖 MCP Integration
Seamless integration with MCP-compatible clients (like Claude) for intelligent financial analysis.

## 🎯 Tool Overview

This server provides **11 professional financial tools**:

| Tool Name | Function Description | Key Features |
|-----------|---------------------|--------------|
| 🕐 **current_timestamp** | Current timestamp | China timezone, multiple formats |
| 📰 **finance_news** | Financial news search | Smart keyword search, multi-media sources |
| 📈 **stock_data** | Stock data query | Global multi-market, 9 financial instruments |
| 📊 **index_data** | Index data query | Major market indices |
| 📉 **macro_econ** | Macroeconomic data | 11 economic indicators, Chinese optimized |
| 🏢 **company_performance** | Company financial analysis | Financial statements integrated, management info |
| 💰 **fund_data** | Fund data query | 5 major fund data types, performance optimized |
| 👨‍💼 **fund_manager_by_name** | Fund manager query | Query detailed info by name |
| 🪙 **convertible_bond** | Convertible bond data | Basic info + issuance data |
| 🔄 **block_trade** | Block trade data | Trade details + business department info |
| 💹 **money_flow** | Money flow data | Individual stock + market money flow |

## 🔧 Technical Specifications

### Data Sources
- **Primary API**: [Tushare Pro](https://tushare.pro) - Professional financial data platform
- **Coverage**: Chinese mainland markets, Hong Kong, US markets, and global indices
- **Update Frequency**: Real-time to daily, depending on data type
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

## 🚦 Requirements

Before getting started, please ensure you have:

1. **Node.js and npm**
   * Requires Node.js version >= 18
   * Download and install from [nodejs.org](https://nodejs.org/)

2. **Tushare API Token**
   * Visit [tushare.pro](https://tushare.pro/register) to register and get an API Token
   * This token will be used to access financial data provided by Tushare
   * Note: Some premium data requires point permissions

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
        "money_flow"
      ]
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
        "money_flow"
      ]
    }
  }
}
```

## 💡 Usage Examples

Here are some example queries using the FinanceMCP server:

### 1. Query Stock Data

You can ask Claude:

**A-share Query:**
> "Query Ping An Bank (000001.SZ) stock price data for the last 30 days"

**US Stock Query:**
> "Query Apple Inc. (AAPL) stock price data for the last month"

**Hong Kong Stock Query:**
> "Query Tencent Holdings (00700.HK) recent stock performance"

**Forex Query:**
> "Query USD/CNH (USDCNH.FXCM) recent exchange rate trends"

**Futures Query:**
> "Query Copper Futures (CU2501.SHF) recent market data"

**Fund Query:**
> "Query CSI 300 ETF (159919.SZ) recent NAV performance"

**Bond Repo Query:**
> "Query GC001 government bond repo (204001.SH) recent interest rate trends"

**Convertible Bond Query:**
> "Query Ping An Convertible Bond (113008.SH) recent market data"

**Options Query:**
> "Query 50ETF Options (10001313.SH) recent market data"

### 2. Get Financial News ⭐️ Smart Search

You can ask Claude:

**Single Keyword Search:**
> "Search for financial news related to 'WuXi AppTec'"
> "Get the latest financial information about 'Tencent'"

**Multiple Keywords Search:**
> "Search for news related to 'Federal Reserve Interest Rate'"
> "Get reports related to 'Bitcoin Regulation'"
> "Search for policy news about 'New Energy Vehicle Subsidies'"

**Market Hotspot Search:**
> "Search for news related to 'ChatGPT Concept Stocks'"
> "Get the latest developments in 'Real Estate Policy'"

### 3. Query Macroeconomic Data

You can ask Claude:
> "Query GDP data for the last two years"
> "Query the latest detailed PMI Purchasing Managers Index data"
> "Query recent PPI Producer Price Index trends"

### 4. Query Company Financial Performance ⭐️ Smart Filtering

You can ask Claude:

**Query Financial Statements:**
> "Query Ping An Bank (000001.SZ) recent income statement data"
> "Query Tencent Holdings (00700.HK) balance sheet"
> "Query Apple Inc. (AAPL) cash flow statement"

**Query Earnings Forecast and Express:**
> "Query Kweichow Moutai (600519.SH) earnings forecast"
> "Query BYD (002594.SZ) earnings express"

**Query Financial Indicators:**
> "Query China Merchants Bank (600036.SH) financial indicators including ROE, ROA, etc."

**Query Dividends & Stock Distribution:**
> "Query China Ping An (601318.SH) dividend and stock distribution history"

**Query All Financial Data:**
> "Query Vanke A (000002.SZ) comprehensive financial performance data"

### 5. Query Fund Data ⭐️ Performance Optimized

You can ask Claude:

**Query Fund Basic Information:**
> "Query CSI 300 ETF (159919.SZ) basic information"
> "Query all ETF funds traded on exchange"

**Query Fund NAV:**
> "Query E Fund Blue Chip Select (005827.OF) recent NAV trends"
> "Query China AMC CSI 300 ETF NAV performance"

**Query Fund Holdings:**
> "Query Invesco Great Wall CSI Liquor Index fund's heavy positions"
> "Query Southern CSI 500 ETF holdings details"

**Query Fund Dividends:**
> "Query Fuguo Tianhui Select Growth fund dividend history"

**Query All Fund Data:**
> "Query all data for China AMC CSI 300 ETF (510330.SH)"

### 6. Query Fund Manager ⭐️ Independent Tool

You can ask Claude:

**Query Fund Manager by Name:**
> "Query detailed information about fund manager Zhang Kai"
> "Search for funds managed by fund manager Liu Yanchun"
> "Query the resume of E Fund manager Zhang Kun"

### 7. Query Convertible Bond Data

You can ask Claude:

**Query Convertible Bond Basic Information:**
> "Query basic information for convertible bond 110001.SH"

**Query Convertible Bond Issuance Data:**
> "Get issuance data for convertible bonds announced in December 2023"

**Query All Convertible Bond Data:**
> "Query all available data for convertible bond 128001.SZ"

**Query Recent Convertible Bond Issues:**
> "Find convertible bonds issued between January 1, 2024 and June 30, 2024"

### 8. Query Block Trade Data ⭐️ New Feature

You can ask Claude:

**Query Individual Stock Block Trades:**
> "Query recent block trade activity for Ping An Bank (000001.SZ)"
> "Get block trade data for Kweichow Moutai (600519.SH) from the last week"

**Query Market-wide Block Trades:**
> "Query today's market-wide block trade activity"
> "Get market-wide block trade statistics for the last month"

### 9. Query Money Flow Data ⭐️ New Feature

You can ask Claude:

**Query Individual Stock Money Flow:**
> "Query recent money flow for CATL (300750.SZ)"
> "Analyze main fund movements for BYD (002594.SZ)"

**Query Market Money Flow:**
> "Query market money flow trends for the last week"
> "Analyze current market main fund movements"

### 10. Get Current Timestamp ⭐️ Utility Tool

You can ask Claude:

**Get Current Time:**
> "What time is it now?"
> "What's today's date?"
> "Get current timestamp"

**Different Time Formats:**
> "Show current time in readable format"
> "Get Unix timestamp"
> "Show only today's date"
> "Show only current time"

**Time-aware Analysis:**
> "What day of the week is today?"
> "Get current time for market analysis"

### 11. Combined Data Analysis

You can ask Claude more complex questions:
> "Combine recent news and stock price data to analyze Ping An Bank (000001.SZ) investment prospects"
> "Combine macroeconomic PMI data and manufacturing stock performance to analyze current manufacturing investment opportunities"
> "What's the current time and what important market news is there today?"
> "Analyze CATL's money flow and recent news to judge market sentiment"

Claude will call multiple tools to get the required data, then provide analysis based on this data.

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
