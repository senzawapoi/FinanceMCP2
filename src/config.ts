export const TUSHARE_CONFIG = {
  /**
   * Tushare API Token – 从环境变量或运行配置里读取
   * 在本地调试可 .env 里写死
   */
  API_TOKEN: process.env.TUSHARE_TOKEN ?? "",

  /** Tushare 服务器地址 */
  API_URL: "https://api.tushare.pro",

  /** 超时 ms */
  TIMEOUT: 10000,
};
