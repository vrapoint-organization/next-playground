export default class GlobalStore {
  private static _map: Map<string, any> = new Map();
  private constructor() {}
  get map() {
    return GlobalStore._map;
  }
  static set(key: string, value: any) {
    GlobalStore._map.set(key, value);
    return GlobalStore;
  }
  static get<T = any>(key: string): T | undefined {
    return GlobalStore._map.get(key);
  }
  static remove(key: string) {
    GlobalStore._map.delete(key);
    return GlobalStore;
  }

  //iterate
  static forEach(callback: (value: any, key: string) => void) {
    GlobalStore._map.forEach(callback);
    return GlobalStore;
  }
  //size
  static size() {
    return GlobalStore._map.size;
  }
  //has
  static has(key: string) {
    return GlobalStore._map.has(key);
  }
  //keys
  static keys() {
    return GlobalStore._map.keys();
  }
  //values
  static values() {
    return GlobalStore._map.values();
  }
  //entries
  static entries() {
    return GlobalStore._map.entries();
  }
  //clear
  static clear() {
    GlobalStore._map.clear();
    return GlobalStore;
  }

  //bracket operator
}

const __GLOBAL_QUEUE__NAME__ = "__GLOBAL_QUEUE__";
GlobalStore.set(__GLOBAL_QUEUE__NAME__, []);
export const GlobalQueue = {
  push: (value: any) => {
    const queue = [...(GlobalStore.get(__GLOBAL_QUEUE__NAME__) as any[])];
    queue.push(value);
    GlobalStore.set(__GLOBAL_QUEUE__NAME__, queue);
    return GlobalQueue;
  },
  pop: () => {
    const queue = [...(GlobalStore.get(__GLOBAL_QUEUE__NAME__) as any[])];
    const value = queue.pop();
    GlobalStore.set(__GLOBAL_QUEUE__NAME__, queue);
    return value;
  },
  clear: () => {
    GlobalStore.set(__GLOBAL_QUEUE__NAME__, []);
    return GlobalQueue;
  },
  get: () => {
    return [...(GlobalStore.get(__GLOBAL_QUEUE__NAME__) as any[])];
  },
};
