/**
 * 全局配置文件
 * 
 * 包含所有工具共享的配置项，如API密钥等
 */

export const TUSHARE_CONFIG = {
  /**
   * Tushare API Token
   * 用户只需在此处修改一次，所有工具都会使用这个值
   */
  API_TOKEN: "Your_API_KEY",
  
  /**
   * Tushare API 服务器地址
   */
  API_URL: "http://api.tushare.pro",
  
  /**
   * API请求超时时间(毫秒)
   */
  TIMEOUT: 10000
}; 
