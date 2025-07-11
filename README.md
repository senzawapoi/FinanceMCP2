# FinanceMCP - Professional Financial Data MCP Server 🚀

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

Welcome to **FinanceMCP** - A professional financial data server based on the Model Context Protocol (MCP)! This project integrates the **Tushare API** to provide language models (like Claude) with comprehensive real-time financial data access capabilities, supporting multi-dimensional financial data analysis including stocks, funds, bonds, and macroeconomic indicators.

## 📺 Video Tutorial

**🎥 Complete Usage Tutorial**: [FinanceMCP - Comprehensive Financial Data Query Super MCP Based on Tushare Data Interface](https://www.bilibili.com/video/BV1qeNnzEEQi/?share_source=copy_web&vd_source=9dab1cef4f662ff8e4e4a96790c3417c)

Watch our detailed Bilibili video tutorial to learn how to:
- 🔧 Install and configure FinanceMCP
- 📊 Query various types of financial data
- 💡 Use advanced features and analysis capabilities
- 🚀 Integrate with Claude and other MCP clients

## ⭐ Core Features

### 🧠 Intelligent Technical Indicator System
- **Smart Data Pre-fetching Mechanism** - Automatically calculates and fetches additional historical data required for indicators, completely solving the problem of initial `NaN` values in technical indicators
- **Mandatory Parameter Design** - Requires users to explicitly specify parameters for all indicators (e.g., `macd(12,26,9)`), ensuring calculation accuracy and consistency
- **Modular Architecture** - Parameter parsing, data calculation, and indicator engines are completely decoupled for easy extension and maintenance
- **5 Core Indicators** - MACD, RSI, KDJ, BOLL, MA, strictly implemented according to recognized financial algorithms

### 🔄 Integrated Data Services
- **Single Call Access** - Get both market data and technical indicator calculations in one API call
- **Multi-Market Coverage** - 9 major markets including A-shares, US stocks, Hong Kong stocks, forex, futures, funds, bonds, and options
- **Real-time News Integration** - Intelligent financial news search covering 7+ mainstream media sources
- **Comprehensive Financial Analysis** - Three major financial statements, business indicators, shareholder structure, and 13 types of corporate data

## 🎯 Tools Overview

This server provides **12 professional financial tools**:

| Tool Name | Function Description | Key Features |
|---------|---------|---------|
| 🕐 **current_timestamp** | Current timestamp tool | UTC+8 timezone, multiple formats (datetime/date/time/timestamp/readable), Chinese weekday display |
| 📰 **finance_news** | Financial news search | Smart keyword search, covering 7+ media sources (Sina, Wallstreetcn, THS, etc.), supports single/multiple keyword queries |
| 📈 **stock_data** | Stock + Technical Indicators | **⭐ Core Feature**: A-shares/US stocks/HK stocks/Forex/Futures/Funds/Bonds/Options + Technical Indicators (MACD/RSI/KDJ/BOLL/MA) **Smart Data Pre-fetching** |
| 📊 **index_data** | Index data query | Major market indices (Shanghai Composite, Shenzhen Component, etc.) historical data |
| 📉 **macro_econ** | Macroeconomic data | 11 indicators: Shibor/LPR/GDP/CPI/PPI/Money Supply/PMI(30+ sub-items)/Social Financing/Libor/Hibor |
| 🏢 **company_performance** | Corporate financial analysis | Three financial statements (Income/Balance Sheet/Cash Flow) + Management info + Company basics + Performance data (13 data types) |
| 💰 **fund_data** | Fund data query | Fund list/NAV/dividends/holdings/performance, 85% performance optimization (5.2s→0.8s), automatic share data integration |
| 👨‍💼 **fund_manager_by_name** | Fund manager query | Personal background, tenure history, managed fund list, professional resume query by manager name |
| 🪙 **convertible_bond** | Convertible bond data | Basic info (bond details/trading/conversion terms/bond clauses) + Issuance data (online/offline/underwriting) |
| 🔄 **block_trade** | Block trade data | Trade details (price/volume/amount) + Trading parties (buy/sell business departments) + Market statistics |
| 💹 **money_flow** | Capital flow data | Main force/Super large/Large/Medium/Small order capital flow + Individual stock analysis + Market trend statistics |
| 💰 **margin_trade** | Margin trading data | 4 APIs: Margin trading targets (Shanghai/Shenzhen/Beijing) + Trading summary/details + Market maker lending including inventory data |

## 🎯 Technical Indicator System Details

### Core Design Philosophy
- **Intelligence** - Innovative smart data pre-fetching mechanism that automatically calculates the historical data length required for indicators
- **Modularity** - Completely decoupled architecture design for parameter parsing, data calculation, and indicator engines
- **Precision** - Strictly implemented according to recognized mathematical formulas in the financial field, ensuring accurate and reliable calculation results

### Technical Architecture Flow

```
User Request → Parameter Parsing → Data Requirement Calculation → Extended Historical Data Fetching → Indicator Calculation Engine → Data Merging → User Date Filtering → Return Results
```

### Supported Technical Indicators

| Indicator Name | Parameter Format | Algorithm Description | Data Requirement |
|---------|---------|---------|---------|
| **MACD** | `macd(12,26,9)` | Moving Average Convergence Divergence, analyzes trend changes | Requires fast+slow+signal-1 days of data |
| **RSI** | `rsi(14)` | Relative Strength Index, judges overbought/oversold conditions | Requires period days of data |
| **KDJ** | `kdj(9,3,3)` | Stochastic Oscillator, combines momentum, strength, and moving average advantages | Requires n+m1+m2-2 days of data |
| **BOLL** | `boll(20,2)` | Bollinger Bands, shows relative price position | Requires period days of data |
| **MA** | `ma(5)` / `ma(10)` / `ma(20)` / `ma(60)` | Moving Average, smooths price trends | Requires period-1 days of data |

### Usage Examples

```bash
# Basic stock data
"Query Ping An Bank (000001.SZ) market data for the past month"

# Single technical indicator
"Query Apple Inc. (AAPL) MACD indicator with parameters (12,26,9)"

# Multiple technical indicator combination
"Analyze Kweichow Moutai (600519.SH) technical status, calculate MACD(12,26,9), RSI(14), KDJ(9,3,3) and Bollinger Bands(20,2)"

# Custom time range + technical indicators
"Get CATL (300750.SZ) market data from January 1, 2024 to June 30, 2024, and calculate MA(5), MA(20), MA(60) moving averages"
```

## 🔧 Technical Specifications

### Data Sources
- **Primary API** - [Tushare Pro](https://tushare.pro) Professional Financial Data Platform
- **Coverage** - Mainland China markets, Hong Kong, US markets, and global indices
- **Integrated Interfaces** - Covers 40+ Tushare API endpoints distributed across 12 tool modules
- **Update Frequency** - Real-time to daily level, depending on data type
- **Historical Data** - Most data types support multi-year historical coverage

### Supported Markets & Instruments
- **A-shares** - Shanghai Stock Exchange (SH) and Shenzhen Stock Exchange (SZ)
- **Hong Kong Stocks** - Hong Kong Stock Exchange (HK)
- **US Stocks** - NASDAQ, NYSE and other US exchanges
- **Bonds** - Government bonds, corporate bonds, convertible bonds
- **Funds** - ETFs, mutual funds, index funds
- **Derivatives** - Futures, options, currency pairs
- **Indices** - Major market indices and sector indices

### API Interface Mapping
| Tool | Tushare API | Description |
|------|-------------|-----|
| 🕐 Timestamp | `current_timestamp` | Current time information |
| 📰 Financial News | `Search API` | Intelligent news search |
| 📈 Stock Data | `daily`, `us_daily`, `hk_daily`, `fx_daily`, `fut_daily`, `fund_daily`, `repo_daily`, `cb_daily`, `opt_daily` | 9 major market stock data + technical indicators |
| 📊 Index Data | `index_daily` | Market indices |
| 📉 Macroeconomic | `shibor`, `gdp`, `cpi`, `ppi`, `cn_m`, `cn_pmi`, `cn_sf`, `shibor_quote`, `libor`, `hibor` | 11 economic indicators |
| 🏢 Corporate Finance | `income`, `balancesheet`, `cashflow`, `stk_managers`, `forecast`, `express`, `fina_indicator`, `dividend`, `fina_mainbz` etc. | Financial statements + management information |
| 💰 Fund Data | `fund_basic`, `fund_nav`, `fund_div`, `fund_portfolio` | Fund information |
| 👨‍💼 Fund Manager | `fund_manager` | Fund manager information |
| 🪙 Convertible Bonds | `cb_basic`, `cb_issue` | Convertible bond data |
| 🔄 Block Trade | `block_trade` | Block trade data |
| 💹 Money Flow | `moneyflow` | Capital flow data |
| 💰 Margin Trade | `margin_secs`, `margin`, `margin_detail`, `slb_len_mm` | Multiple margin trading APIs |

## 🚦 System Requirements

Before getting started, ensure you have:

1. **Node.js and npm**
   * Requires Node.js version >= 18
   * Download and install from [nodejs.org](https://nodejs.org/)

2. **Tushare API Token**
   * Visit [tushare.pro](https://tushare.pro/register) to register and obtain an API Token
   * This token is used to access financial data provided by Tushare
   * Note: Some advanced data requires credit permissions

## 🎓 Free Credits for Students and Teachers

### Students - Get 2000 Free Credits

[Tushare](https://tushare.pro/document/1?doc_id=360) provides **2000 free credits** for student users, which basically covers basic information, daily market data, and financial reports for stocks/indices/futures/options/funds/convertible bonds.

**Steps to Get Student Credits:**

1. **Follow on Xiaohongshu (Little Red Book)**
   - Search for and follow the official Tushare data Xiaohongshu account
   - Like and comment on any post, describing your data needs and usage

2. **Join Student QQ Group**
   - Search for QQ group number: **290541801**
   - Note your school name when joining the group

3. **Complete Tushare Personal Information**
   - Log in to [tushare.pro](https://tushare.pro)
   - Fill in school and personal information on the personal center homepage
   - Fill in your school email address in the email field; if you don't have a school email, provide a photo of your student ID or screenshot from Xuexin.com

4. **Submit Application**
   - Send screenshots from steps 1 and 3, along with your Tushare ID, privately to the group owner or administrator in the QQ group
   - You'll receive 2000 credits after verification

### Teachers - Get 5000 Free Credits

[Tushare](https://tushare.pro/document/1?doc_id=361) provides **5000 free credits** for university teachers, enjoying higher-privilege data services and support.

**Steps to Get Teacher Credits:**

1. **Add WeChat Contact**
   - Add WeChat: **waditu_a**
   - Note: "XX University Teacher"

2. **Complete Personal Profile**
   - Log in to [tushare.pro](https://tushare.pro)
   - Modify organization and personal information on the personal homepage
   - Provide your Tushare ID via WeChat or QQ

3. **Student Credit Template (Optional)**
   - Download student credit template for batch student registration
   - Have students fill out the template uniformly and send to Tushare contact

## 🛠️ Installation & Configuration

### Install via Smithery (Recommended)

If you're using Claude Desktop, you can quickly install via [Smithery](https://smithery.ai/server/@guangxiangdebizi/finance-mcp):

```bash
npx -y @smithery/cli install @guangxiangdebizi/finance-mcp --client claude
```

### Manual Installation

1. **Get the Code**
   ```bash
   git clone https://github.com/guangxiangdebizi/FinanceMCP.git
   cd FinanceMCP
   ```

2. **Install Dependencies**
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

4. **Build the Project**
   ```bash
   npm run build
   ```

## 🚀 Starting the Server

There are two ways to start the server:

### Method 1: Using stdio mode (Direct execution)

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

Add the following content to Claude's configuration file:

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
        "money_flow",
        "margin_trade"
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
        "money_flow",
        "margin_trade"
      ]
    }
  }
}
```

## 💡 Usage Examples

After configuration, you can ask Claude about financial data in natural language:

### Basic Queries
- **Stock Data**: "Query Apple Inc. (AAPL) stock price data for the past month"
- **Financial News**: "Search for the latest news about Tesla"
- **Corporate Finance**: "Show Ping An Bank's recent financial statements"
- **Fund Data**: "Query CSI 300 ETF basic information and NAV trends"
- **Macro Data**: "Get the latest GDP and CPI data"

### Technical Indicator Analysis
- **Single Indicator Analysis**: "Calculate Ping An Bank (000001.SZ) MACD indicator with parameters (12,26,9)"
- **Multiple Indicator Combination**: "Analyze Kweichow Moutai (600519.SH) technical status, calculate MACD(12,26,9), RSI(14), KDJ(9,3,3)"
- **Moving Average System**: "Check CATL (300750.SZ) MA(5), MA(10), MA(20), MA(60) four moving averages"
- **Bollinger Bands Analysis**: "Analyze BYD (002594.SZ) Bollinger Bands BOLL(20,2) technical pattern"

### Advanced Comprehensive Analysis
- **Technical + Fundamental**: "Comprehensive analysis of CATL: financial status, technical indicators MACD and RSI, capital flow, latest news"
- **Multi-Market Comparison**: "Compare A-share, US stock, and Hong Kong stock market performance, including major indices and technical indicators"
- **Risk Assessment**: "Assess specific stock margin trading risks, including capital flow and technical signals"

### Special Data Queries
- **Block Trading**: "Query recent block trading activities of Kweichow Moutai"
- **Capital Flow**: "Analyze CATL's main capital flow trends"
- **Convertible Bonds**: "Query Ping An convertible bond basic information and conversion status"

Claude will automatically call the appropriate tools and provide comprehensive analysis based on the retrieved data.

## 📊 Data Interface Support

The project currently integrates the following Tushare API interfaces:

### Market Data Interfaces
| Function | Tushare Interface | Description |
|------|-------------|-----|
| Current Timestamp | current_timestamp | Get current UTC+8 time information ⭐️ |
| A-share Data | daily | Get A-share daily market data + technical indicators |
| US Stock Data | us_daily | Get US stock daily market data + technical indicators |
| Hong Kong Stock Data | hk_daily | Get Hong Kong stock daily market data + technical indicators |
| Forex Data | fx_daily | Get forex daily market data + technical indicators ⭐️ Fixed |
| Futures Data | fut_daily | Get futures daily market data + technical indicators |
| Fund Data | fund_daily | Get fund daily market data + technical indicators |
| Bond Repo | repo_daily | Get bond repo daily market data + technical indicators |
| Convertible Bonds | cb_daily | Get convertible bond daily market data + technical indicators |
| Options Data | opt_daily | Get options daily market data + technical indicators |
| Index Data | index_daily | Get index daily market data |

### Macroeconomic Interfaces
| Function | Tushare Interface | Description |
|------|-------------|-----|
| Financial News | Search API | Intelligent search of mainstream financial website news ⭐️ |
| Shibor Rate | shibor_data | Get Shanghai Interbank Offered Rate |
| LPR Rate | lpr_data | Get Loan Prime Rate |
| GDP | cn_gdp | Get Gross Domestic Product data |
| CPI | cn_cpi | Get Consumer Price Index data |
| PPI | cn_ppi | Get Producer Price Index data ⭐️ Fixed |
| Money Supply | cn_m | Get money supply data (M0, M1, M2) |
| PMI Index | cn_pmi | Get Purchasing Managers Index data ⭐️ Optimized |
| Social Financing | cn_sf | Get social financing scale data |
| Shibor Quote | shibor_quote | Get Shibor bank quote data (bid/ask prices) |
| Libor Rate | libor | Get London Interbank Offered Rate |
| Hibor Rate | hibor | Get Hong Kong Interbank Offered Rate |

### Corporate Finance Interfaces
| Function | Tushare Interface | Description |
|------|-------------|-----|
| Income Statement | income | Get listed company income statement data ⭐️ Integrated |
| Balance Sheet | balancesheet | Get listed company balance sheet data ⭐️ Integrated |
| Cash Flow Statement | cashflow | Get listed company cash flow statement data ⭐️ Integrated |
| Performance Forecast | forecast | Get listed company performance forecast data |
| Express Report | express | Get listed company express report data |
| Financial Indicators | fina_indicator | Get listed company financial indicator data |
| Dividend Distribution | dividend | Get listed company dividend distribution data |
| Main Business | fina_mainbz | Get main business composition data |
| Shareholder Count | stk_holdernumber | Get shareholder count data |
| Shareholder Trading | stk_holdertrade | Get shareholder trading data |
| Management Info | stk_managers | Get listed company management information |
| Financial Audit | audit | Get financial audit opinion data |
| Company Basic Info | company_basic | Get company basic information |

### Fund Data Interfaces
| Function | Tushare Interface | Description |
|------|-------------|-----|
| Fund List | fund_basic | Get public fund basic information ⭐️ Optimized |
| Fund NAV | fund_nav | Get fund net asset value data ⭐️ Optimized |
| Fund Dividends | fund_div | Get fund dividend distribution data ⭐️ Fixed |
| Fund Holdings | fund_portfolio | Get fund holdings details ⭐️ Optimized |
| Fund Manager | fund_manager | Get fund manager information ⭐️ Independent tool |

### Other Professional Interfaces
| Function | Tushare Interface | Description |
|------|-------------|-----|
| Convertible Bond Basic Info | cb_basic | Get convertible bond basic information ⭐️ |
| Convertible Bond Issuance | cb_issue | Get convertible bond issuance data ⭐️ |
| Block Trade | block_trade | Get block trade data ⭐️ New |
| Money Flow | moneyflow | Get individual stock and market money flow data ⭐️ New |
| Margin Trading Targets | margin_secs | Get margin trading target stocks (Shanghai/Shenzhen/Beijing) ⭐️ New |
| Margin Trading Summary | margin | Get margin trading summary data ⭐️ New |
| Margin Trading Details | margin_detail | Get margin trading detail data ⭐️ New |
| Market Maker Lending | slb_len_mm | Get market maker lending data ⭐️ New |

## 🔮 Future Plans

Future plans include integrating more Tushare data interfaces, including but not limited to:

1. **More Technical Indicators** - Extended versions of BOLL, MACD, RSI, custom technical indicators ⭐️ Partially implemented
2. **Basic Data** - Stock lists, trading calendars, suspension/resumption information, etc.
3. **More Financial Data** - Financial audit opinions, main business composition, shareholder information, etc. ⭐️ Partially implemented
4. **More News Data** - Announcement information, research report data, etc. ⭐️ Partially implemented
5. **Industry Data** - Industry classification, industry indices, industry comparative analysis, etc.
6. **Derivatives Data** - More options and futures contract data
7. **Alternative Data** - ESG ratings, institutional research, shareholder meetings, etc.

See the `tushare-interfaces.md` file for more potentially integrated data interfaces.

## 📈 Latest Updates

### v1.0.0 Major Updates
- ✅ **⭐ Complete Technical Indicator System Implementation** - MACD/RSI/KDJ/BOLL/MA five core indicators with smart data pre-fetching mechanism
- ✅ **Mandatory Parameter Design** - All technical indicators must explicitly specify parameters, ensuring calculation consistency
- ✅ **Modular Architecture** - Parameter parsing, data calculation, and indicator engines completely decoupled
- ✅ **9 Major Markets Full Coverage** - A-shares/US stocks/HK stocks/Forex/Futures/Funds/Bonds/Options all support technical indicators
- ✅ **Three Financial Statements Integration** - Income statement, balance sheet, cash flow statement fully integrated into company_performance tool
- ✅ **Smart Data Filtering** - Automatically filters empty fields, only displays items with actual data
- ✅ **Fund Data Optimization** - Query performance improved by 85%, fund manager query functionality split from independent tool
- ✅ **Forex Data Fix** - Fixed forex field mapping errors, correctly displays bid/ask prices
- ✅ **PPI Data Fix** - Fixed PPI field mapping bug, correctly displays Producer Price Index
- ✅ **New Block Trade Tool** - Supports individual stock and market-wide block trade data queries
- ✅ **New Money Flow Tool** - Supports individual stock and market money flow analysis
- ✅ **New Margin Trading Tool** - Supports comprehensive analysis of margin balance and securities lending data
- ✅ **Chinese Localization Optimization** - Comprehensive Chinese localization for macroeconomic modules
- ✅ **Batch Display Optimization** - Smart batch display for large data tables, improving readability

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- Name: Xingyu Chen (陈星宇)
- Email: guangxiangdebizi@gmail.com
- GitHub: [guangxiangdebizi](https://github.com/guangxiangdebizi)

## 🤝 Contributing

Issues and Pull Requests are welcome to improve this project!

## ⭐ Support the Project

If this project helps you, please give us a Star! Your support is our motivation for continuous improvement.
