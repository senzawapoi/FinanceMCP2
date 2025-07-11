# FinanceMCP - Professional Financial Data MCP Server 🚀

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

Welcome to **FinanceMCP** - A professional financial data server based on Model Context Protocol (MCP)! This project integrates **Tushare API** to provide comprehensive real-time financial data access capabilities for language models (like Claude), supporting multi-dimensional financial data analysis including stocks, funds, bonds, macroeconomic indicators, and more.

## 📺 Video Tutorial

**🎥 Complete Usage Guide**: [FinanceMCP - Comprehensive Financial Data Query MCP Based on Tushare API](https://www.bilibili.com/video/BV1qeNnzEEQi/?share_source=copy_web&vd_source=9dab1cef4f662ff8e4e4a96790c3417c)

Watch our detailed bilibili video tutorial to learn how to:
- 🔧 Install and configure FinanceMCP
- 📊 Query various types of financial data
- 💡 Use advanced features and analytics capabilities
- 🔗 Integrate with Claude and other MCP clients

## ⭐ Core Features

### 🧠 Intelligent Technical Indicator System
- **Smart Data Pre-fetching Mechanism** - Automatically calculates and fetches additional historical data required for indicators, completely solving the initial `NaN` value problem in technical indicators
- **Mandatory Parameterization Design** - Requires users to explicitly specify parameters for all indicators (like `macd(12,26,9)`), ensuring calculation accuracy and consistency
- **Modular Architecture** - Parameter parsing, data calculation, and indicator engine are completely decoupled for easy extension and maintenance
- **5 Core Indicators** - MACD, RSI, KDJ, BOLL, MA, strictly implemented according to recognized algorithms in the financial field

### 🔄 Integrated Data Service
- **Single Call Retrieval** - Get both market data and technical indicator calculation results in one API call
- **Multi-Market Coverage** - A-shares, US stocks, Hong Kong stocks, forex, futures, funds, bonds, options, and 9 major markets
- **Real-time News Integration** - Intelligent financial news search covering 7+ mainstream media sources
- **Comprehensive Financial Analysis** - Three major financial statements, operational indicators, shareholder structure, and 13 types of corporate data

## 🔧 MCP Client Configuration

To use this server with Claude or other MCP clients, you have the following configuration options:

### 🌐 Public Cloud Service Configuration (Recommended - No Local Deployment Required!)

**🎉 Public Cloud Service** - We have deployed FinanceMCP service on the public cloud, which you can use directly without local installation and configuration!

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

**📋 Service Description:**
- ✅ **Easy to Use** - No registration or API Key required, quick start experience
- ✅ **Ready to Use** - No local deployment needed, works immediately after configuration
- ✅ **Stable Operation** - 24/7 stable operation with regular maintenance
- ✅ **Full Features** - Supports all 12 financial tools and technical indicators

**⚠️ Important Notice:**
> 🧪 **Test Service Statement**: This service is for feature demonstration and testing experience, using my personal Tushare API quota. We welcome everyone to use it and provide testing feedback and improvement suggestions. Please use it reasonably and **strictly prohibit malicious attacks or abuse of server resources**. If the service is unstable or interrupted, you can always choose local deployment for better stability.

**🙏 Usage Recommendations:**
- Please control query frequency reasonably, avoid high-frequency bulk requests
- Recommended to use this public service for feature experience and testing
- Welcome to provide feedback and improvement suggestions during usage
- For production environment use, local deployment is recommended to ensure stability

---

### 💻 Local Deployment Configuration

If you prefer complete autonomous control, you can choose local deployment:

For detailed local deployment instructions, installation, and configuration, please refer to the Chinese README (README_CN.md) which contains comprehensive setup guides.

## 💡 Usage Examples

After configuration, you can ask Claude about financial data in natural language:

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

## 🎯 Tool Overview

This server provides **12 professional financial tools**:

| Tool Name | Function Description | Key Features |
|-----------|---------------------|--------------|
| 🕐 **current_timestamp** | Current timestamp tool | UTC+8 timezone, multiple formats, Chinese weekday display |
| 📰 **finance_news** | Financial news search | Smart keyword search, 7+ media sources coverage |
| 📈 **stock_data** | Stock + Technical indicators | **⭐ Core Feature**: 9 markets + technical indicators with smart data pre-fetching |
| 📊 **index_data** | Index data query | Major market indices historical data |
| 📉 **macro_econ** | Macroeconomic data | 11 indicators: Shibor/LPR/GDP/CPI/PPI/Money supply/PMI/etc. |
| 🏢 **company_performance** | Company financial analysis | Financial statements + management info + 13 data types |
| 💰 **fund_data** | Fund data query | Fund list/NAV/dividends/holdings/performance, 85% optimized |
| 👨‍💼 **fund_manager_by_name** | Fund manager query | Personal background, tenure, managed funds list |
| 🪙 **convertible_bond** | Convertible bond data | Basic info + issuance data |
| 🔄 **block_trade** | Block trade data | Trading details + counterparties + market statistics |
| 💹 **money_flow** | Capital flow data | Main force/super large/large/medium/small order flows |
| 💰 **margin_trade** | Margin trading data | 4 APIs: targets + trading summary/details + securities lending |

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- Name: Xingyu Chen (陈星宇)
- Email: guangxiangdebizi@gmail.com
- GitHub: [guangxiangdebizi](https://github.com/guangxiangdebizi)

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve this project!

## ⭐ Support the Project

If this project is helpful to you, please give us a Star! Your support is our motivation for continuous improvement.

---

## 📖 中文文档

For complete Chinese documentation, installation guides, and detailed usage instructions, please see [README_CN.md](README_CN.md).

完整的中文文档、安装指南和详细使用说明，请查看 [README_CN.md](README_CN.md).
