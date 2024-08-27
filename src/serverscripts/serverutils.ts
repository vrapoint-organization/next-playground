import { getCookie } from "cookies-next";
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

// getServerSideProps 사용 시 래핑 함수
// 유저가 없으면 홈으로 리다이렉트
export function serverSideUserCheck<T = any>(
  fn: (
    ctx: GetServerSidePropsContext
  ) =>
    | Promise<GetServerSidePropsReturnType<T>>
    | GetServerSidePropsReturnType<T>,
  redirect = "/"
): (
  ctx: GetServerSidePropsContext
) => Promise<GetServerSidePropsReturnType<T>> {
  const returnFunction = async (ctx: GetServerSidePropsContext) => {
    const token = getCookie("user_token", {
      req: ctx.req,
    });
    if (!token) {
      return goHome(redirect);
    }

    const userData = await fetch("/serverUrl");
    if (!userData) {
      return goHome(redirect);
    }

    return {
      user: userData,
      ...(await fn(ctx)),
    };
  };
  return (ctx: GetServerSidePropsContext) => returnFunction(ctx);
}
