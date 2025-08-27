import * as dotenv from 'dotenv';
import { AsyncLocalStorage } from 'node:async_hooks';
// 加载环境变量：
// 1. 本地开发时，从.env文件加载
// 2. 在Smithery部署时，从配置文件中加载
dotenv.config();
const requestContext = new AsyncLocalStorage();
export function runWithRequestContext(token, fn) {
    return requestContext.run({ tushareToken: token }, fn);
}
export function getRequestToken() {
    return requestContext.getStore()?.tushareToken;
}
function resolveApiToken() {
    // 优先使用请求上下文中的 Token，其次回退到环境变量
    return getRequestToken() ?? process.env.TUSHARE_TOKEN ?? undefined;
}
// 统一配置对象：API_TOKEN 改为 getter，动态读取每请求 Token
export const TUSHARE_CONFIG = {
    /**
     * Tushare API Token（优先使用请求头透传的 Token）
     */
    get API_TOKEN() {
        return resolveApiToken() ?? "";
    },
    /** Tushare 服务器地址 */
    API_URL: "https://api.tushare.pro",
    /** 超时 ms */
    TIMEOUT: 30000,
};
// 开发态输出便于确认来源（不打印实际 Token 值）
if (process.env.NODE_ENV !== 'production') {
    const from = getRequestToken() ? 'request-header' : (process.env.TUSHARE_TOKEN ? 'env' : 'none');
    console.log('Tushare token source:', from);
}
