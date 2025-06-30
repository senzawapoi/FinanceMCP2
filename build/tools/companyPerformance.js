import { TUSHARE_CONFIG } from '../config.js';
import { formatBasicBalance, formatAllBalance } from './companyPerformanceDetail/balanceFormatters.js';
import { formatBasicCashFlow, formatCashflowAll } from './companyPerformanceDetail/cashflowFormatters.js';
import { formatBasicIncome, formatAllIncome } from './companyPerformanceDetail/incomeFormatters.js';
export const companyPerformance = {
    name: "company_performance",
    description: "获取上市公司综合表现数据，包括业绩预告、业绩快报、财务指标、分红送股、主营业务构成和股东变动数据",
    parameters: {
        type: "object",
        properties: {
            ts_code: {
                type: "string",
                description: "股票代码，如'000001.SZ'表示平安银行，'600000.SH'表示浦发银行"
            },
            data_type: {
                type: "string",
                description: "数据类型：forecast(业绩预告)、express(业绩快报)、indicators(财务指标ROE等)、dividend(分红送股)、mainbz_product(主营构成-产品)、mainbz_region(主营构成-地区)、mainbz_industry(主营构成-行业)、holder_number(股东人数)、holder_trade(股东增减持)、balance_basic(核心资产负债表)、balance_all(完整资产负债表)、cashflow_basic(基础现金流)、cashflow_all(完整现金流)、income_basic(核心利润表)、income_all(完整利润表)",
                enum: ["forecast", "express", "indicators", "dividend", "mainbz_product", "mainbz_region", "mainbz_industry", "holder_number", "holder_trade", "balance_basic", "balance_all", "cashflow_basic", "cashflow_all", "income_basic", "income_all"]
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
    async run(args) {
        try {
            console.log('公司综合表现查询参数:', args);
            const TUSHARE_API_KEY = TUSHARE_CONFIG.API_TOKEN;
            const TUSHARE_API_URL = TUSHARE_CONFIG.API_URL;
            if (!TUSHARE_API_KEY) {
                throw new Error('请配置TUSHARE_TOKEN环境变量');
            }
            const results = [];
            // 直接使用指定的数据类型
            const dataTypes = [args.data_type];
            for (const dataType of dataTypes) {
                try {
                    const result = await fetchFinancialData(dataType, args.ts_code, args.period, args.start_date, args.end_date, TUSHARE_API_KEY, TUSHARE_API_URL);
                    if (result.data && result.data.length > 0) {
                        results.push({
                            type: dataType,
                            data: result.data,
                            fields: result.fields
                        });
                    }
                }
                catch (error) {
                    console.warn(`获取${dataType}数据失败:`, error);
                    results.push({
                        type: dataType,
                        error: error instanceof Error ? error.message : '未知错误'
                    });
                }
            }
            if (results.length === 0) {
                throw new Error(`未找到股票${args.ts_code}的综合表现数据`);
            }
            // 格式化输出
            const formattedOutput = formatFinancialData(results, args.ts_code);
            return {
                content: [{ type: "text", text: formattedOutput }]
            };
        }
        catch (error) {
            console.error('公司综合表现查询错误:', error);
            return {
                content: [{
                        type: "text",
                        text: `查询公司综合表现数据时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
                    }]
            };
        }
    }
};
// 获取财务数据的通用函数
async function fetchFinancialData(dataType, tsCode, period, startDate, endDate, apiKey, apiUrl, businessType) {
    const apiConfigs = {
        forecast: {
            api_name: "forecast",
            default_fields: "ts_code,ann_date,end_date,type,p_change_min,p_change_max,net_profit_min,net_profit_max,last_parent_net,first_ann_date,summary,change_reason"
        },
        express: {
            api_name: "express",
            default_fields: "ts_code,ann_date,end_date,revenue,operate_profit,total_profit,n_income,total_assets,total_hldr_eqy_exc_min_int,diluted_eps,diluted_roe,yoy_net_profit,bps,yoy_sales,yoy_op,yoy_tp,yoy_dedu_np,yoy_eps,yoy_roe,growth_assets,yoy_equity,growth_bps,or_last_year,op_last_year,tp_last_year,np_last_year,eps_last_year,open_net_assets,open_bps,perf_summary,is_audit,remark"
        },
        indicators: {
            api_name: "fina_indicator",
            default_fields: "ts_code,ann_date,end_date,eps,dt_eps,total_revenue_ps,revenue_ps,capital_rese_ps,surplus_rese_ps,undist_profit_ps,extra_item,profit_dedt,gross_margin,current_ratio,quick_ratio,cash_ratio,invturn_days,arturn_days,inv_turn,ar_turn,ca_turn,fa_turn,assets_turn,op_income,valuechange_income,interst_income,daa,ebit,ebitda,fcff,fcfe,current_exint,noncurrent_exint,interestdebt,netdebt,tangible_asset,working_capital,networking_capital,invest_capital,retained_earnings,diluted2_eps,bps,ocfps,retainedps,cfps,ebit_ps,fcff_ps,fcfe_ps,netprofit_margin,grossprofit_margin,cogs_of_sales,expense_of_sales,profit_to_gr,saleexp_to_gr,adminexp_of_gr,finaexp_of_gr,impai_ttm,gc_of_gr,op_of_gr,ebit_of_gr,roe,roe_waa,roe_dt,roa,npta,roic,roe_yearly,roa_yearly,roe_avg,opincome_of_ebt,investincome_of_ebt,n_op_profit_of_ebt,tax_to_ebt,dtprofit_to_profit,salescash_to_or,ocf_to_or,ocf_to_opincome,capitalized_to_da,debt_to_assets,assets_to_eqt,dp_assets_to_eqt,ca_to_assets,nca_to_assets,tbassets_to_totalassets,int_to_talcap,eqt_to_talcapital,currentdebt_to_debt,longdeb_to_debt,ocf_to_shortdebt,debt_to_eqt,eqt_to_debt,eqt_to_interestdebt,tangibleasset_to_debt,tangasset_to_intdebt,tangibleasset_to_netdebt,ocf_to_debt,ocf_to_interestdebt,ocf_to_netdebt,ebit_to_interest,longdebt_to_workingcapital,ebitda_to_debt,turn_days,roa_yearly,roa_dp,fixed_assets,profit_prefin_exp,non_op_profit,op_to_ebt,nop_to_ebt,ocf_to_profit,cash_to_liqdebt,cash_to_liqdebt_withinterest,op_to_liqdebt,op_to_debt,roic_yearly,total_fa_trun,profit_to_op,q_opincome,q_investincome,q_dtprofit,q_eps,q_netprofit_margin,q_gsprofit_margin,q_exp_to_sales,q_profit_to_gr,q_saleexp_to_gr,q_adminexp_to_gr,q_finaexp_to_gr,q_impair_to_gr_ttm,q_gc_to_gr,q_op_to_gr,q_roe,q_dt_roe,q_npta,q_ocf_to_sales,q_ocf_to_or,basic_eps_yoy,dt_eps_yoy,cfps_yoy,op_yoy,ebt_yoy,netprofit_yoy,dt_netprofit_yoy,ocf_yoy,roe_yoy,bps_yoy,assets_yoy,eqt_yoy,tr_yoy,or_yoy,q_gr_yoy,q_gr_qoq,q_sales_yoy,q_sales_qoq,q_op_yoy,q_op_qoq,q_profit_yoy,q_profit_qoq,q_netprofit_yoy,q_netprofit_qoq,equity_yoy,rd_exp,update_flag"
        },
        dividend: {
            api_name: "dividend",
            default_fields: "ts_code,end_date,ann_date,div_proc,stk_div,stk_bo_rate,stk_co_rate,cash_div,cash_div_tax,record_date,ex_date,pay_date,div_listdate,imp_ann_date,base_date,base_share"
        },
        mainbz_product: {
            api_name: "fina_mainbz",
            default_fields: "ts_code,end_date,bz_item,bz_sales,bz_profit,bz_cost,curr_type,update_flag",
            business_type: "P"
        },
        mainbz_region: {
            api_name: "fina_mainbz",
            default_fields: "ts_code,end_date,bz_item,bz_sales,bz_profit,bz_cost,curr_type,update_flag",
            business_type: "D"
        },
        mainbz_industry: {
            api_name: "fina_mainbz",
            default_fields: "ts_code,end_date,bz_item,bz_sales,bz_profit,bz_cost,curr_type,update_flag",
            business_type: "I"
        },
        holder_number: {
            api_name: "stk_holdernumber",
            default_fields: "ts_code,ann_date,end_date,holder_num"
        },
        holder_trade: {
            api_name: "stk_holdertrade",
            default_fields: "ts_code,ann_date,holder_name,holder_type,in_de,change_vol,change_ratio,after_share,after_ratio,avg_price,total_share,begin_date,close_date"
        },
        balance_basic: {
            api_name: "balancesheet",
            default_fields: "ts_code,ann_date,f_ann_date,end_date,report_type,comp_type,total_assets,total_cur_assets,total_nca,total_liab,total_cur_liab,total_ncl,total_hldr_eqy_exc_min_int,total_hldr_eqy_inc_min_int,total_liab_hldr_eqy"
        },
        balance_all: {
            api_name: "balancesheet",
            default_fields: "" // 空字符串表示获取所有字段
        },
        cashflow_basic: {
            api_name: "cashflow",
            default_fields: "ts_code,ann_date,f_ann_date,end_date,comp_type,report_type,net_profit,finan_exp,c_fr_sale_sg,recp_tax_rends,n_depos_incr_fi,n_incr_loans_cb,n_inc_borr_oth_fi,prem_fr_orig_contr,n_incr_insured_dep,n_reinsur_prem,n_incr_disp_tfa,ifc_cash_incr,n_incr_disp_faas,n_incr_loans_oth_bank,n_cap_incr_repur,c_fr_oth_operate_a,c_inf_fr_operate_a,c_paid_goods_s,c_paid_to_for_empl,c_paid_for_taxes,n_incr_clt_loan_adv,n_incr_dep_cbob,c_pay_claims_orig_inco,pay_handling_chrg,pay_comm_insur_plcy,oth_cash_pay_oper_act,st_cash_out_act,n_cashflow_act,oth_recp_ral_inv_act,c_disp_withdrwl_invest,c_recp_return_invest,n_recp_disp_fiolta,n_recp_disp_sobu,stot_inflows_inv_act,c_pay_acq_const_fiolta,c_paid_invest,n_disp_subs_oth_biz,oth_pay_ral_inv_act,n_incr_pledge_loan,stot_out_inv_act,n_cashflow_inv_act,c_recp_borrow,proc_issue_bonds,oth_cash_recp_ral_fnc_act,stot_cash_in_fnc_act,free_cashflow,c_prepay_amt_borr,c_pay_dist_dpcp_int_exp,incl_dvd_profit_paid_sc_ms,oth_cashpay_ral_fnc_act,stot_cashout_fnc_act,n_cash_flows_fnc_act,eff_fx_flu_cash,n_incr_cash_cash_equ,c_cash_equ_beg_period,c_cash_equ_end_period,c_recp_cap_contrib,incl_cash_rec_saims,uncon_invest_loss,prov_depr_assets,depr_fa_coga_dpba,amort_intang_assets,lt_amort_deferred_exp,decr_deferred_exp,incr_acc_exp,loss_disp_fiolta,loss_scr_fa,loss_fv_chg,invest_loss,decr_def_inc_tax_assets,incr_def_inc_tax_liab,decr_inventories,decr_oper_payable,incr_oper_payable,others,im_net_cashflow_oper_act,conv_debt_into_cap,conv_copbonds_due_within_1y,fa_fnc_leases,end_bal_cash,beg_bal_cash,end_bal_cash_equ,beg_bal_cash_equ,im_n_incr_cash_equ"
        },
        cashflow_all: {
            api_name: "cashflow",
            default_fields: "" // 空字符串表示获取所有字段
        },
        income_basic: {
            api_name: "income",
            default_fields: "ts_code,ann_date,f_ann_date,end_date,report_type,comp_type,basic_eps,diluted_eps,total_revenue,revenue,total_cogs,oper_cost,operate_profit,total_profit,income_tax,n_income,n_income_attr_p,ebit,ebitda"
        },
        income_all: {
            api_name: "income",
            default_fields: "" // 空字符串表示获取所有字段
        }
    };
    const config = apiConfigs[dataType];
    if (!config) {
        throw new Error(`不支持的数据类型: ${dataType}`);
    }
    // 构建请求参数
    const params = {
        api_name: config.api_name,
        token: apiKey,
        params: {
            ts_code: tsCode
        }
    };
    // 添加字段参数（如果不是balance_all类型）
    if (config.default_fields) {
        params.fields = config.default_fields;
    }
    // 根据不同的API添加特定参数
    if (['indicators'].includes(dataType)) {
        if (period) {
            params.params.period = period;
        }
        else {
            params.params.start_date = startDate;
            params.params.end_date = endDate;
        }
    }
    else if (['forecast', 'express'].includes(dataType)) {
        params.params.start_date = startDate;
        params.params.end_date = endDate;
    }
    else if (dataType === 'dividend') {
        // 分红数据不在API级别过滤，在返回后过滤
    }
    else if (['mainbz_product', 'mainbz_region', 'mainbz_industry'].includes(dataType)) {
        // 主营业务构成数据
        if (period) {
            params.params.period = period;
        }
        else {
            params.params.start_date = startDate;
            params.params.end_date = endDate;
        }
        // 添加业务类型参数（从配置中获取）
        params.params.type = config.business_type;
    }
    else if (['holder_number', 'holder_trade'].includes(dataType)) {
        // 股东人数和股东增减持数据
        params.params.start_date = startDate;
        params.params.end_date = endDate;
    }
    else if (['balance_basic', 'balance_all'].includes(dataType)) {
        // 资产负债表数据
        if (period) {
            params.params.period = period;
        }
        else {
            params.params.start_date = startDate;
            params.params.end_date = endDate;
        }
    }
    else if (['cashflow_basic', 'cashflow_all'].includes(dataType)) {
        // 现金流量表数据
        if (period) {
            params.params.period = period;
        }
        else {
            params.params.start_date = startDate;
            params.params.end_date = endDate;
        }
    }
    else if (['income_basic', 'income_all'].includes(dataType)) {
        // 利润表数据
        if (period) {
            params.params.period = period;
        }
        else {
            params.params.start_date = startDate;
            params.params.end_date = endDate;
        }
    }
    console.log(`请求${dataType}数据，API: ${config.api_name}，参数:`, params.params);
    // 设置请求超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TUSHARE_CONFIG.TIMEOUT);
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`Tushare API请求失败: ${response.status}`);
        }
        const data = await response.json();
        if (data.code !== 0) {
            throw new Error(`Tushare API错误: ${data.msg}`);
        }
        if (!data.data || !data.data.items || data.data.items.length === 0) {
            return { data: [], fields: [] };
        }
        // 获取字段名
        const fieldsArray = data.data.fields;
        // 将数据转换为对象数组
        let resultData = data.data.items.map((item) => {
            const result = {};
            fieldsArray.forEach((field, index) => {
                result[field] = item[index];
            });
            return result;
        });
        // 对dividend数据进行日期范围过滤
        if (dataType === 'dividend') {
            resultData = resultData.filter((item) => {
                // 使用ann_date（公告日期）进行过滤
                const annDate = item.ann_date;
                if (!annDate)
                    return true; // 如果没有公告日期，保留数据
                // 转换日期格式进行比较 (YYYYMMDD格式)
                return annDate >= startDate && annDate <= endDate;
            });
            console.log(`日期范围过滤后剩余${resultData.length}条分红记录`);
        }
        console.log(`成功获取到${resultData.length}条${dataType}数据记录`);
        return { data: resultData, fields: fieldsArray };
    }
    catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}
// 格式化财务数据输出
function formatFinancialData(results, tsCode) {
    let output = `# 📊 ${tsCode} 公司财务表现分析\n\n`;
    const dataTypeNames = {
        forecast: '🔮 业绩预告',
        express: '⚡ 业绩快报',
        indicators: '📊 财务指标',
        dividend: '💵 分红送股',
        mainbz_product: '🏭 主营业务构成(按产品)',
        mainbz_region: '🗺️ 主营业务构成(按地区)',
        mainbz_industry: '🏢 主营业务构成(按行业)',
        holder_number: '👥 股东人数',
        holder_trade: '📊 股东增减持',
        balance_basic: '⚖️ 核心资产负债表',
        balance_all: '⚖️ 完整资产负债表',
        cashflow_basic: '💰 基础现金流量表',
        cashflow_all: '💰 完整现金流量表',
        income_basic: '💹 核心利润表',
        income_all: '💹 完整利润表'
    };
    for (const result of results) {
        const typeName = dataTypeNames[result.type] || result.type;
        output += `## ${typeName}\n\n`;
        if (result.error) {
            output += `❌ 获取失败: ${result.error}\n\n`;
            continue;
        }
        if (!result.data || result.data.length === 0) {
            output += `ℹ️ 暂无数据\n\n`;
            continue;
        }
        // 根据不同数据类型格式化输出
        switch (result.type) {
            case 'forecast':
                output += formatForecast(result.data);
                break;
            case 'express':
                output += formatExpress(result.data);
                break;
            case 'indicators':
                output += formatIndicators(result.data);
                break;
            case 'dividend':
                output += formatDividend(result.data);
                break;
            case 'mainbz_product':
            case 'mainbz_region':
            case 'mainbz_industry':
                output += formatMainBusiness(result.data);
                break;
            case 'holder_number':
                output += formatHolderNumber(result.data);
                break;
            case 'holder_trade':
                output += formatHolderTrade(result.data);
                break;
            case 'balance_basic':
                output += formatBasicBalance(result.data);
                break;
            case 'balance_all':
                output += formatAllBalance(result.data);
                break;
            case 'cashflow_basic':
                output += formatBasicCashFlow(result.data);
                break;
            case 'cashflow_all':
                output += formatCashflowAll(result.data);
                break;
            case 'income_basic':
                output += formatBasicIncome(result.data);
                break;
            case 'income_all':
                output += formatAllIncome(result.data);
                break;
            default:
                output += formatGenericData(result.data, result.fields);
        }
        output += '\n---\n\n';
    }
    return output;
}
// 格式化业绩预告数据
function formatForecast(data) {
    let output = '';
    for (const item of data) {
        output += ` ${item.end_date} 期间预告\n`;
        output += `公告日期: ${item.ann_date}  预告类型: ${getForecastType(item.type)}\n`;
        if (item.p_change_min !== null && item.p_change_max !== null) {
            output += `净利润变动幅度: ${item.p_change_min}% ~ ${item.p_change_max}%\n`;
        }
        if (item.net_profit_min !== null && item.net_profit_max !== null) {
            output += `预计净利润: ${formatNumber(item.net_profit_min)} ~ ${formatNumber(item.net_profit_max)} 万元\n`;
        }
        if (item.last_parent_net)
            output += `上年同期净利润: ${formatNumber(item.last_parent_net)} 万元\n`;
        if (item.summary)
            output += `业绩预告摘要: ${item.summary}\n`;
        if (item.change_reason)
            output += `变动原因: ${item.change_reason}\n`;
        output += '\n';
    }
    return output;
}
// 格式化业绩快报数据
function formatExpress(data) {
    let output = '';
    for (const item of data) {
        output += ` ${item.end_date} 期间快报\n`;
        output += `公告日期: ${item.ann_date}\n\n`;
        if (item.revenue)
            output += `营业收入: ${formatNumber(item.revenue)} 万元\n`;
        if (item.operate_profit)
            output += `营业利润: ${formatNumber(item.operate_profit)} 万元\n`;
        if (item.total_profit)
            output += `利润总额: ${formatNumber(item.total_profit)} 万元\n`;
        if (item.n_income)
            output += `净利润: ${formatNumber(item.n_income)} 万元\n`;
        if (item.total_assets)
            output += `总资产: ${formatNumber(item.total_assets)} 万元\n`;
        if (item.total_hldr_eqy_exc_min_int)
            output += `股东权益: ${formatNumber(item.total_hldr_eqy_exc_min_int)} 万元\n`;
        if (item.diluted_eps)
            output += `每股收益: ${item.diluted_eps} 元\n`;
        if (item.diluted_roe)
            output += `净资产收益率: ${item.diluted_roe}%\n`;
        // 同比增长率
        if (item.yoy_net_profit)
            output += `净利润同比增长: ${item.yoy_net_profit}%\n`;
        if (item.yoy_sales)
            output += `营收同比增长: ${item.yoy_sales}%\n`;
        output += '\n';
    }
    return output;
}
// 格式化财务指标数据
function formatIndicators(data) {
    let output = '';
    for (const item of data) {
        output += ` ${item.end_date} 期间指标\n`;
        output += `公告日期: ${item.ann_date}\n\n`;
        // 盈利能力指标
        output += `盈利能力指标:\n`;
        if (item.eps)
            output += `- 每股收益: ${item.eps} 元\n`;
        if (item.roe)
            output += `- 净资产收益率: ${item.roe}%\n`;
        if (item.roa)
            output += `- 总资产收益率: ${item.roa}%\n`;
        if (item.netprofit_margin)
            output += `- 销售净利率: ${item.netprofit_margin}%\n`;
        if (item.grossprofit_margin)
            output += `- 销售毛利率: ${item.grossprofit_margin}%\n`;
        // 偿债能力指标
        output += `\n偿债能力指标:\n`;
        if (item.current_ratio)
            output += `- 流动比率: ${item.current_ratio}\n`;
        if (item.quick_ratio)
            output += `- 速动比率: ${item.quick_ratio}\n`;
        if (item.debt_to_assets)
            output += `- 资产负债率: ${item.debt_to_assets}%\n`;
        // 营运能力指标
        output += `\n营运能力指标:\n`;
        if (item.inv_turn)
            output += `- 存货周转率: ${item.inv_turn}\n`;
        if (item.ar_turn)
            output += `- 应收账款周转率: ${item.ar_turn}\n`;
        if (item.assets_turn)
            output += `- 总资产周转率: ${item.assets_turn}\n`;
        output += '\n';
    }
    return output;
}
// 格式化分红送股数据
function formatDividend(data) {
    let output = '';
    for (const item of data) {
        output += ` ${item.end_date} 分红方案\n`;
        output += `公告日期: ${item.ann_date}  实施进度: ${item.div_proc || 'N/A'}\n`;
        if (item.stk_div)
            output += `送股比例: 每10股送${item.stk_div}股\n`;
        if (item.stk_bo_rate)
            output += `转股比例: 每10股转${item.stk_bo_rate}股\n`;
        if (item.cash_div)
            output += `现金分红: 每10股派${item.cash_div}元\n`;
        if (item.cash_div_tax)
            output += `税后分红: 每10股派${item.cash_div_tax}元\n`;
        if (item.record_date)
            output += `股权登记日: ${item.record_date}\n`;
        if (item.ex_date)
            output += `除权除息日: ${item.ex_date}\n`;
        if (item.pay_date)
            output += `派息日: ${item.pay_date}\n`;
        output += '\n';
    }
    return output;
}
// 格式化主营业务构成数据
function formatMainBusiness(data) {
    if (!data || data.length === 0) {
        return `暂无数据\n\n`;
    }
    let output = '';
    // 按报告期分组
    const groupedData = {};
    for (const item of data) {
        const period = item.end_date || 'unknown';
        if (!groupedData[period]) {
            groupedData[period] = [];
        }
        groupedData[period].push(item);
    }
    // 按报告期排序（最新的在前）
    const sortedPeriods = Object.keys(groupedData).sort((a, b) => b.localeCompare(a));
    // 为每个报告期生成表格
    for (const period of sortedPeriods) {
        const items = groupedData[period];
        output += `#### 📅 ${period} 报告期\n\n`;
        // 创建表格头
        output += `| 业务项目 | 主营收入(万元) | 主营利润(万元) | 主营成本(万元) | 货币代码 |\n`;
        output += `|---------|-------------|-------------|-------------|----------|\n`;
        // 添加数据行
        for (const item of items) {
            const bzItem = item.bz_item || 'N/A';
            const bzSales = item.bz_sales ? formatNumber(item.bz_sales) : 'N/A';
            const bzProfit = item.bz_profit ? formatNumber(item.bz_profit) : 'N/A';
            const bzCost = item.bz_cost ? formatNumber(item.bz_cost) : 'N/A';
            const currType = item.curr_type || 'CNY';
            output += `| ${bzItem} | ${bzSales} | ${bzProfit} | ${bzCost} | ${currType} |\n`;
        }
        output += '\n';
    }
    return output;
}
// 格式化通用数据
function formatGenericData(data, fields) {
    let output = '';
    for (const item of data) {
        output += ' 数据记录\n';
        for (const field of fields.slice(0, 10)) { // 只显示前10个字段
            if (item[field] !== null && item[field] !== undefined) {
                output += `${field}: ${item[field]}\n`;
            }
        }
        output += '\n';
    }
    return output;
}
// 辅助函数：格式化数字
function formatNumber(num) {
    if (num === null || num === undefined || num === '')
        return 'N/A';
    const number = parseFloat(num);
    if (isNaN(number))
        return 'N/A';
    return number.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
}
// 辅助函数：获取预告类型描述
function getForecastType(type) {
    const typeMap = {
        '1': '预增',
        '2': '预减',
        '3': '扭亏',
        '4': '首亏',
        '5': '续亏',
        '6': '续盈',
        '7': '略增',
        '8': '略减'
    };
    return typeMap[type] || type;
}
// 格式化股东人数数据
function formatHolderNumber(data) {
    if (!data || data.length === 0) {
        return `暂无数据\n\n`;
    }
    let output = '';
    // 按公告日期排序（最新的在前）
    const sortedData = data.sort((a, b) => (b.ann_date || '').localeCompare(a.ann_date || ''));
    // 创建表格头
    output += `| 公告日期 | 截止日期 | 股东户数(户) |\n`;
    output += `|---------|---------|------------|\n`;
    // 添加数据行
    for (const item of sortedData) {
        const annDate = item.ann_date || 'N/A';
        const endDate = item.end_date || 'N/A';
        const holderNum = item.holder_num ? formatNumber(item.holder_num) : 'N/A';
        output += `| ${annDate} | ${endDate} | ${holderNum} |\n`;
    }
    output += '\n';
    output += `📊 数据统计: 共 ${data.length} 条记录\n\n`;
    return output;
}
// 格式化股东增减持数据
function formatHolderTrade(data) {
    if (!data || data.length === 0) {
        return `暂无数据\n\n`;
    }
    let output = '';
    // 按公告日期排序（最新的在前）
    const sortedData = data.sort((a, b) => (b.ann_date || '').localeCompare(a.ann_date || ''));
    // 分类统计
    const increaseData = sortedData.filter(item => item.in_de === 'IN');
    const decreaseData = sortedData.filter(item => item.in_de === 'DE');
    output += `📊 增减持概况: 增持 ${increaseData.length} 条，减持 ${decreaseData.length} 条\n\n`;
    // 创建详细表格
    output += `| 公告日期 | 股东名称 | 股东类型 | 增减持 | 变动数量(万股) | 变动比例(%) | 变动后持股(万股) | 变动后比例(%) | 均价(元) |\n`;
    output += `|---------|---------|---------|--------|-------------|-----------|-------------|-------------|--------|\n`;
    // 添加数据行
    for (const item of sortedData) {
        const annDate = item.ann_date || 'N/A';
        const holderName = item.holder_name || 'N/A';
        const holderType = getHolderType(item.holder_type);
        const inDe = item.in_de === 'IN' ? '🔼 增持' : '🔽 减持';
        const changeVol = item.change_vol ? formatNumber(item.change_vol / 10000) : 'N/A';
        const changeRatio = item.change_ratio ? item.change_ratio.toFixed(4) : 'N/A';
        const afterShare = item.after_share ? formatNumber(item.after_share / 10000) : 'N/A';
        const afterRatio = item.after_ratio ? item.after_ratio.toFixed(4) : 'N/A';
        const avgPrice = item.avg_price ? item.avg_price.toFixed(2) : 'N/A';
        output += `| ${annDate} | ${holderName} | ${holderType} | ${inDe} | ${changeVol} | ${changeRatio} | ${afterShare} | ${afterRatio} | ${avgPrice} |\n`;
    }
    output += '\n';
    // 增减持统计
    if (increaseData.length > 0) {
        output += `### 🔼 增持统计\n\n`;
        const totalIncreaseVol = increaseData.reduce((sum, item) => sum + (item.change_vol || 0), 0);
        output += `- 增持次数: ${increaseData.length} 次\n`;
        output += `- 累计增持数量: ${formatNumber(totalIncreaseVol / 10000)} 万股\n\n`;
    }
    if (decreaseData.length > 0) {
        output += `### 🔽 减持统计\n\n`;
        const totalDecreaseVol = decreaseData.reduce((sum, item) => sum + (item.change_vol || 0), 0);
        output += `- 减持次数: ${decreaseData.length} 次\n`;
        output += `- 累计减持数量: ${formatNumber(totalDecreaseVol / 10000)} 万股\n\n`;
    }
    return output;
}
// 辅助函数：获取股东类型描述
function getHolderType(type) {
    const typeMap = {
        'G': '👤 高管',
        'P': '👤 个人',
        'C': '🏢 公司'
    };
    return typeMap[type] || type;
}
