import ENV_SERVER from "@/scripts/server/ENV_SERVER";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next/types";

const goHome = (destination: string) => ({
  redirect: {
    destination,
    permanent: false,
  },
});

type GetServerSidePropsReturnType<T = any> = {
  props?: T;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
  notFound?: boolean;
};

export type GetServerSidePropsFunctionType<T = any> = (
  ctx: GetServerSidePropsContext
) => Promise<GetServerSidePropsReturnType<T>> | GetServerSidePropsReturnType<T>;

export const withServerSideTranslations = <T>(
  fn: GetServerSidePropsFunctionType<T>
) => {
  return async (ctx: GetServerSidePropsContext) => {
    const retval = mergeObject(
      {
        props: {
          ...(await serverSideTranslations(ctx.locale ?? "ko", ["common"])),
        },
      },
      await fn(ctx)
    );

    return retval;
  };
};

export const serverSideUserCheck = <T>(
  fn: GetServerSidePropsFunctionType<T> = (ctx) => ({})
) => {
  return withServerSideTranslations(_serverSideUserCheck(fn));
};

// getServerSideProps 사용 시 래핑 함수
// 유저가 없으면 홈으로 리다이렉트
export function _serverSideUserCheck<T = any>(
  fn: GetServerSidePropsFunctionType<T>,
  redirect = "/login"
): (
  ctx: GetServerSidePropsContext
) => Promise<GetServerSidePropsReturnType<T>> {
  const returnFunction = async (ctx: GetServerSidePropsContext) => {
    const accessToken = getCookie(ENV_SERVER.NEXT_PUBLIC_USER_ACCESS, {
      req: ctx.req,
    });
    const refreshToken = getCookie(ENV_SERVER.NEXT_PUBLIC_USER_REFRESH, {
      req: ctx.req,
    });

    // case 1.
    if (!accessToken && !refreshToken) {
      return goHome(redirect);
    }

    // case 2.
    // 액세스토큰으로 유저정보 가져오기
    if (accessToken) {
      const userInfoUrl = ENV_SERVER.SERVER_URL + "api/v2/s/user/info";
      const userDataByAccessToken = await fetch(userInfoUrl, {
        headers: {
          USER_AUTH_TOKEN: `bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .catch((err) => {
          // 서버에러 등의 경우 강제 리디렉트
          console.error("액세스토큰으로 유저정보 가져오기 실패", err);
          return null;
        });

      if (userDataByAccessToken === null) {
        return goHome(redirect);
      }

      if (userDataByAccessToken?.success === true) {
        const retval = mergeObject(
          {
            props: {
              user: userDataByAccessToken,
            },
          },
          await fn(ctx)
        );

        return retval;
      }
    }

    // case 3. 액세스토큰 없거나 만료인 경우 refreshToken으로 재발급
    const refreshUrl = ENV_SERVER.SERVER_URL + "api/v2/s/auth/refresh";
    const userDataByRefreshToken = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
    }).then((res) => res.json());

    const newAccessToken = userDataByRefreshToken?.data?.accessToken;
    const newRefreshToken = userDataByRefreshToken?.data?.refreshToken;

    if (!userDataByRefreshToken || !newAccessToken || !newRefreshToken) {
      console.error("토큰 재발급 실패", {
        userData: userDataByRefreshToken,
        newAccessToken,
        newRefreshToken,
      });
      deleteCookie(ENV_SERVER.NEXT_PUBLIC_USER_ACCESS, {
        req: ctx.req,
        res: ctx.res,
      });
      deleteCookie(ENV_SERVER.NEXT_PUBLIC_USER_REFRESH, {
        req: ctx.req,
        res: ctx.res,
      });
      return goHome(redirect);
    }

    setCookie(ENV_SERVER.NEXT_PUBLIC_USER_REFRESH, newRefreshToken, {
      req: ctx.req,
      res: ctx.res,
    });
    setCookie(ENV_SERVER.NEXT_PUBLIC_USER_ACCESS, newAccessToken, {
      req: ctx.req,
      res: ctx.res,
    });

    const retval = mergeObject(
      {
        props: {
          user: userDataByRefreshToken,
        },
      },
      await fn(ctx)
    );

    return retval;
  };
  return (ctx: GetServerSidePropsContext) => returnFunction(ctx);
}

export function mergeObject<
  T = Record<string, any>,
  R = Record<string, any>,
  U = Record<string, any>
>(target: T, source: R): U {
  // Iterate through all keys in the source object
  const retval = { ...target };
  for (const key in source) {
    // Check if the key exists in both target and source and is an object
    if (
      Object.prototype.hasOwnProperty.call(source, key) &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      // If target has the same key and it's also an object, merge recursively
      //@ts-ignore
      if (typeof retval[key] === "object" && !Array.isArray(retval[key])) {
        //@ts-ignore
        retval[key] = mergeObject(retval[key], source[key]);
      } else {
        // If target doesn't have the same key as an object, assign source's object to target
        //@ts-ignore
        retval[key] = { ...source[key] };
      }
    } else {
      // If it's not an object or array, simply assign the value from source to target
      //@ts-ignore
      retval[key] = source[key];
    }
  }
  return retval as unknown as U;
}
