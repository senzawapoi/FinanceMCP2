[![中文版](https://img.shields.io/badge/中文-README.md-red?logo=github)](README.md)

# FinanceMCP - Professional Financial Data MCP Server 🚀

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

**Professional financial data server based on MCP protocol, integrating Tushare API to provide real-time financial data and technical indicator analysis for Claude and other AI assistants.**

## 📑 Table of Contents

- [🌟 Public Cloud Service (Free)](#-public-cloud-service-free)
- [⚡ Core Features](#-core-features)
- [🛠️ Tool Overview](#️-tool-overview)
- [🎯 Technical Highlights](#-technical-highlights)
- [🚀 Quick Start](#-quick-start)
- [💡 Example Queries](#-example-queries)
- [🔧 Local Deployment](#-local-deployment)
- [🆕 What's New](#-whats-new)
- [📄 License](#-license)

## 🌟 Public Cloud Service (Free)

**🎉 Ready to use, no deployment needed!**

We provide multiple free public cloud service options:

### 🌐 Web Online Experience
**🚀 The simplest way to get started!**

Visit our online experience website: **[http://106.14.205.176:3222/](http://106.14.205.176:3222/)**

- ✨ **Zero Configuration Experience** - No setup required, just open and use
- 🤖 **Integrated AI Model** - Chat directly with AI assistant for financial analysis
- 💬 **Intelligent Interaction** - Natural language queries for real-time financial data
- 📱 **Multi-device Support** - Compatible with desktop, mobile, and tablet

> ⚠️ **Service Notice**: This is a personal small server. Please use responsibly and do not attack or abuse the service.

### ⚙️ Claude Desktop Configuration
You can also configure directly in Claude without local installation or API keys:

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

**Service Benefits:**
- ✅ **Zero Configuration** - No registration or API keys needed
- ✅ **24/7 Availability** - Server runs continuously
- ✅ **Full Features** - All 13 tools and technical indicators
- ✅ **Real-time Data** - Connected to Tushare professional data

> 📺 **Tutorial Video**: [Complete FinanceMCP Usage Guide](https://www.bilibili.com/video/BV1qeNnzEEQi/)

## ⚡ Core Features

### 🧠 Intelligent Technical Indicator System
- **Smart Data Pre-fetching** - Automatically calculates required historical data, eliminates NaN values
- **Mandatory Parameterization** - Requires explicit parameter specification (e.g., `macd(12,26,9)`) for accuracy
- **Modular Architecture** - Parameter parsing, data calculation, and indicator engine fully decoupled
- **5 Core Indicators** - MACD, RSI, KDJ, BOLL, MA

### 🌍 Comprehensive Market Coverage
- **9 Major Markets** - A-shares, US stocks, HK stocks, forex, futures, funds, bonds, options
- **Real-time News** - Smart search across 7+ major financial media
- **Macro Data** - 11 economic indicators (GDP, CPI, PPI, PMI, etc.)
- **Company Analysis** - Financial statements, management info, shareholder structure

## 🛠️ Tool Overview

| Tool Name | Function Description | Core Features |
|-----------|---------------------|---------------|
| 🕐 **current_timestamp** | Current timestamp | UTC+8 timezone, multiple output formats |
| 📰 **finance_news** | Financial news search | Smart keyword search, 7+ media sources |
| 📈 **stock_data** | Stock + technical indicators | 9 markets + 5 technical indicators, smart pre-fetching |
| 📊 **index_data** | Index data | Major market indices historical data |
| 📉 **macro_econ** | Macroeconomic data | 11 indicators: GDP/CPI/PPI/PMI/Shibor, etc. |
| 🏢 **company_performance** | Company financial analysis | Financial statements + management + fundamentals, 13 data types |
| 🏛️ **company_performance_hk** | Hong Kong stocks financial analysis | HK stocks income statement, balance sheet, cash flow statement |
| 💰 **fund_data** | Fund data | NAV/holdings/dividends, 85% performance optimized |
| 👨‍💼 **fund_manager_by_name** | Fund manager query | Personal background, managed funds list |
| 🪙 **convertible_bond** | Convertible bond data | Basic info + issuance data + conversion terms |
| 🔄 **block_trade** | Block trade data | Trade details + counterparty information |
| 💹 **money_flow** | Money flow data | Main/super-large/large/medium/small order flow analysis |
| 💰 **margin_trade** | Margin trading data | 4 APIs: eligible stocks/summary/details/securities lending |

## 🎯 Technical Highlights

### Intelligent Technical Indicator Engine
```
User Request → Parameter Parsing → Data Requirement Calculation → Extended Historical Data Fetch → Indicator Calculation → Result Return
```

**Supported Indicators:**
- **MACD** `macd(12,26,9)` - Trend analysis
- **RSI** `rsi(14)` - Overbought/oversold judgment
- **KDJ** `kdj(9,3,3)` - Stochastic oscillator
- **BOLL** `boll(20,2)` - Bollinger Bands
- **MA** `ma(5/10/20/60)` - Moving averages

### Core Technical Advantages
1. **Smart Pre-fetching** - Automatically calculates and fetches additional historical data needed for indicators
2. **Parameter Enforcement** - Avoids calculation differences caused by default parameters
3. **High Performance** - Fund data query performance improved 85% (5.2s→0.8s)
4. **Data Integration** - Seamless integration of 43+ Tushare API endpoints

## 🚀 Quick Start

### 1. Use Public Cloud Service (Recommended)
Copy the JSON configuration above to your Claude Desktop config file, restart Claude and start using!

### 2. Configuration File Location
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

### 3. Start Using
After configuration, simply ask questions directly in Claude!

## 💡 Example Queries

<details>
<summary><strong>📈 Stock Technical Analysis</strong></summary>

```
"Analyze Moutai (600519.SH) technical status, calculate MACD(12,26,9), RSI(14), KDJ(9,3,3)"
"Check CATL (300750.SZ) Bollinger Bands BOLL(20,2) and four moving averages MA(5,10,20,60)"
"Apple Inc. (AAPL) stock trend and MACD indicator analysis for the past month"
```

</details>

<details>
<summary><strong>📊 Comprehensive Analysis</strong></summary>

```
"Comprehensive analysis of BYD: financial status, technical indicators, money flow, latest news"
"Compare performance of A-shares, US stocks, and HK stocks markets including major indices and technical indicators"
"Evaluate CATL's investment value: fundamentals + technicals + money flow"
```

</details>

<details>
<summary><strong>📰 News & Macro</strong></summary>

```
"Search latest policies and market dynamics for new energy vehicle sector"
"Analyze current macroeconomic situation: GDP, CPI, PPI, PMI data"
"Fed rate hike impact on Chinese stock market, related news and data"
```

</details>

<details>
<summary><strong>💰 Funds & Bonds</strong></summary>

```
"Query CSI 300 ETF latest NAV and holdings structure"
"Analyze Zhang Kun's fund performance"
"Convertible bond market overview and investment opportunities"
```

</details>

<details>
<summary><strong>🏛️ Hong Kong Stocks</strong></summary>

```
"Get Tencent Holdings (00700.HK) 2024 income statement with key financial ratios"
"Analyze Alibaba (09988.HK) balance sheet and financial structure"
"Compare China Construction Bank (00939.HK) cash flow performance over multiple periods"
```

</details>

## 🔧 Local Deployment

<details>
<summary><strong>🛠️ Complete Local Deployment Guide</strong></summary>

If you need local deployment, follow these steps:

### Environment Requirements
- **Node.js >= 18** - Download from [nodejs.org](https://nodejs.org/)
- **Tushare API Token** - Get from [tushare.pro](https://tushare.pro)

<details>
<summary><strong>📝 Getting Tushare API Token</strong></summary>

1. **Register Account** - Visit [tushare.pro](https://tushare.pro/register) to register
2. **Get Token** - Obtain API Token from personal center
3. **Points Information** - Some advanced data requires points

**Student Benefits** - Apply for 2000 free points:
- Follow Tushare official Xiaohongshu and interact
- Join student QQ group: **290541801**
- Complete personal information (school email/student ID)
- Submit application materials to administrators

</details>

### Installation Steps

#### Method 1: Install via Smithery (Recommended)
```bash
npx -y @smithery/cli install @guangxiangdebizi/finance-mcp --client claude
```

#### Method 2: Manual Installation
```bash
# 1. Clone the repository
git clone https://github.com/guangxiangdebizi/FinanceMCP.git
cd FinanceMCP

# 2. Install dependencies
npm install

# 3. Configure API key
echo "TUSHARE_TOKEN=your_token_here" > .env
# Or edit src/config.ts directly

# 4. Build the project
npm run build
```

### Start Server

**Method 1: Direct run (stdio mode)**
```bash
node build/index.js
```

**Method 2: Use Supergateway (recommended for development)**
```bash
npx supergateway --stdio "node build/index.js" --port 3100
```

### Claude Configuration

Configuration file locations:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

#### Configuration 1: stdio mode
```json
{
  "mcpServers": {
    "finance-data-server": {
      "command": "node",
      "args": ["C:/path/to/FinanceMCP/build/index.js"],
      "disabled": false,
      "autoApprove": [
        "current_timestamp",
        "finance_news",
        "stock_data",
        "index_data",
        "macro_econ",
        "company_performance",
        "company_performance_hk",
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

#### Configuration 2: Supergateway mode (if using port 3100)
```json
{
  "mcpServers": {
    "finance-data-server": {
      "url": "http://localhost:3100/sse",
      "type": "sse",
      "disabled": false,
      "timeout": 600,
      "autoApprove": [
        "current_timestamp",
        "finance_news",
        "stock_data",
        "index_data",
        "macro_econ",
        "company_performance",
        "company_performance_hk",
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

### Verify Installation
After configuration, restart Claude Desktop and ask: "Get current time". If it returns time information, the installation is successful.

</details>

## 🆕 What's New

### 🏛️ Hong Kong Stocks Financial Analysis Module

**Latest Addition**: We've added comprehensive Hong Kong stocks financial analysis capabilities!

<details>
<summary><strong>📊 New Features</strong></summary>

- **🏛️ company_performance_hk** - Dedicated Hong Kong stocks financial analysis tool
- **📈 Income Statement Analysis** - Revenue, profit margins, earnings per share, comprehensive income
- **💰 Balance Sheet Analysis** - Assets, liabilities, equity structure with key financial ratios  
- **💸 Cash Flow Analysis** - Operating, investing, financing activities with free cash flow calculation
- **🎯 Smart Data Processing** - Automatic financial ratio calculations and multi-period comparisons
- **🌟 Enhanced User Experience** - Structured tables, intelligent categorization, and trend analysis

**Supported Companies**: All Hong Kong Stock Exchange listed companies including Tencent (00700.HK), Alibaba (09988.HK), China Construction Bank (00939.HK), and more.

**API Integration**: Based on [Tushare Hong Kong stocks financial data API](https://tushare.pro/document/2?doc_id=389) with full data format optimization.

</details>

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**👨‍💻 Author**: Xingyu Chen (陈星宇)  
**📧 Email**: guangxiangdebizi@gmail.com  
**🔗 GitHub**: [guangxiangdebizi](https://github.com/guangxiangdebizi)

⭐ If this project helps you, please give us a Star! 