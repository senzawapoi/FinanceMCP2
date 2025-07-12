English version: see README_EN.md

[![English Version](https://img.shields.io/badge/English-README_EN.md-blue?logo=github)](README_EN.md)

# FinanceMCP - 专业金融数据MCP服务器 🚀

## 📑 目录（Table of Contents）
- [🌐 公网部署服务（推荐，无需本地部署！） ⭐ 推荐体验]((#公网部署服务推荐无需本地部署-⭐-推荐体验))
- [📺 视频教程](#视频教程)
- [⭐ 核心特性](#核心特性)
- [🎯 工具总览](#工具总览)
- [🎯 技术指标系统详解](#技术指标系统详解)
- [🔧 技术规格](#技术规格)
- [🎓 学生和教师免费积分获取](#学生和教师免费积分获取)
- [🛠️ 安装与配置](#安装与配置)
- [🚀 启动服务器](#启动服务器)
- [📝 配置MCP客户端](#配置mcp客户端)
- [💡 使用示例](#使用示例)
- [📊 数据接口支持](#数据接口支持)
- [🔮 未来规划](#未来规划)
- [📈 最新更新](#最新更新)
- [📄 许可证](#许可证)
- [👨‍💻 作者](#作者)
- [🤝 贡献](#贡献)
- [⭐ 支持项目](#支持项目)

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

欢迎使用 **FinanceMCP** - 基于模型上下文协议（MCP）的专业金融数据服务器！本项目通过集成 **Tushare API** 为语言模型（如Claude）提供全面的实时金融数据访问能力，支持股票、基金、债券、宏观经济指标等多维度金融数据分析。

## 📺 视频教程

**🎥 完整使用教程**：[FinanceMCP，基于tushare数据接口的金融数据全面查询的超级金融领域的MCP](https://www.bilibili.com/video/BV1qeNnzEEQi/?share_source=copy_web&vd_source=9dab1cef4f662ff8e4e4a96790c3417c)

观看我们详细的bilibili视频教程，学习如何：
- 🔧 安装和配置FinanceMCP
- 📊 查询各种类型的金融数据
- 💡 使用高级功能和分析能力
- 与Claude等MCP客户端集成

## ⭐ 核心特性

### 🧠 智能技术指标系统
- **智能数据预取机制** - 自动计算并获取指标所需的额外历史数据，彻底解决技术指标初期`NaN`值问题
- **强制参数化设计** - 要求用户为所有指标明确指定参数（如`macd(12,26,9)`），确保计算精确性和一致性
- **模块化架构** - 参数解析、数据计算、指标引擎完全解耦，易于扩展和维护
- **5种核心指标** - MACD、RSI、KDJ、BOLL、MA，严格按照金融领域公认算法实现

### 🔄 一体化数据服务
- **单次调用获取** - 在一次API调用中同时获取行情数据和技术指标计算结果
- **多市场覆盖** - A股、美股、港股、外汇、期货、基金、债券、期权等9大市场
- **实时新闻整合** - 智能财经新闻搜索，覆盖7+主流媒体源
- **全面财务分析** - 三大财务报表、经营指标、股东结构等13种企业数据类型

## 🎯 工具总览

本服务器提供 **12个专业金融工具**：

| 工具名称 | 功能描述 | 主要特性 |
|---------|---------|---------|
| 🕐 **current_timestamp** | 当前时间戳工具 | UTC+8时区，多种格式（datetime/date/time/timestamp/readable），中文星期显示 |
| 📰 **finance_news** | 财经新闻搜索 | 智能关键词搜索，覆盖7+媒体源（新浪、华尔街见闻、同花顺等），支持单/多关键词查询 |
| 📈 **stock_data** | 股票+技术指标查询 | **⭐ 核心功能**：A股/美股/港股/外汇/期货/基金/债券/期权 + 技术指标（MACD/RSI/KDJ/BOLL/MA）**智能数据预取** |
| 📊 **index_data** | 指数数据查询 | 主要市场指数（上证指数、深证成指等）历史数据 |
| 📉 **macro_econ** | 宏观经济数据 | 11种指标：Shibor/LPR/GDP/CPI/PPI/货币供应量/PMI(30+分项)/社融/Libor/Hibor |
| 🏢 **company_performance** | 公司财务分析 | 财务三表（利润/资产负债/现金流） + 管理层信息 + 公司基础 + 业绩数据（13种数据类型） |
| 💰 **fund_data** | 基金数据查询 | 基金列表/净值/分红/持仓/业绩，85%性能优化（5.2s→0.8s），自动整合份额数据 |
| 👨‍💼 **fund_manager_by_name** | 基金经理查询 | 个人背景、任职经历、管理基金列表、按经理姓名专业履历查询 |
| 🪙 **convertible_bond** | 可转债数据 | 基础信息（债券详情/交易/转股条款/债券条款） + 发行数据（网上/网下/承销） |
| 🔄 **block_trade** | 大宗交易数据 | 交易详情（价格/成交量/金额） + 交易双方（买卖营业部） + 市场统计 |
| 💹 **money_flow** | 资金流向数据 | 主力/超大单/大中小单资金流 + 个股分析 + 市场趋势统计 |
| 💰 **margin_trade** | 融资融券数据 | 4个API：融资融券标的（沪深京） + 交易汇总/明细 + 做市借券含库存数据 |

## 🎯 技术指标系统详解

### 核心设计理念
- **智能化 (Intelligence)** - 独创的智能数据预取机制，自动计算指标所需的历史数据长度
- **模块化 (Modularity)** - 参数解析、数据计算、指标引擎完全解耦的架构设计  
- **精确性 (Precision)** - 严格按照金融领域公认数学公式实现，确保计算结果准确可靠

### 技术架构流程

```
用户请求 → 参数解析 → 数据需求计算 → 扩展历史数据获取 → 指标计算引擎 → 数据合并 → 按用户日期过滤 → 返回结果
```

### 支持的技术指标

| 指标名称 | 参数格式 | 算法说明 | 数据需求 |
|---------|---------|---------|---------|
| **MACD** | `macd(12,26,9)` | 指数平滑异同移动平均线，分析趋势变化 | 需要 fast+slow+signal-1 天数据 |
| **RSI** | `rsi(14)` | 相对强弱指数，判断超买超卖状态 | 需要 period 天数据 |
| **KDJ** | `kdj(9,3,3)` | 随机指标，综合动量、强弱、移动平均优点 | 需要 n+m1+m2-2 天数据 |
| **BOLL** | `boll(20,2)` | 布林带，显示价格相对高低位置 | 需要 period 天数据 |
| **MA** | `ma(5)` / `ma(10)` / `ma(20)` / `ma(60)` | 移动平均线，平滑价格趋势 | 需要 period-1 天数据 |

### 使用示例

```bash
# 基础股票数据
"查询平安银行(000001.SZ)最近一个月的行情数据"

# 单个技术指标
"查询苹果公司(AAPL)的MACD指标，参数为(12,26,9)"

# 多个技术指标组合
"分析茅台(600519.SH)的技术状态，计算MACD(12,26,9)、RSI(14)、KDJ(9,3,3)和布林带(20,2)"

# 自定义时间范围 + 技术指标
"获取宁德时代(300750.SZ)从2024年1月1日到2024年6月30日的行情数据，并计算MA(5)、MA(20)、MA(60)三条均线"
```

## 🔧 技术规格

### 数据源
- **主要API** - [Tushare Pro](https://tushare.pro) 专业金融数据平台
- **覆盖范围** - 中国大陆市场、香港、美国市场及全球指数
- **已接入接口** - 覆盖 40+ 个 Tushare API 端点，分布于 12 个工具模块
- **更新频率** - 实时到日级别，根据数据类型而定
- **历史数据** - 大部分数据类型支持多年历史覆盖

### 支持的市场与工具
- **A股** - 上海证券交易所（SH）和深圳证券交易所（SZ）
- **港股** - 香港证券交易所（HK）
- **美股** - 纳斯达克、纽交所等美国交易所
- **债券** - 国债、企业债、可转债
- **基金** - ETF、共同基金、指数基金
- **衍生品** - 期货、期权、货币对
- **指数** - 主要市场指数和行业指数

### API接口映射
| 工具 | Tushare API | 描述 |
|------|-------------|-----|
| 🕐 时间戳 | `current_timestamp` | 当前时间信息 |
| 📰 财经新闻 | `搜索API` | 智能新闻搜索 |
| 📈 股票数据 | `daily`, `us_daily`, `hk_daily`, `fx_daily`, `fut_daily`, `fund_daily`, `repo_daily`, `cb_daily`, `opt_daily` | 9大市场股票数据 + 技术指标 |
| 📊 指数数据 | `index_daily` | 市场指数 |
| 📉 宏观经济 | `shibor`, `gdp`, `cpi`, `ppi`, `cn_m`, `cn_pmi`, `cn_sf`, `shibor_quote`, `libor`, `hibor` | 11种经济指标 |
| 🏢 公司财务 | `income`, `balancesheet`, `cashflow`, `stk_managers`, `forecast`, `express`, `fina_indicator`, `dividend`, `fina_mainbz` 等 | 财务报表+管理层信息 |
| 💰 基金数据 | `fund_basic`, `fund_nav`, `fund_div`, `fund_portfolio` | 基金信息 |
| 👨‍💼 基金经理 | `fund_manager` | 基金经理信息 |
| 🪙 可转债 | `cb_basic`, `cb_issue` | 可转债数据 |
| 🔄 大宗交易 | `block_trade` | 大宗交易数据 |
| 💹 资金流向 | `moneyflow` | 资金流向数据 |
| 💰 融资融券 | `margin_secs`, `margin`, `margin_detail`, `slb_len_mm` | 多个融资融券API |

## 🚦 环境要求

开始使用前，请确保您具备：

1. **Node.js 和 npm**
   * 需要 Node.js 版本 >= 18
   * 从 [nodejs.org](https://nodejs.org/) 下载安装

2. **Tushare API Token**
   * 访问 [tushare.pro](https://tushare.pro/register) 注册并获取API Token
   * 此Token用于访问Tushare提供的金融数据
   * 注意：部分高级数据需要积分权限

## 🎓 学生和教师免费积分获取

### 学生用户 - 获取2000免费积分

[Tushare](https://tushare.pro/document/1?doc_id=360) 为学生用户提供 **2000免费积分**，基本可以获取股票/指数/期货/期权/基金/转债的基础信息、日线行情和财报等数据。

**学生积分获取步骤：**

1. **关注小红书**
   - 搜索并关注Tushare数据官方小红书账号
   - 对任意帖子点赞及留言，填写数据需求和用途

2. **加入学生QQ群**
   - 搜索QQ群号：**290541801**
   - 加群时备注你的学校名称

3. **完善Tushare个人信息**
   - 登录 [tushare.pro](https://tushare.pro)
   - 在个人中心主页填写学校和个人信息
   - 邮箱栏请填写学校邮箱地址；如无学校邮箱，需拍学生证照片或学信网截图

4. **提交申请**
   - 将步骤1和3的截图，以及Tushare ID，在QQ群私信发给群主或管理员
   - 验证通过后即可获得2000积分

### 教师用户 - 获取5000免费积分

[Tushare](https://tushare.pro/document/1?doc_id=361) 为高校老师提供 **5000免费积分**，享受更高权限的数据服务和支持。

**教师积分获取步骤：**

1. **添加微信联系人**
   - 添加微信：**waditu_a**
   - 备注："XX大学老师"

2. **完善个人资料**
   - 登录 [tushare.pro](https://tushare.pro)
   - 在个人主页修改单位和个人信息
   - 通过微信或QQ提供您的Tushare ID

3. **学生积分模板（可选）**
   - 下载学生积分模板，用于批量学生注册
   - 安排学生统一填写模板并发送给Tushare联系人

## 🛠️ 安装与配置

### 通过Smithery安装（推荐）

如果您使用Claude Desktop，可通过 [Smithery](https://smithery.ai/server/@guangxiangdebizi/finance-mcp) 快速安装：

```bash
npx -y @smithery/cli install @guangxiangdebizi/finance-mcp --client claude
```

### 手动安装

1. **获取代码**
   ```bash
   git clone https://github.com/guangxiangdebizi/FinanceMCP.git
   cd FinanceMCP
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置Tushare API Token**
   * 在项目根目录创建 `.env` 文件
   * 添加以下内容：
     ```
     TUSHARE_TOKEN=您的Tushare_API_Token
     ```
   * 或直接在 `src/config.ts` 文件中设置

4. **构建项目**
   ```bash
   npm run build
   ```

## 🚀 启动服务器

有两种方式启动服务器：

### 方式1：使用stdio模式（直接运行）

```bash
node build/index.js
```

### 方式2：使用Supergateway（推荐用于开发）

```bash
npx supergateway --stdio "node build/index.js" --port 3100
```

## 📝 配置MCP客户端

要在Claude或其他MCP客户端中使用此服务器，您有以下几种配置选择：

### 🌐 公网服务配置（推荐，无需本地部署！）

**🎉 公网部署服务** - 我们在公网部署了FinanceMCP服务，您可以直接使用，无需本地安装和配置！

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

**📋 服务说明：**
- ✅ **便捷使用** - 无需注册和API Key，快速上手体验
- ✅ **即开即用** - 无需本地部署，配置后立即可用
- ✅ **稳定运行** - 24小时稳定运行，定期维护
- ✅ **完整功能** - 支持所有12个金融工具和技术指标

**⚠️ 重要提醒：**
> 🧪 **测试服务声明**：此服务用于功能展示和测试体验，使用的是我个人的Tushare API配额，欢迎大家使用后提供测试反馈和改进建议。请合理使用，**严禁恶意攻击或滥用服务器资源**。如果服务不稳定或中断，您可随时选择本地部署方案获得更好的稳定性。

**🙏 使用建议：**
- 请合理控制查询频率，避免高频大量请求
- 推荐优先使用此公网服务进行功能体验和测试
- 欢迎在使用过程中提供反馈和改进建议
- 如需生产环境使用，建议本地部署以确保稳定性

⭐ 推荐体验

### 💻 本地部署配置

如果您希望完全自主控制，可以选择本地部署：

#### Claude配置（本地Supergateway模式）

在Claude的配置文件中添加以下内容：

```json
{
  "mcpServers": {
    "finance-data-server": {
      "url": "http://localhost:3100/sse", // 如使用Supergateway
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

#### Claude配置（本地stdio模式）

如果直接使用stdio模式（不使用Supergateway），配置如下：

```json
{
  "mcpServers": {
    "finance-data-server": {
      "command": "C:/path/to/FinanceMCP/build/index.js", // 修改为实际路径
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

## 💡 使用示例

配置完成后，您可以用自然语言向Claude询问金融数据：

### 基础查询
- **股票数据**："查询苹果公司（AAPL）最近一个月的股价数据"
- **财经新闻**："搜索特斯拉的最新新闻"
- **公司财务**："显示平安银行最近的财务报表"
- **基金数据**："查询沪深300ETF基本信息和净值走势"
- **宏观数据**："获取最新的GDP和CPI数据"

### 技术指标分析
- **单指标分析**："计算平安银行(000001.SZ)的MACD指标，参数设为(12,26,9)"
- **多指标组合**："分析茅台(600519.SH)的技术状态，计算MACD(12,26,9)、RSI(14)、KDJ(9,3,3)"
- **均线系统**："查看宁德时代(300750.SZ)的MA(5)、MA(10)、MA(20)、MA(60)四条均线"
- **布林带分析**："分析比亚迪(002594.SZ)的布林带BOLL(20,2)技术形态"

### 高级综合分析
- **技术面+基本面**："全面分析宁德时代：财务状况、技术指标MACD和RSI、资金流向、最新新闻"
- **多市场对比**："比较A股、美股、港股市场表现，包括主要指数和技术指标"
- **风险评估**："评估特定股票的融资融券风险，包括资金流向和技术信号"

### 特殊数据查询
- **大宗交易**："查询贵州茅台最近的大宗交易情况"
- **资金流向**："分析宁德时代的主力资金流向趋势"
- **可转债**："查询平安转债的基本信息和转股情况"

Claude会自动调用相应工具，并基于获取的数据提供全面分析。

## 📊 数据接口支持

项目当前集成了以下Tushare API接口：

### 行情数据接口
| 功能 | Tushare接口 | 描述 |
|------|-------------|-----|
| 当前时间戳 | current_timestamp | 获取当前东八区时间信息 ⭐️ |
| A股数据 | daily | 获取A股日线行情数据 + 技术指标 |
| 美股数据 | us_daily | 获取美股日线行情数据 + 技术指标 |
| 港股数据 | hk_daily | 获取港股日线行情数据 + 技术指标 |
| 外汇数据 | fx_daily | 获取外汇日线行情数据 + 技术指标 ⭐️ 已修复 |
| 期货数据 | fut_daily | 获取期货日线行情数据 + 技术指标 |
| 基金数据 | fund_daily | 获取基金日线行情数据 + 技术指标 |
| 债券回购 | repo_daily | 获取债券回购日线行情数据 + 技术指标 |
| 可转债 | cb_daily | 获取可转债日线行情数据 + 技术指标 |
| 期权数据 | opt_daily | 获取期权日线行情数据 + 技术指标 |
| 指数数据 | index_daily | 获取指数日线行情数据 |

### 宏观经济接口
| 功能 | Tushare接口 | 描述 |
|------|-------------|-----|
| 财经新闻 | 搜索API | 智能搜索主流财经网站新闻 ⭐️ |
| Shibor利率 | shibor_data | 获取上海银行间同业拆放利率 |
| LPR利率 | lpr_data | 获取贷款市场报价利率 |
| GDP | cn_gdp | 获取国内生产总值数据 |
| CPI | cn_cpi | 获取居民消费价格指数数据 |
| PPI | cn_ppi | 获取工业生产者出厂价格指数数据 ⭐️ 已修复 |
| 货币供应量 | cn_m | 获取货币供应量数据（M0、M1、M2） |
| PMI指数 | cn_pmi | 获取采购经理指数数据 ⭐️ 已优化 |
| 社会融资 | cn_sf | 获取社会融资规模数据 |
| Shibor报价 | shibor_quote | 获取Shibor银行报价数据（买入价、卖出价） |
| Libor利率 | libor | 获取伦敦银行间同业拆借利率 |
| Hibor利率 | hibor | 获取香港银行间同业拆借利率 |

### 公司财务接口
| 功能 | Tushare接口 | 描述 |
|------|-------------|-----|
| 利润表 | income | 获取上市公司利润表数据 ⭐️ 已整合 |
| 资产负债表 | balancesheet | 获取上市公司资产负债表数据 ⭐️ 已整合 |
| 现金流量表 | cashflow | 获取上市公司现金流量表数据 ⭐️ 已整合 |
| 业绩预告 | forecast | 获取上市公司业绩预告数据 |
| 业绩快报 | express | 获取上市公司业绩快报数据 |
| 财务指标 | fina_indicator | 获取上市公司财务指标数据 |
| 分红送股 | dividend | 获取上市公司分红送股数据 |
| 主营构成 | fina_mainbz | 获取主营业务构成数据 |
| 股东人数 | stk_holdernumber | 获取股东人数数据 |
| 股东增减持 | stk_holdertrade | 获取股东增减持数据 |
| 管理层信息 | stk_managers | 获取上市公司管理层信息 |
| 财务审计 | audit | 获取财务审计意见数据 |
| 公司基本信息 | company_basic | 获取公司基本信息 |

### 基金数据接口
| 功能 | Tushare接口 | 描述 |
|------|-------------|-----|
| 基金列表 | fund_basic | 获取公募基金基本信息 ⭐️ 已优化 |
| 基金净值 | fund_nav | 获取基金净值数据 ⭐️ 已优化 |
| 基金分红 | fund_div | 获取基金分红送配数据 ⭐️ 已修复 |
| 基金持仓 | fund_portfolio | 获取基金持仓明细 ⭐️ 已优化 |
| 基金经理 | fund_manager | 获取基金经理信息 ⭐️ 独立工具 |

### 其他专业接口
| 功能 | Tushare接口 | 描述 |
|------|-------------|-----|
| 可转债基本信息 | cb_basic | 获取可转债基本信息 ⭐️ |
| 可转债发行 | cb_issue | 获取可转债发行数据 ⭐️ |
| 大宗交易 | block_trade | 获取大宗交易数据 ⭐️ 新增 |
| 资金流向 | moneyflow | 获取个股和大盘资金流向数据 ⭐️ 新增 |
| 融资融券标的 | margin_secs | 获取融资融券标的股票（沪深京） ⭐️ 新增 |
| 融资融券汇总 | margin | 获取融资融券交易汇总数据 ⭐️ 新增 |
| 融资融券明细 | margin_detail | 获取融资融券交易明细数据 ⭐️ 新增 |
| 做市借券 | slb_len_mm | 获取做市借券交易数据 ⭐️ 新增 |

## 🔮 未来规划

未来计划集成更多Tushare数据接口，包括但不限于：

1. **更多技术指标** - BOLL、MACD、RSI等的扩展版本，自定义技术指标 ⭐️ 部分已实现
2. **基础数据** - 股票列表、交易日历、停复牌信息等
3. **更多财务数据** - 财务审计意见、主营业务构成、股东信息等 ⭐️ 部分已实现
4. **更多新闻数据** - 公告信息、研报数据等 ⭐️ 部分已实现
5. **行业数据** - 行业分类、行业指数、行业对比分析等
6. **衍生品数据** - 更多期权、期货合约数据
7. **另类数据** - ESG评级、机构调研、股东大会等

参见 `tushare-interfaces.md` 文件了解更多可能集成的数据接口。

## 📈 最新更新

### v1.0.0 主要更新
- ✅ **⭐ 技术指标系统完整实现** - MACD/RSI/KDJ/BOLL/MA五大核心指标，智能数据预取机制
- ✅ **强制参数化设计** - 所有技术指标必须显式指定参数，确保计算一致性
- ✅ **模块化架构** - 参数解析、数据计算、指标引擎完全解耦
- ✅ **9大市场全覆盖** - A股/美股/港股/外汇/期货/基金/债券/期权全面支持技术指标
- ✅ **财务三表整合** - 利润表、资产负债表、现金流量表完全整合到company_performance工具
- ✅ **智能数据过滤** - 自动过滤空字段，只显示有实际数据的项目
- ✅ **基金数据优化** - 查询性能提升85%，从独立工具拆分基金经理查询功能
- ✅ **外汇数据修复** - 修复外汇字段映射错误，正确显示买入/卖出价格
- ✅ **PPI数据修复** - 修复PPI字段映射Bug，正确显示工业生产者价格指数
- ✅ **新增大宗交易工具** - 支持个股和全市场大宗交易数据查询
- ✅ **新增资金流向工具** - 支持个股和大盘资金流向分析
- ✅ **新增融资融券工具** - 支持融资余额和融券数据的全面分析
- ✅ **中文化优化** - 宏观经济模块全面中文化
- ✅ **分批显示优化** - 大数据量表格智能分批显示，提升可读性

## 📄 许可证

本项目采用MIT许可证。详情请参见 [LICENSE](LICENSE) 文件。

## 👨‍💻 作者

- 姓名：陈星宇 (Xingyu Chen)
- 邮箱：guangxiangdebizi@gmail.com
- GitHub：[guangxiangdebizi](https://github.com/guangxiangdebizi)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## ⭐ 支持项目

如果这个项目对您有帮助，请给我们一个Star！您的支持是我们持续改进的动力。
