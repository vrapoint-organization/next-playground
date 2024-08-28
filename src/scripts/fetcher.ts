import ax from "axios";

const dropApiUrl = (url: string) => {
  return url.replaceAll("/apis/", "/").replaceAll("/api/", "/");
};

const instance = ax.create({
  baseURL: "/apis",
  timeout: 1000,
  // headers: { "X-Custom-Header": "foobar" },
});

export default {
  instance,
  get: async (...params: Parameters<typeof instance.get>) => {
    // /api를 붙여서 날아오는 요청을 /apis로 rewrite
    if (params.length > 0) {
      params[0] = dropApiUrl(params[0]);
    }
    return await instance.get(...params);
  },
  post: async (...params: Parameters<typeof instance.post>) => {
    if (params.length > 0) {
      params[0] = dropApiUrl(params[0]);
    }
    return await instance.post(...params);
  },
  put: async (...params: Parameters<typeof instance.put>) => {
    if (params.length > 0) {
      params[0] = dropApiUrl(params[0]);
    }
    return await instance.put(...params);
  },
  delete: async (...params: Parameters<typeof instance.delete>) => {
    if (params.length > 0) {
      params[0] = dropApiUrl(params[0]);
    }
    return await instance.delete(...params);
  },
  patch: async (...params: Parameters<typeof instance.patch>) => {
    if (params.length > 0) {
      params[0] = dropApiUrl(params[0]);
    }
    return await instance.patch(...params);
  },
  setHeader: (key: string, value: string) => {
    instance.defaults.headers.common[key] = value;
  },
};
