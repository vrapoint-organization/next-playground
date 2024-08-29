import ENV_PUBLIC from "@/scripts/client/ENV_PUBLIC";
import fetcher from "./fetcher";
import IError from "./IError";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getCookie, setCookie } from "cookies-next";

type LoginRes = {
  accessToken: string;
  refreshToken: string;
};

type ErrorPolicy = {
  ignoreDefaultErrorHandling?: boolean;
  routeToOnError?: string | "back"; // undefined인 경우 에러에도 라우트이동 없음, 경로를 지정하면 해당 경로로 이동, "back"인 경우 뒤로가기
  messageEmitter?: (message: string) => any;
};

const defaultErrorPolicy: ErrorPolicy = {
  ignoreDefaultErrorHandling: true,
  routeToOnError: undefined,
  messageEmitter: (message: string) => console.error(message),
};

// 공통 처리 기능들
class _API {
  router: AppRouterInstance;
  option: ErrorPolicy;
  protected constructor(router: AppRouterInstance, errorPolicy?: ErrorPolicy) {
    this.router = router;
    this.option = { ...defaultErrorPolicy, ...(errorPolicy ?? {}) };
  }

  // 입력된 키값만 오버라이드
  setPolicy(policy: ErrorPolicy) {
    this.option = { ...this.option, ...policy };
  }

  // 기본값으로 리셋
  resetPolicy() {
    this.option = { ...defaultErrorPolicy };
  }

  protected _goHomeOnError(policy?: ErrorPolicy) {
    if (policy?.routeToOnError) {
      if (policy.routeToOnError === "back") {
        this.router.back();
      } else {
        this.router.push(policy.routeToOnError);
      }
    }
  }

  protected _handleCommonError(
    onError?: (err: IError) => void,
    errorPolicy?: ErrorPolicy
  ) {
    const _errorPolicy = { ...this.option, ...(errorPolicy ?? {}) };
    return (err: IError) => {
      if (ENV_PUBLIC.IS_DEV) {
        console.error(err);
      }
      if (onError) {
        onError(err);
      }
      if (!_errorPolicy.ignoreDefaultErrorHandling) {
        // default error handling

        // 순차적으로 실행한다.
        for (let i = 0; i < err.codes.length; i++) {
          switch (err.codes[i].code) {
            case "400": //일반적으로 요청이 잘못된 경우
            case "500": //서버오류
            case "ORG401": //조직 권한이 없는 사용자
            case "ORG404": // 조직이 없는 사용자
            case "C404": // 컨텐츠가 없는 경우
            case "F400": // 파일 용량이 너무 큰 경우
              _errorPolicy.messageEmitter?.(
                err.codes[i].message || "Bad Request"
              );
              this._goHomeOnError(_errorPolicy);
              break;

            default:
              // 핸들되지 않은 에러는 그냥 죽는다
              throw new IError([
                {
                  code: "500",
                  message:
                    "Unknown Error Occurred. Please contact the administrator.",
                  data: {},
                },
              ]);
          }
        }
      }

      return undefined;
    };
  }
}

export default class API extends _API {
  constructor(router: AppRouterInstance, errorPolicy?: ErrorPolicy) {
    super(router, errorPolicy);
  }

  // 로그인 성공 시 accessToken을 요청헤더에 항상 첨부, refreshToken 저장
  login(
    email: string,
    password: string,
    onSuccess?: (res: LoginRes) => void,
    onError?: (err: IError) => void,
    errorPolicy?: ErrorPolicy // 각 API별로 넣어준 정책은 디폴트보다 우선함
  ) {
    return fetcher
      .post<LoginRes>("/api/v2/s/auth/login", {
        email,
        password,
      })
      .then((res: LoginRes) => {
        // return res;
        fetcher.setAccessToken(res.accessToken);
        setCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_ACCESS, res.accessToken);
        setCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH, res.refreshToken);
        onSuccess?.(res);
      })
      .catch(this._handleCommonError(onError, errorPolicy));
  }

  refreshToken() {
    return fetcher
      .post<LoginRes>("/api/v2/s/auth/refresh", {
        refreshToken: getCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH),
      })
      .then((res: LoginRes) => {
        fetcher.setAccessToken(res.accessToken);
        setCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH, res.refreshToken);
        return res;
      });
  }
}
