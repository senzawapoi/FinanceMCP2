# FinanceMCP Financial Data Server

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

Welcome to **FinanceMCP Financial Data Server**! This project provides a Model Context Protocol (MCP) based server that enables language models (like Claude) to access real-time financial data through the **Tushare API**. This allows AI assistants to perform financial analysis and predictions based on the latest market information.

## 🌟 Features

### 📈 Stock Data Query
Get historical market data for specified stock codes, supporting:
* **A-shares** (Shanghai & Shenzhen) - e.g., Ping An Bank (000001.SZ)
* **US Stocks** (NASDAQ, NYSE, etc.) - e.g., Apple (AAPL)
* **Hong Kong Stocks** (HKEX) - e.g., Tencent (00700.HK)
* **Forex** (Major currency pairs) - e.g., USD/CNY (USDCNY)
* **Futures** (Commodity & financial futures) - e.g., Copper Futures (CU2501.SHF)
* **Funds** (ETFs, LOFs, etc.) - e.g., CSI 300 ETF (159919.SZ)
* **Bond Repos** (Government & corporate bonds) - e.g., GC001 (204001.SH)
* **Convertible Bonds** (Including conversion value, premium) - e.g., Ping An CB (113008.SH)
* **Options** (Stock & index options) - e.g., 50ETF Options (10001313.SH)

### 📊 Index Data Query
Get data for major market indices like Shanghai Composite Index, Shenzhen Component Index, etc.

### 📰 Financial News Retrieval ⭐️ Fully Optimized
Get the latest financial news data, supporting two types of news:

#### News Flash (High-frequency short news)
* **Supported Sources**: Sina Finance, Wallstreetcn, 10jqka, Eastmoney, Yuncaijing, Phoenix News, JRJ
* **Data Features**: Real-time flash news, concise and clear
* **Retrieval Limit**: Maximum 1500 articles per request
* **Update Frequency**: Real-time updates

#### Long-form Financial News (In-depth reports)
* **Supported Sources**: Xinhua, Phoenix Finance, 10jqka, Sina Finance, Wallstreetcn, cs.com.cn
* **Data Features**: In-depth analysis, detailed content
* **Retrieval Limit**: Maximum 400 articles per request
* **Rich Content**: Complete news content included

#### News Feature Highlights
* **Flexible Time Range**: Support custom time periods or retrieval by hours
* **Smart Formatting**: News content displayed in structured format with time, source, category info
* **Multi-source Integration**: Covers mainstream financial media with authoritative sources
* **Content Preview**: Long-form news provides content preview for quick filtering

### 🏢 Company Financial Performance Analysis
Get comprehensive financial data for listed companies, including:
* **Income Statement** (Operating revenue, net profit, gross margin, etc.)
* **Balance Sheet** (Total assets, liabilities, shareholders' equity, etc.)
* **Cash Flow Statement** (Operating, investing, financing cash flows)
* **Earnings Forecast** (Net profit change predictions, forecast types)
* **Earnings Express** (Quick financial data, year-over-year growth rates)
* **Financial Indicators** (ROE, ROA, current ratio, debt-to-asset ratio, etc.)
* **Dividends & Stock Distribution** (Cash dividends, stock splits, key dates)

### 🏦 Comprehensive Fund Data Query ⭐️ New Feature
* **Fund List** (Basic fund info, investment types, management fees, etc.)
* **Fund Managers** (Fund company info, establishment date, registered capital, etc.)
* **Fund Managers Info** (Manager profiles, tenure, managed funds, etc.)
* **Fund Net Value** (Unit NAV, cumulative NAV, adjusted NAV, etc.)
* **Fund Dividends** (Dividend plans, cash dividends, ex-dividend dates, etc.)
* **Fund Holdings** (Heavy positions, market value, shareholding ratios, etc.)

### 📈 Macroeconomic Data ⭐️ Fully Optimized
Get the following macroeconomic indicator data:
* **Shibor Rates** (Shanghai Interbank Offered Rate)
* **LPR Rates** (Loan Prime Rate)
* **GDP** (Gross Domestic Product)
* **CPI** (Consumer Price Index)
* **PPI** (Producer Price Index)
* **Money Supply** (M0, M1, M2)
* **PMI** (Purchasing Managers' Index for manufacturing, services, composite) - Including 30+ detailed sub-indices
* **Total Social Financing**
* **Shibor Bank Quotes** (Bid price, ask price)
* **Libor Rates** (London Interbank Offered Rate)
* **Hibor Rates** (Hong Kong Interbank Offered Rate)

### 🤖 MCP Integration
Seamless integration with MCP-compatible clients (like Claude) for intelligent financial analysis

## 🚦 Requirements

Before getting started, please ensure you have:

1. **Node.js and npm**:
   * Requires Node.js version >= 18
   * Download and install from [nodejs.org](https://nodejs.org/)

2. **Tushare API Token**:
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

1. **Get the code**:
   ```bash
   git clone https://github.com/guangxiangdebizi/FinanceMCP.git
   cd FinanceMCP
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Tushare API Token**:
   * Create a `.env` file in the project root directory
   * Add the following content:
     ```
     TUSHARE_TOKEN=Your_Tushare_API_Token
     ```
   * Or set it directly in the `src/config.ts` file

4. **Build the project**:
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
        "finance_news",
        "stock_data",
        "index_data",
        "macro_econ",
        "company_performance",
        "fund_data"
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
        "finance_news",
        "stock_data",
        "index_data",
        "macro_econ",
        "company_performance",
        "fund_data"
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
> "Query USD/CNY (USDCNY) recent exchange rate trends"

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

This will use the `stock_data` tool to retrieve corresponding market stock data.

### 2. Get Financial News ⭐️ Fully Optimized

You can ask Claude:

**Get Flash News:**
> "Get the latest 10 Sina Finance flash news"
> "Get Wallstreetcn financial flash news from the past 6 hours"
> "Get today's financial news from 10jqka"

**Get Long-form News:**
> "Get long-form financial reports from Xinhua"
> "Get in-depth financial analysis articles from Phoenix Finance"
> "Get long-form news from cs.com.cn from the past 3 days"

**Specify Time Range:**
> "Get Eastmoney news from 2024-01-01 09:00:00 to 2024-01-01 18:00:00"

**Multi-source Comparison:**
> "Get the latest flash news from both Sina Finance and Wallstreetcn for comparative analysis"

This will use the `finance_news` tool to retrieve corresponding news types and sources.

### 3. Query Macroeconomic Data

You can ask Claude:
> "Query GDP data for the last two years"
> "Query the latest detailed PMI Purchasing Managers Index data"

This will use the `macro_econ` tool to retrieve GDP and PMI data.

### 4. Query Company Financial Performance

You can ask Claude:

**Query Single Financial Data:**
> "Query Ping An Bank (000001.SZ) recent income statement data"
> "Query Tencent Holdings (00700.HK) balance sheet"
> "Query Apple Inc. (AAPL) cash flow statement"

**Query Earnings Forecasts and Express:**
> "Query Kweichow Moutai (600519.SH) earnings forecast"
> "Query BYD (002594.SZ) earnings express"

**Query Financial Indicators:**
> "Query China Merchants Bank (600036.SH) financial indicators including ROE, ROA, etc."

**Query Dividends & Stock Distribution:**
> "Query China Ping An (601318.SH) dividend and stock distribution history"

**Query All Financial Data:**
> "Query Vanke A (000002.SZ) comprehensive financial performance data"

This will use the `company_performance` tool to retrieve corresponding financial data.

### 5. Query Fund Data ⭐️ New Feature

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

**Query Fund Managers:**
> "Query funds managed by Zhang Kun"
> "Query E Fund Management fund manager information"

**Query Fund Management Companies:**
> "Query detailed information about E Fund Management Co., Ltd."

**Query All Fund Data:**
> "Query all data for China AMC CSI 300 ETF (510330.SH)"

This will use the `fund_data` tool to retrieve corresponding fund data.

### 6. Combined Data Analysis

You can ask Claude more complex questions:
> "Combine recent news and stock price data to analyze Ping An Bank (000001.SZ) investment prospects"
> "Combine macroeconomic PMI data and manufacturing stock performance to analyze current manufacturing investment opportunities"

Claude will call multiple tools to get the required data, then provide analysis based on this data.

## 📊 Supported Data Interfaces

The project currently integrates the following Tushare API interfaces:

| Function | Tushare Interface | Description |
|----------|-------------------|-------------|
| A-share Data | daily | Get A-share daily market data |
| US Stock Data | us_daily | Get US stock daily market data |
| HK Stock Data | hk_daily | Get Hong Kong stock daily market data |
| Forex Data | fx_daily | Get forex daily market data |
| Futures Data | fut_daily | Get futures daily market data |
| Fund Data | fund_daily | Get fund daily market data |
| Index Data | index_daily | Get index daily market data |
| News Flash | news | Get flash news from mainstream financial websites ⭐️ |
| Long-form News | major_news | Get long-form news ⭐️ New |
| Shibor Rates | shibor_data | Get Shanghai Interbank Offered Rate |
| LPR Rates | lpr_data | Get Loan Prime Rate |
| GDP | cn_gdp | Get Gross Domestic Product data |
| CPI | cn_cpi | Get Consumer Price Index data |
| PPI | cn_ppi | Get Producer Price Index data |
| Money Supply | cn_m | Get money supply data (M0, M1, M2) |
| PMI Index | cn_pmi | Get Purchasing Managers Index data ⭐️ Optimized |
| Social Financing | cn_sf | Get Total Social Financing data |
| Shibor Quotes | shibor_quote | Get Shibor bank quote data (bid, ask) |
| Libor Rates | libor | Get London Interbank Offered Rate |
| Hibor Rates | hibor | Get Hong Kong Interbank Offered Rate |
| Bond Repos | repo_daily | Get bond repo daily market data |
| Convertible Bonds | cb_daily | Get convertible bond daily market data |
| Options Data | opt_daily | Get options daily market data |
| Income Statement | income | Get listed company income statement data |
| Balance Sheet | balancesheet | Get listed company balance sheet data |
| Cash Flow Statement | cashflow | Get listed company cash flow statement data |
| Earnings Forecast | forecast | Get listed company earnings forecast data |
| Earnings Express | express | Get listed company earnings express data |
| Financial Indicators | fina_indicator | Get listed company financial indicator data |
| Dividends & Distribution | dividend | Get listed company dividend and distribution data |
| Fund List | fund_basic | Get public fund basic information |
| Fund NAV | fund_nav | Get fund net asset value data |
| Fund Dividends | fund_div | Get fund dividend and distribution data |
| Fund Holdings | fund_portfolio | Get fund holdings details |
| Fund Managers | fund_manager | Get fund manager information |
| Fund Management Companies | fund_company | Get fund management company information |

## 🔮 Future Plans

Future plans include integrating more Tushare data interfaces, including but not limited to:

1. **Basic Data**: Stock lists, trading calendars, suspension/resumption info, etc.
2. **More Financial Data**: Financial audit opinions, main business composition, shareholder info, etc.
3. **More News Data**: Announcement info, research report data, etc. ⭐️ Partially implemented
4. **Technical Analysis Indicators**: MACD, RSI, Bollinger Bands, and other technical indicators
5. **Industry Data**: Industry classification, industry indices, industry comparative analysis, etc.

See the `tushare-interfaces.md` file for more potential data interfaces that could be integrated.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- Name: Xingyu_Chen
- Email: guangxiangdebizi@gmail.com
- GitHub: [guangxiangdebizi](https://github.com/guangxiangdebizi)
