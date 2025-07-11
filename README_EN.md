[![中文版](https://img.shields.io/badge/中文-README.md-red?logo=github)](README.md)

# FinanceMCP - Professional Financial Data MCP Server 🚀

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

Welcome to **FinanceMCP** - a professional financial data server based on the Model Context Protocol (MCP)! This project integrates **Tushare API** to provide comprehensive real-time financial data access for language models (such as Claude), supporting multi-dimensional financial data analysis including stocks, funds, bonds, macroeconomic indicators, and more.

## 📺 Video Tutorial

**🎥 Full Tutorial:** [FinanceMCP, a Super Financial MCP Based on Tushare Data API](https://www.bilibili.com/video/BV1qeNnzEEQi/?share_source=copy_web&vd_source=9dab1cef4f662ff8e4e4a96790c3417c)

Watch our detailed Bilibili video tutorial to learn how to:
- 🔧 Install and configure FinanceMCP
- 📊 Query various types of financial data
- 💡 Use advanced features and analytics
- 🔗 Integrate with Claude and other MCP clients

## ⭐ Core Features

### 🧠 Intelligent Technical Indicator System
- **Smart Data Pre-fetching** - Automatically calculates and fetches extra historical data required for indicators, completely solving the initial `NaN` value problem
- **Mandatory Parameterization** - Users must explicitly specify parameters for all indicators (e.g., `macd(12,26,9)`), ensuring calculation accuracy and consistency
- **Modular Architecture** - Parameter parsing, data calculation, and indicator engine are fully decoupled for easy extension and maintenance
- **5 Core Indicators** - MACD, RSI, KDJ, BOLL, MA, strictly implemented according to industry-standard algorithms

### 🔄 Integrated Data Service
- **Single Call Retrieval** - Obtain both market data and technical indicator results in one API call
- **Multi-Market Coverage** - A-shares, US stocks, HK stocks, forex, futures, funds, bonds, options, and 9 major markets
- **Real-time News Integration** - Smart financial news search covering 7+ mainstream media sources
- **Comprehensive Financial Analysis** - Three major financial statements, operational indicators, shareholder structure, and 13 types of company data

## 🎯 Tool Overview

This server provides **12 professional financial tools**:

| Tool Name | Function Description | Key Features |
|-----------|---------------------|--------------|
| 🕐 **current_timestamp** | Current timestamp tool | UTC+8 timezone, multiple formats (datetime/date/time/timestamp/readable), Chinese weekday display |
| 📰 **finance_news** | Financial news search | Smart keyword search, covers 7+ media sources (Sina, Wallstreetcn, iFinD, etc.), supports single/multi-keyword queries |
| 📈 **stock_data** | Stock + technical indicator query | **⭐ Core Feature**: A-shares/US/HK/forex/futures/funds/bonds/options + indicators (MACD/RSI/KDJ/BOLL/MA) **Smart Data Pre-fetching** |
| 📊 **index_data** | Index data query | Major market indices (SSE, SZSE, etc.) historical data |
| 📉 **macro_econ** | Macroeconomic data | 11 indicators: Shibor/LPR/GDP/CPI/PPI/Money Supply/PMI(30+ subitems)/Social Financing/Libor/Hibor |
| 🏢 **company_performance** | Company financial analysis | Three statements (income/balance/cashflow) + management info + company basics + performance data (13 types) |
| 💰 **fund_data** | Fund data query | Fund list/NAV/dividends/holdings/performance, 85% performance optimized (5.2s→0.8s), auto share integration |
| 👨‍💼 **fund_manager_by_name** | Fund manager query | Personal background, tenure, managed funds list, query by manager name |
| 🪙 **convertible_bond** | Convertible bond data | Basic info (bond details/trading/convertible terms/bond terms) + issuance data (online/offline/underwriting) |
| 🔄 **block_trade** | Block trade data | Trade details (price/volume/amount) + both parties (buyer/seller) + market stats |
| 💹 **money_flow** | Money flow data | Main/super-large/large/medium/small order flows + stock analysis + market trend stats |
| 💰 **margin_trade** | Margin trading data | 4 APIs: marginable stocks (SSE/SZSE/BSE) + summary/details + securities lending with inventory |

## 🎯 Technical Indicator System Details

### Core Design Concepts
- **Intelligence** - Unique smart data pre-fetching mechanism, automatically calculates required historical data length
- **Modularity** - Fully decoupled architecture for parameter parsing, data calculation, and indicator engine
- **Precision** - Strictly follows industry-standard mathematical formulas to ensure accurate and reliable results

### Technical Architecture Flow

```
User Request → Parameter Parsing → Data Requirement Calculation → Extended Historical Data Fetch → Indicator Engine → Data Merge → Date Filtering → Return Result
```

### Supported Technical Indicators

| Indicator | Parameter Format | Algorithm Description | Data Requirement |
|-----------|------------------|----------------------|-----------------|
| **MACD** | `macd(12,26,9)` | Exponential Moving Average Convergence Divergence, trend analysis | Needs fast+slow+signal-1 days of data |
| **RSI** | `rsi(14)` | Relative Strength Index, overbought/oversold | Needs period days of data |
| **KDJ** | `kdj(9,3,3)` | Stochastic Oscillator, combines momentum, strength, and MA | Needs n+m1+m2-2 days of data |
| **BOLL** | `boll(20,2)` | Bollinger Bands, shows price position | Needs period days of data |
| **MA** | `ma(5)` / `ma(10)` / `ma(20)` / `ma(60)` | Moving Average, smooths price trend | Needs period-1 days of data |

### Usage Examples

```bash
# Basic stock data
"Query Ping An Bank (000001.SZ) stock data for the last month"

# Single technical indicator
"Query Apple Inc. (AAPL) MACD indicator with parameters (12,26,9)"

# Multiple indicators
"Analyze Moutai (600519.SH) technical status, calculate MACD(12,26,9), RSI(14), KDJ(9,3,3), and BOLL(20,2)"

# Custom date range + indicators
"Get CATL (300750.SZ) data from 2024-01-01 to 2024-06-30 and calculate MA(5), MA(20), MA(60)"
```

## 🔧 Technical Specifications

### Data Source
- **Main API** - [Tushare Pro](https://tushare.pro) professional financial data platform
- **Coverage** - Mainland China, Hong Kong, US markets, and global indices
- **Integrated APIs** - 40+ Tushare API endpoints across 12 tool modules
- **Update Frequency** - Real-time to daily, depending on data type
- **Historical Data** - Most data types support multi-year history

### Supported Markets & Tools
- **A-shares** - Shanghai (SH) and Shenzhen (SZ) Stock Exchanges
- **HK stocks** - Hong Kong Stock Exchange (HK)
- **US stocks** - NASDAQ, NYSE, etc.
- **Bonds** - Government, corporate, convertible bonds
- **Funds** - ETFs, mutual funds, index funds
- **Derivatives** - Futures, options, forex
- **Indices** - Major market and sector indices

### API Mapping
| Tool | Tushare API | Description |
|------|-------------|-------------|
| 🕐 Timestamp | `current_timestamp` | Current time info |
| 📰 Financial News | `search API` | Smart news search |
| 📈 Stock Data | `daily`, `us_daily`, `hk_daily`, `fx_daily`, `fut_daily`, `fund_daily`, `repo_daily`, `cb_daily`, `opt_daily` | 9 markets + technical indicators |
| 📊 Index Data | `index_daily` | Market indices |
| 📉 Macro Econ | `shibor`, `gdp`, `cpi`, `ppi`, `cn_m`, `cn_pmi`, `cn_sf`, `shibor_quote`, `libor`, `hibor` | 11 macro indicators |
| 🏢 Company Performance | `income`, `balancesheet`, `cashflow`, `stk_managers`, `forecast`, `express`, `fina_indicator`, `dividend`, `fina_mainbz`, etc. | Financials + management info |
| 💰 Fund Data | `fund_basic`, `fund_nav`, `fund_div`, `fund_portfolio` | Fund info |
| 👨‍💼 Fund Manager | `fund_manager` | Fund manager info |
| 🪙 Convertible Bond | `cb_basic`, `cb_issue` | Convertible bond info |
| 🔄 Block Trade | `block_trade` | Block trade data |
| 💹 Money Flow | `moneyflow` | Money flow data |
| 💰 Margin Trade | `margin_secs`, `margin`, `margin_detail`, `slb_len_mm` | Margin trading APIs |

## 🚦 Requirements

Before you start, make sure you have:

1. **Node.js & npm**
   * Node.js >= 18 required
   * Download from [nodejs.org](https://nodejs.org/)

2. **Tushare API Token**
   * Register at [tushare.pro](https://tushare.pro/register) to get your API Token
   * This token is required for Tushare data access
   * Note: Some advanced data requires points/permissions

## 🎓 Free Points for Students & Teachers

### Students - Get 2000 Free Points

[Tushare](https://tushare.pro/document/1?doc_id=360) offers **2000 free points** for students, enough for basic stock/index/futures/options/fund/convertible bond info, daily data, and financials.

**Steps:**
1. **Follow Xiaohongshu**
   - Search and follow Tushare's official Xiaohongshu account
   - Like and comment on any post, stating your data needs and usage
2. **Join Student QQ Group**
   - Search QQ group: **290541801**
   - Note your school name when joining
3. **Complete Tushare Profile**
   - Log in to [tushare.pro](https://tushare.pro)
   - Fill in your school and personal info in your profile
   - Use your school email; if not available, upload student ID or academic screenshot
4. **Submit Application**
   - Send screenshots from steps 1 & 3 and your Tushare ID to the group admin
   - After verification, you'll get 2000 points

### Teachers - Get 5000 Free Points

[Tushare](https://tushare.pro/document/1?doc_id=361) offers **5000 free points** for university teachers, with higher data access.

**Steps:**
1. **Add WeChat Contact**
   - Add WeChat: **waditu_a**
   - Note: "XX University Teacher"
2. **Complete Profile**
   - Log in to [tushare.pro](https://tushare.pro)
   - Update your organization and personal info
   - Provide your Tushare ID via WeChat or QQ
3. **Student Points Template (Optional)**
   - Download the template for batch student registration
   - Have students fill it and send to Tushare contact

## 🛠️ Installation & Configuration

### Install via Smithery (Recommended)

If you use Claude Desktop, install quickly via [Smithery](https://smithery.ai/server/@guangxiangdebizi/finance-mcp):

```bash
npx -y @smithery/cli install @guangxiangdebizi/finance-mcp --client claude
```

### Manual Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/guangxiangdebizi/FinanceMCP.git
   cd FinanceMCP
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Tushare API Token**
   * Create a `.env` file in the project root
   * Add:
     ```
     TUSHARE_TOKEN=your_tushare_api_token
     ```
   * Or set directly in `src/config.ts`
4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Start the Server

Two ways to start:

### Method 1: stdio mode (direct run)

```bash
node build/index.js
```

### Method 2: Supergateway (recommended for dev)

```bash
npx supergateway --stdio "node build/index.js" --port 3100
```

## 📝 MCP Client Configuration

To use this server in Claude or other MCP clients, you have several options:

### 🌐 Public Cloud Service (Recommended, no local deployment!)

**🎉 Public Cloud Service** - We have deployed FinanceMCP on the public cloud, you can use it directly, no local setup needed!

```json
{
  "mcpServers": {
    "finance-data-server": {
      "disabled": false,
      "timeout": 600,
      "type": "sse",
      "url": "http://106.14.205.176:3101/sse"
    }
  }
}
```

**📋 Service Info:**
- ✅ **Easy to use** - No registration or API Key, quick start
- ✅ **Ready to use** - No local deployment, works after config
- ✅ **Stable** - 24/7 operation, regular maintenance
- ✅ **Full features** - All 12 financial tools and indicators

**⚠️ Important:**
> 🧪 **Test Service Statement**: This service is for feature demonstration and testing, using my personal Tushare API quota. Feedback and suggestions are welcome. Please use reasonably and **do not attack or abuse the server**. If unstable, you can always deploy locally for better stability.

**🙏 Usage Tips:**
- Please control query frequency, avoid high-frequency bulk requests
- Recommended to use this public service for feature experience and testing
- Feedback and suggestions are welcome
- For production, local deployment is recommended

---

### 💻 Local Deployment

If you want full control, deploy locally:

#### Claude config (Supergateway mode)

Add to Claude config:

```json
{
  "mcpServers": {
    "finance-data-server": {
      "url": "http://localhost:3100/sse", // if using Supergateway
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
        "money_flow",
        "margin_trade"
      ]
    }
  }
}
```

#### Claude config (stdio mode)

If using stdio mode (not Supergateway):

```json
{
  "mcpServers": {
    "finance-data-server": {
      "command": "C:/path/to/FinanceMCP/build/index.js", // change to actual path
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

After config, you can ask Claude for financial data in natural language:

### Basic Queries
- **Stock Data**: "Query Apple Inc. (AAPL) stock price data for the last month"
- **Financial News**: "Search for the latest Tesla news"
- **Company Financials**: "Show Ping An Bank's recent financial statements"
- **Fund Data**: "Query CSI 300 ETF basic information and NAV trends"
- **Macro Data**: "Get the latest GDP and CPI data"

### Technical Indicator Analysis
- **Single Indicator**: "Calculate MACD indicator for Ping An Bank (000001.SZ) with parameters (12,26,9)"
- **Multiple Indicators**: "Analyze Moutai's (600519.SH) technical status, calculate MACD(12,26,9), RSI(14), KDJ(9,3,3)"
- **Moving Average System**: "View CATL's (300750.SZ) MA(5), MA(10), MA(20), MA(60) four moving averages"
- **Bollinger Bands**: "Analyze BYD's (002594.SZ) Bollinger Bands BOLL(20,2) technical patterns"

### Advanced Analysis
- **Tech + Fundamentals**: "Comprehensively analyze CATL: financials, MACD & RSI, money flow, latest news"
- **Multi-market Comparison**: "Compare A-shares, US, HK market performance, including indices and indicators"
- **Risk Assessment**: "Assess margin trading risk for a stock, including money flow and technical signals"

### Special Data Queries
- **Block Trade**: "Query recent block trades for Kweichow Moutai"
- **Money Flow**: "Analyze main money flow trend for CATL"
- **Convertible Bond**: "Query basic info and conversion for Ping An Convertible Bond"

Claude will automatically call the relevant tools and provide comprehensive analysis based on the data.

## 📊 Supported Data APIs

The project currently integrates the following Tushare APIs:

### Market Data APIs
| Function | Tushare API | Description |
|----------|-------------|-------------|
| Current Timestamp | current_timestamp | Get current UTC+8 time info ⭐️ |
| A-shares | daily | Get A-share daily data + indicators |
| US stocks | us_daily | Get US stock daily data + indicators |
| HK stocks | hk_daily | Get HK stock daily data + indicators |
| Forex | fx_daily | Get forex daily data + indicators ⭐️ Fixed |
| Futures | fut_daily | Get futures daily data + indicators |
| Funds | fund_daily | Get fund daily data + indicators |
| Repo | repo_daily | Get repo daily data + indicators |
| Convertible Bond | cb_daily | Get convertible bond daily data + indicators |
| Options | opt_daily | Get options daily data + indicators |
| Indices | index_daily | Get index daily data |

### Macro Data APIs
| Function | Tushare API | Description |
|----------|-------------|-------------|
| Financial News | search API | Smart news search ⭐️ |
| Shibor Rate | shibor_data | Get Shanghai Interbank Offered Rate |
| LPR Rate | lpr_data | Get Loan Prime Rate |
| GDP | cn_gdp | Get GDP data |
| CPI | cn_cpi | Get Consumer Price Index |
| PPI | cn_ppi | Get Producer Price Index ⭐️ Fixed |
| Money Supply | cn_m | Get money supply (M0, M1, M2) |
| PMI | cn_pmi | Get Purchasing Managers' Index ⭐️ Optimized |
| Social Financing | cn_sf | Get social financing scale |
| Shibor Quote | shibor_quote | Get Shibor bank quotes (bid/ask) |
| Libor Rate | libor | Get London Interbank Offered Rate |
| Hibor Rate | hibor | Get Hong Kong Interbank Offered Rate |

### Company Financial APIs
| Function | Tushare API | Description |
|----------|-------------|-------------|
| Income Statement | income | Get income statement ⭐️ Integrated |
| Balance Sheet | balancesheet | Get balance sheet ⭐️ Integrated |
| Cash Flow | cashflow | Get cash flow statement ⭐️ Integrated |
| Forecast | forecast | Get earnings forecast |
| Express | express | Get earnings express |
| Financial Indicators | fina_indicator | Get financial indicators |
| Dividend | dividend | Get dividend info |
| Main Business | fina_mainbz | Get main business data |
| Shareholder Number | stk_holdernumber | Get shareholder number |
| Shareholder Change | stk_holdertrade | Get shareholder change |
| Management | stk_managers | Get management info |
| Audit | audit | Get audit opinion |
| Company Basic | company_basic | Get company basic info |

### Fund Data APIs
| Function | Tushare API | Description |
|----------|-------------|-------------|
| Fund List | fund_basic | Get fund basic info ⭐️ Optimized |
| Fund NAV | fund_nav | Get fund NAV data ⭐️ Optimized |
| Fund Dividend | fund_div | Get fund dividend info ⭐️ Fixed |
| Fund Portfolio | fund_portfolio | Get fund portfolio info ⭐️ Optimized |
| Fund Manager | fund_manager | Get fund manager info ⭐️ Standalone tool |

### Other Professional APIs
| Function | Tushare API | Description |
|----------|-------------|-------------|
| Convertible Bond Basic | cb_basic | Get convertible bond basic info ⭐️ |
| Convertible Bond Issue | cb_issue | Get convertible bond issue data ⭐️ |
| Block Trade | block_trade | Get block trade data ⭐️ New |
| Money Flow | moneyflow | Get money flow data ⭐️ New |
| Marginable Stocks | margin_secs | Get marginable stocks (SSE/SZSE/BSE) ⭐️ New |
| Margin Summary | margin | Get margin trading summary ⭐️ New |
| Margin Details | margin_detail | Get margin trading details ⭐️ New |
| Securities Lending | slb_len_mm | Get securities lending data ⭐️ New |

## 🔮 Roadmap

Planned future integrations include (but are not limited to):

1. **More technical indicators** - Extended versions of BOLL, MACD, RSI, custom indicators ⭐️ Some done
2. **Basic data** - Stock list, trading calendar, suspension info, etc.
3. **More financial data** - Audit opinions, main business, shareholder info ⭐️ Some done
4. **More news data** - Announcements, research reports ⭐️ Some done
5. **Industry data** - Industry classification, indices, comparison, etc.
6. **Derivatives** - More options, futures contracts
7. **Alternative data** - ESG ratings, institutional research, shareholder meetings, etc.

See `tushare-interfaces.md` for more possible APIs.

## 📈 Latest Updates

### v1.0.0 Highlights
- ✅ **⭐ Full technical indicator system** - MACD/RSI/KDJ/BOLL/MA, smart data pre-fetching
- ✅ **Mandatory parameterization** - All indicators require explicit parameters
- ✅ **Modular architecture** - Fully decoupled parameter parsing, calculation, and engine
- ✅ **9-market coverage** - A-shares/US/HK/forex/futures/funds/bonds/options all support indicators
- ✅ **Financials integration** - Income, balance, cashflow fully integrated in company_performance
- ✅ **Smart data filtering** - Auto filter empty fields, only show real data
- ✅ **Fund data optimization** - 85% faster, fund manager tool split out
- ✅ **Forex fix** - Corrected field mapping, accurate bid/ask
- ✅ **PPI fix** - Fixed bug, correct producer price index
- ✅ **New block trade tool** - Stock & market block trade queries
- ✅ **New money flow tool** - Stock & market money flow analysis
- ✅ **New margin trade tool** - Full margin/lending analysis
- ✅ **Full Chinese support** - Macro module fully localized
- ✅ **Batch display optimization** - Large tables auto batch for readability

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 👨‍💻 Author

- Name: Xingyu Chen (陈星宇)
- Email: guangxiangdebizi@gmail.com
- GitHub: [guangxiangdebizi](https://github.com/guangxiangdebizi)

## 🤝 Contributing

Feel free to submit Issues and Pull Requests to improve this project!

## ⭐ Support

If you find this project helpful, please give us a Star! Your support motivates us to keep improving. 