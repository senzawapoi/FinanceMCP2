import { TUSHARE_CONFIG } from '../config.js';
import {
  formatBasicIncome,
  formatRevenueIncome,
  formatCostIncome,
  formatProfitIncome,
  formatInsuranceIncome,
  formatDistributionIncome,
  formatSpecialIncome,
  formatAllIncome
} from './companyPerformanceDetail/incomeFormatters.js';

export const income = {
  name: "income",
  description: "获取上市公司利润表数据：核心利润表、营业收入构成、成本费用构成、利润结构分析、保险业务、利润分配、特殊项目等详细数据",
  parameters: {
    type: "object",
    properties: {
      ts_code: {
        type: "string",
        description: "股票代码，如'000001.SZ'表示平安银行，'600000.SH'表示浦发银行"
      },
      data_type: {
        type: "string",
        description: "利润表数据类型：basic核心利润表、revenue营业收入构成、cost成本费用构成、profit利润结构分析、insurance保险业务、distribution利润分配、special特殊项目、all完整利润表",
        enum: ["basic", "revenue", "cost", "profit", "insurance", "distribution", "special", "all"]
      },
      start_date: {
        type: "string",
        description: "起始日期，格式为YYYYMMDD，如'20230101'"
      },
      end_date: {
        type: "string",
        description: "结束日期，格式为YYYYMMDD，如'20231231'"
      },
      period: {
        type: "string",
        description: "特定报告期，格式为YYYYMMDD，如'20231231'表示2023年年报。指定此参数时将忽略start_date和end_date"
      }
    },
    required: ["ts_code", "data_type", "start_date", "end_date"]
  },

  async handler(args: any) {
    try {
      console.log('利润表查询请求:', args);
      
      const { ts_code, data_type, start_date, end_date, period } = args;
      
      if (!TUSHARE_CONFIG.API_TOKEN) {
        throw new Error('Tushare token 未配置');
      }

      // 数据类型字段映射
      const fieldConfigs: Record<string, string> = {
        'basic': 'ts_code,ann_date,f_ann_date,end_date,report_type,comp_type,basic_eps,diluted_eps,total_revenue,revenue,total_cogs,oper_cost,operate_profit,total_profit,income_tax,n_income,n_income_attr_p,ebit,ebitda',
        
        'revenue': 'ts_code,ann_date,f_ann_date,end_date,total_revenue,revenue,int_income,prem_earned,comm_income,n_commis_income,n_oth_income,n_oth_b_income,oth_b_income,fv_value_chg_gain,invest_income,ass_invest_income,forex_gain,n_sec_tb_income,n_sec_uw_income,n_asset_mg_income',
        
        'cost': 'ts_code,ann_date,f_ann_date,end_date,total_cogs,oper_cost,int_exp,comm_exp,biz_tax_surchg,sell_exp,admin_exp,fin_exp,assets_impair_loss,credit_impa_loss,oth_impair_loss_assets,rd_exp,fin_exp_int_exp,fin_exp_int_inc',
        
        'profit': 'ts_code,ann_date,f_ann_date,end_date,operate_profit,non_oper_income,non_oper_exp,nca_disploss,total_profit,income_tax,n_income,n_income_attr_p,minority_gain,oth_compr_income,t_compr_income,compr_inc_attr_p,compr_inc_attr_m_s,ebit,ebitda,continued_net_profit,end_net_profit',
        
        'insurance': 'ts_code,ann_date,f_ann_date,end_date,prem_earned,prem_income,out_prem,une_prem_reser,reins_income,insurance_exp,prem_refund,compens_payout,reser_insur_liab,div_payt,reins_exp,compens_payout_refu,insur_reser_refu,reins_cost_refund',
        
        'distribution': 'ts_code,ann_date,f_ann_date,end_date,undist_profit,distable_profit,distr_profit_shrhder,transfer_surplus_rese,transfer_housing_imprest,transfer_oth,withdra_legal_surplus,withdra_legal_pubfund,withdra_biz_devfund,withdra_rese_fund,withdra_oth_ersu,workers_welfare,prfshare_payable_dvd,comshare_payable_dvd,capit_comstock_div',
        
        'special': 'ts_code,ann_date,f_ann_date,end_date,adj_lossgain,net_after_nr_lp_correct,net_expo_hedging_benefits,oth_income,asset_disp_income,total_opcost,amodcost_fin_assets,other_bus_cost,oper_exp',
        
        'all': '' // 空字符串表示获取所有字段
      };

      const fields = fieldConfigs[data_type];
      if (fields === undefined) {
        throw new Error(`不支持的数据类型: ${data_type}`);
      }
      
      // 构建API请求参数
      const apiParams: any = {
        api_name: 'income',
        token: TUSHARE_CONFIG.API_TOKEN,
        params: {
          ts_code: ts_code
        }
      };

      // 添加字段参数（如果不是all类型）
      if (fields) {
        apiParams.fields = fields;
      }

      // 添加时间参数
      if (period) {
        apiParams.params.period = period;
      } else {
        apiParams.params.start_date = start_date;
        apiParams.params.end_date = end_date;
      }

      console.log('API请求参数:', apiParams);

      const response = await fetch('http://api.tushare.pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiParams)
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API响应:', result);

      if (result.code !== 0) {
        throw new Error(`API错误: ${result.msg || '未知错误'}`);
      }

      if (!result.data || !result.data.items || result.data.items.length === 0) {
        return `未找到股票代码 ${ts_code} 在指定时间范围内的利润表数据。\n请检查：\n1. 股票代码是否正确\n2. 时间范围是否合理\n3. 是否为交易日`;
      }

      // 转换数据格式
      const items = result.data.items;
      const fieldsArray = result.data.fields;
      const formattedData = items.map((item: any[]) => {
        const obj: any = {};
        fieldsArray.forEach((field: string, index: number) => {
          obj[field] = item[index];
        });
        return obj;
      });

      // 按报告期排序（降序）
      formattedData.sort((a: any, b: any) => {
        return (b.end_date || '').localeCompare(a.end_date || '');
      });

      // 根据数据类型格式化输出
      let output = '';
      switch (data_type) {
        case 'basic':
          output = formatBasicIncome(formattedData);
          break;
        case 'revenue':
          output = formatRevenueIncome(formattedData);
          break;
        case 'cost':
          output = formatCostIncome(formattedData);
          break;
        case 'profit':
          output = formatProfitIncome(formattedData);
          break;
        case 'insurance':
          output = formatInsuranceIncome(formattedData);
          break;
        case 'distribution':
          output = formatDistributionIncome(formattedData);
          break;
        case 'special':
          output = formatSpecialIncome(formattedData);
          break;
        case 'all':
          output = formatAllIncome(formattedData);
          break;
        default:
          output = formatBasicIncome(formattedData);
      }

      return output;

    } catch (error) {
      console.error('利润表查询错误:', error);
      if (error instanceof Error) {
        return `利润表数据查询失败: ${error.message}`;
      }
      return '利润表数据查询失败: 未知错误';
    }
  }
}; 