import ENV_PUBLIC from "@/scripts/client/ENV_PUBLIC";
import ax, { AxiosResponse } from "axios";
import { getCookie, setCookie } from "cookies-next";

const dropApiUrl = (url: string) => {
  return url.replaceAll("/apis/", "/").replaceAll("/api/", "/");
};

const instance = ax.create({
  baseURL: "/apis",
  timeout: 1000,
  // headers: { "X-Custom-Header": "foobar" },
});

// 백엔드에서
export type ResType<T = any> = {
  success: boolean;
  responseType: "success" | "error" | "fail";
  data: T;
  errors:
    | {
        code: string;
        data: any;
        message: string;
      }[]
    | null;
};

const reissueToken = async (): Promise<true | false> => {
  const refreshToken = getCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH);
  if (!refreshToken) {
    return false;
  }
  const res = await instance.post("/v2/s/auth/refresh", {
    refreshToken,
  });

  if (!res.data.success) {
    return false;
  }

  const access = res.data.data.accessToken;
  const refresh = res.data.data.refreshToken;

  if (!access || !refresh) {
    console.error("재발급 요청하였으나 토큰이 없음", { res });
    return false;
  }

  // 재발급 성공
  // setCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_ACCESS, res.data.data.accessToken);
  setAccessToken(access);
  setCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH, refresh);

  return true;
};

type FetchFuncType<T> =
  | typeof instance.get<ResType<T>>
  | typeof instance.post<ResType<T>>
  | typeof instance.put<ResType<T>>
  | typeof instance.delete<ResType<T>>
  | typeof instance.patch<ResType<T>>;

const _fetchWithRefresh = async <T = any>(
  fn: FetchFuncType<T>,
  tryRefreshOnFail: boolean,
  ...params: Parameters<typeof fn>
): Promise<T> => {
  //@ts-ignore
  return fn(...params).then(async (res) => {
    // case 1. 성공한 경우 early return
    if (res.data.success) {
      return res.data.data;
    }

    const errors = res.data?.errors;
    if (errors) {
      // case 2. Access token 만료 시 재발급 시도
      if (tryRefreshOnFail) {
        const tokenExpired = errors.some((error) => {
          return error.code === "U102"; // 토큰 만료
        });

        if (tokenExpired) {
          const reissueSuccessful = await reissueToken();
          if (reissueSuccessful) {
            // 재발급 성공 시 자기 자신을 다시 호출
            return _fetchWithRefresh(fn, false, ...params);
          }
        }
      }
    }
    console.error({ res });
    throw new Error("TODO : API에러 핸들링, 콘솔 확인");
  });
};

const get = async <T = any>(
  ...params: Parameters<typeof instance.get>
): Promise<T> => {
  // /api를 붙여서 날아오는 요청을 /apis로 rewrite
  if (params.length > 0) {
    params[0] = dropApiUrl(params[0]);
  }
  return _fetchWithRefresh<T>(instance.get, true, ...params);
};

const post = async <T = any>(...params: Parameters<typeof instance.post>) => {
  if (params.length > 0) {
    params[0] = dropApiUrl(params[0]);
  }
  return _fetchWithRefresh<T>(instance.post, true, ...params);
};

const put = async <T = any>(...params: Parameters<typeof instance.put>) => {
  if (params.length > 0) {
    params[0] = dropApiUrl(params[0]);
  }
  return _fetchWithRefresh<T>(instance.put, true, ...params);
};

const delete_ = async <T = any>(
  ...params: Parameters<typeof instance.delete>
) => {
  if (params.length > 0) {
    params[0] = dropApiUrl(params[0]);
  }
  return _fetchWithRefresh<T>(instance.delete, true, ...params);
};

const patch = async <T = any>(...params: Parameters<typeof instance.patch>) => {
  if (params.length > 0) {
    params[0] = dropApiUrl(params[0]);
  }
  return _fetchWithRefresh<T>(instance.patch, true, ...params);
};

const setAccessToken = (value: string) => {
  const replaced = value.trim().startsWith("bearer ")
    ? value.trim()
    : `bearer ${value.trim()}`;
  instance.defaults.headers.common["USER_AUTH_TOKEN"] = replaced;
};

const defaultExports = {
  _instance: instance, // 최대한 참조하지 않았으면 좋겠다
  get,
  post,
  put,
  delete: delete_,
  patch,
  setAccessToken,
};

export default defaultExports;
