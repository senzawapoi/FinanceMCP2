import { AsyncLocalStorage } from 'node:async_hooks';
const storage = new AsyncLocalStorage();
export function withRequestContext(ctx, fn) {
    return storage.run(ctx, fn);
}
export function getRequestToken() {
    const store = storage.getStore();
    return store?.tushareToken;
}
