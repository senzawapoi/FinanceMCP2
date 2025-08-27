[![English](https://img.shields.io/badge/English-README_EN.md-blue?logo=github)](README_EN.md)

# FinanceMCP - 专业金融数据MCP服务器 🚀

[![smithery badge](https://smithery.ai/badge/@guangxiangdebizi/FinanceMCP)](https://smithery.ai/server/@guangxiangdebizi/FinanceMCP)

**基于MCP协议的专业金融数据服务器，集成Tushare API，为Claude等AI助手提供实时金融数据和技术指标分析。**

## 📑 目录

- [🌟 公共云服务(免费)](#-公共云服务免费)
- [⚡ 核心特色](#-核心特色)
- [🛠️ 工具概览](#️-工具概览)
- [🎯 技术亮点](#-技术亮点)
- [🚀 快速开始](#-快速开始)
- [💡 示例查询](#-示例查询)
- [🔧 本地部署](#-本地部署)
- [🆕 最新更新](#-最新更新)
- [📄 许可证](#-许可证)

## 🌟 公共云服务(免费)

**🎉 开箱即用，无需部署！**
我们提供多种免费公共云服务选项：

### 🌐 Web在线体验版
**🚀 最简单的使用方式！**
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3b6e2310-afb2-407d-805d-b1a6b9ff6ea6" />

访问我们的在线体验网站：**[http://106.14.205.176:3222/](http://106.14.205.176:3222/)**

- ✨ **零配置体验** - 无需任何设置，打开网页即用
- 🤖 **集成大模型** - 直接与AI助手对话，获取金融分析
- 💬 **智能交互** - 自然语言提问，实时获取金融数据
- 📱 **多端适配** - 支持电脑、手机、平板访问
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/40d435a5-741d-41f3-a471-56bd5386d132" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/188c7222-5d60-4076-9a65-664755fea6ee" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/73c6f17d-8133-458b-bb26-95422e33b4d7" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/64307568-70d5-425f-b3bc-2bf1d2e97ff2" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e3fbaa7f-25f0-4787-aab2-0d3caad1aeae" />

> ⚠️ **服务说明**: 这是个人小服务器，请合理使用，勿攻击滥用。

### ⚙️ Claude桌面版配置
您也可以直接在Claude中配置使用，无需本地安装和API密钥：

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

**服务优势:**
- ✅ **零配置** - 无需注册或API密钥
- ✅ **7×24可用** - 服务器持续运行
- ✅ **完整功能** - 全部13个工具和技术指标
- ✅ **实时数据** - 连接Tushare专业数据

> 📺 **教程视频**: [FinanceMCP完整使用指南](https://www.bilibili.com/video/BV1qeNnzEEQi/)

## ⚡ 核心特色

### 🧠 智能技术指标系统
- **智能数据预取** - 自动计算所需历史数据，消除NaN值
- **强制参数化** - 要求明确指定参数（如`macd(12,26,9)`）确保精确性
- **模块化架构** - 参数解析、数据计算、指标引擎完全解耦
- **5大核心指标** - MACD、RSI、KDJ、BOLL、MA

### 🌍 全面市场覆盖
- **10大市场** - A股、美股、港股、外汇、期货、基金、债券、期权
- **实时新闻** - 智能搜索7+主流财经媒体
- **宏观数据** - 11个经济指标（GDP、CPI、PPI、PMI等）
- **公司分析** - 财务报表、管理层信息、股东结构

## 🛠️ 工具概览

| 工具名称 | 功能描述 | 核心特色 |
|---------|---------|---------|
| 🕐 **current_timestamp** | 当前时间戳 | UTC+8时区，多种输出格式 |
| 📰 **finance_news** | 财经新闻搜索 | 智能关键词搜索，7+媒体源 |
| 📈 **stock_data** | 股票+技术指标 | 10大市场+5技术指标，智能预取 |
| 📊 **index_data** | 指数数据 | 主要市场指数历史数据 |
| 🧱 **csi_index_constituents** | CSI指数成分与权重摘要 | 仅支持中证指数公司(CSI)，指数区间行情+全部成分股权重与区间涨跌幅 |
| 📉 **macro_econ** | 宏观经济数据 | 11指标：GDP/CPI/PPI/PMI/Shibor等 |
| 🏢 **company_performance** | A股公司财务分析 | 财务报表+管理层+基本面，13数据类型 |
| 🏛️ **company_performance_hk** | 港股公司财务分析 | 港股利润表、资产负债表、现金流量表 |
| 🇺🇸 **company_performance_us** | 美股公司财务分析 | 美股4大财务报表+综合财务指标分析 |
| 💰 **fund_data** | 基金数据 | 净值/持仓/分红，85%性能优化 |
| 👨‍💼 **fund_manager_by_name** | 基金经理查询 | 个人背景、管理基金列表 |
| 🪙 **convertible_bond** | 可转债数据 | 基本信息+发行数据+转换条款 |
| 🔄 **block_trade** | 大宗交易数据 | 交易详情+交易对手信息 |
| 💹 **money_flow** | 资金流向数据 | 主力/超大单/大单/中单/小单流向分析 |
| 💰 **margin_trade** | 融资融券数据 | 4个API：标的股票/汇总/明细/转融券 |

## 🎯 技术亮点

### 智能技术指标引擎
```
用户请求 → 参数解析 → 数据需求计算 → 扩展历史数据获取 → 指标计算 → 结果返回
```

**支持的指标:**
- **MACD** `macd(12,26,9)` - 趋势分析
- **RSI** `rsi(14)` - 超买超卖判断
- **KDJ** `kdj(9,3,3)` - 随机指标
- **BOLL** `boll(20,2)` - 布林带
- **MA** `ma(5/10/20/60)` - 移动平均线

### 核心技术优势
1. **智能预取** - 自动计算并获取指标所需的额外历史数据
2. **参数强制** - 避免默认参数造成的计算差异
3. **高性能** - 基金数据查询性能提升85%（5.2s→0.8s）
4. **数据集成** - 无缝集成43+个Tushare API接口

## 🚀 快速开始

### 1. 使用公共云服务(推荐)
复制上方JSON配置到Claude桌面配置文件，重启Claude即可开始使用！

### 2. 配置文件位置
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

### 3. 开始使用
配置完成后，直接在Claude中提问即可！

## 💡 示例查询

<details>
<summary><strong>📈 股票技术分析</strong></summary>

```
"分析茅台(600519.SH)技术面状况，计算MACD(12,26,9)、RSI(14)、KDJ(9,3,3)"
"查看宁德时代(300750.SZ)布林带BOLL(20,2)和四条均线MA(5,10,20,60)"
"苹果公司(AAPL)近一个月股价走势和MACD指标分析"
```

</details>

<details>
<summary><strong>📊 综合分析</strong></summary>

```
"比亚迪综合分析：财务状况、技术指标、资金流向、最新新闻"
"对比A股、美股、港股市场表现，包括主要指数和技术指标"
"评估宁德时代投资价值：基本面+技术面+资金流向"
"获取沪深300(000300.SH) 2024-01-01 至 2024-06-30 的CSI成分股区间摘要"
```

</details>

<details>
<summary><strong>📰 新闻与宏观</strong></summary>

```
"搜索新能源汽车板块最新政策和市场动态"
"分析当前宏观经济形势：GDP、CPI、PPI、PMI数据"
"美联储加息对中国股市的影响，相关新闻和数据"
```

</details>

<details>
<summary><strong>💰 基金与债券</strong></summary>

```
"查询沪深300ETF最新净值和持仓结构"
"分析张坤的基金业绩表现"
"可转债市场概况和投资机会"
```

</details>

<details>
<summary><strong>🏛️ 港股分析</strong></summary>

```
"获取腾讯控股(00700.HK) 2024年利润表，包含关键财务比率"
"分析阿里巴巴(09988.HK)资产负债表和财务结构"
"对比建设银行(00939.HK)多期现金流表现"
```

</details>

<details>
<summary><strong>🇺🇸 美股分析</strong></summary>

```
"分析英伟达(NVDA) 2024年财务表现，包括利润表和现金流"
"获取苹果(AAPL)资产负债表，重点关注现金储备和负债结构"
"对比特斯拉(TSLA)多期财务指标，分析盈利能力变化趋势"
"查看微软(MSFT)综合财务指标，包括ROE、ROA、毛利率等"
```

</details>

## 🔧 本地部署（Streamable HTTP）

<details>
<summary><strong>🛠️ 完整本地部署指南</strong></summary>

如果需要本地部署，请按以下步骤操作：

### 环境要求
- **Node.js >= 18** - 从[nodejs.org](https://nodejs.org/)下载
- **Tushare API令牌** - 从[tushare.pro](https://tushare.pro)获取

<details>
<summary><strong>📝 获取Tushare API令牌</strong></summary>

1. **注册账户** - 访问[tushare.pro](https://tushare.pro/register)注册
2. **获取令牌** - 从个人中心获取API令牌
3. **积分说明** - 部分高级数据需要积分

**学生福利** - 申请2000免费积分：
- 关注Tushare官方小红书并互动
- 加入学生QQ群：**290541801**
- 完善个人信息（学校邮箱/学号）
- 向管理员提交申请材料

</details>

### 安装步骤

#### 方法1：通过Smithery安装(推荐)
```bash
npx -y @smithery/cli install @guangxiangdebizi/finance-mcp --client claude
```

#### 方法2：手动安装
```bash
# 1. 克隆仓库
git clone https://github.com/guangxiangdebizi/FinanceMCP.git
cd FinanceMCP

# 2. 安装依赖
npm install

# 3. 配置API密钥
echo "TUSHARE_TOKEN=your_token_here" > .env
# 或直接编辑 src/config.ts

# 4. 构建项目
npm run build
```

### 启动服务

**Streamable HTTP 模式（推荐）**
```bash
npm run build
node build/httpServer.js
# 或
npm start
```

服务启动后：
- MCP 端点: `http://localhost:3000/mcp`
- 健康检查: `http://localhost:3000/health`

### Claude配置

配置文件位置：
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

#### 最新配置：Streamable HTTP 模式（通过 Header 传入 Tushare Token）
```json
{
  "mcpServers": {
    "finance-data-server": {
      "type": "streamableHttp",
      "url": "http://localhost:3000/mcp",
      "timeout": 600,
      "headers": {
        "X-Tushare-Token": "your_tushare_token"
        // 也可使用以下任一方式：
        // "Authorization": "Bearer your_tushare_token"
        // "X-Api-Key": "your_tushare_token"
      },
      "autoApprove": [
        "current_timestamp",
        "finance_news",
        "stock_data",
        "index_data",
        "macro_econ",
        "company_performance",
        "company_performance_hk",
        "company_performance_us",
        "fund_data",
        "fund_manager_by_name",
        "convertible_bond",
        "block_trade",
        "money_flow",
        "margin_trade",
        "csi_index_constituents"
      ]
    }
  }
}
```

#### 传递 Token 的 Header 规则
- 优先从 `X-Tushare-Token` 读取；
- 若未提供，则尝试 `Authorization: Bearer <token>`；
- 再次回退读取 `X-Api-Key`；
- 若 Header 中未提供，则回退使用服务端环境变量 `TUSHARE_TOKEN`（可选）。

### 验证安装
配置完成后，重启Claude桌面版并询问："获取当前时间"。如果返回时间信息，说明安装成功。

</details>

## 🆕 最新更新

### 🇺🇸 美股财务分析模块 (NEW!)

**最新添加**：我们新增了完整的美股财务分析功能！

<details>
<summary><strong>📊 新增功能</strong></summary>

- **🇺🇸 company_performance_us** - 专业的美股财务分析工具
- **📈 利润表分析** - 营业收入、毛利率、净利润、每股收益分析
- **💰 资产负债表分析** - 资产、负债、股东权益结构与财务比率
- **💸 现金流量表分析** - 经营、投资、筹资现金流与自由现金流
- **📊 综合财务指标** - ROE、ROA、盈利能力、成长性、偿债能力等
- **🎯 智能数据处理** - 多期对比分析、趋势计算、关键指标提取
- **🌟 中英文兼容** - 支持中英文财务科目智能识别

**支持公司**：覆盖主要美股和中概股，包括英伟达(NVDA)、苹果(AAPL)、特斯拉(TSLA)、微软(MSFT)等。

**API集成**：基于[Tushare美股财务数据API](https://tushare.pro/document/2?doc_id=394)，4大数据接口完整集成。

</details>

### 🏛️ 港股财务分析模块

**已添加**：我们新增了全面的港股财务分析功能！

<details>
<summary><strong>📊 功能特色</strong></summary>

- **🏛️ company_performance_hk** - 专门的港股财务分析工具
- **📈 利润表分析** - 营业额、利润率、每股收益、综合收益分析
- **💰 资产负债表分析** - 资产、负债、权益结构与关键财务比率
- **💸 现金流量表分析** - 经营、投资、筹资活动与自由现金流计算
- **🎯 智能数据处理** - 自动财务比率计算和多期对比分析
- **🌟 增强用户体验** - 结构化表格、智能分类、趋势分析

**支持公司**：所有港交所上市公司，包括腾讯(00700.HK)、阿里巴巴(09988.HK)、建设银行(00939.HK)等。

**API集成**：基于[Tushare港股财务数据API](https://tushare.pro/document/2?doc_id=389)，完整数据格式优化。

</details>

## 📄 许可证

本项目采用MIT许可证。详见[LICENSE](LICENSE)文件。

---

**👨‍💻 作者**: 陈星宇  
**📧 邮箱**: guangxiangdebizi@gmail.com  
**🔗 GitHub**: [guangxiangdebizi](https://github.com/guangxiangdebizi)

⭐ 如果这个项目对您有帮助，请给我们一个Star！
