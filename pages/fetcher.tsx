import ENV_PUBLIC from "@/src/scripts/ENV_PUBLIC";
import ObjectViewer from "@/src/components/ObjectViewer";
import fetcher from "@/src/scripts/fetcher";
import { getCookie, setCookie } from "cookies-next";
import React from "react";

type LoginRes = {
  accessToken: string;
  refreshToken: string;
};

const expiredToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjQ4MjE2ODAsIk5PIjoiTzVZVjhMMTRlcjNicFV0RkRhVzRWZz09IiwiU0lHTkFUVVJFIjoiZThlNjY5ZDFlY2ZmYzIwZDg0MTFlNjFkZDc1ODc2YmI4Y2QxMWFhOTI0M2VjYjQzNWExYWI4NmNkMDdjNjMxOSIsImlzcyI6ImF1dGgwIn0.wapQRHv02DbYepRcRvgafhfuU2XNTBQC-EMZxWYR9bM";

function FetchTest() {
  const [check, setCheck] = React.useState<any[]>([]);
  const [lastAccess, setLastAccess] = React.useState<string | null>(null);

  const speakRefreshToken = () => {
    const refresh = getCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH);
    console.log({ refresh });
  };

  return (
    <div>
      FetchTest
      <button
        onClick={async () => {
          const res = await fetcher.get("/api/test/ok");
          console.log({ res });
          setCheck((prev) => [...prev, res]);
        }}
      >
        Server health check
      </button>
      <button
        onClick={async () => {
          const res = await fetcher.post<LoginRes>("/api/v2/s/auth/login", {
            email: "stan",
            password: "stan",
          });
          console.log({ res });
          setCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH, res.refreshToken);
          setLastAccess(res.accessToken);
          setCheck((prev) => [...prev, res]);
        }}
      >
        Login with id:stan, pw:stan
      </button>
      <button
        onClick={async () => {
          fetch("/apis/v2/s/asset?no=450", {
            headers: {
              USER_AUTH_TOKEN: `bearer ${expiredToken}`,
            },
          })
            .then((res) => res.json())
            .then((res) => {
              const hasExpired = res?.errors?.some(
                (err: { code: string }) => err?.code === "U102"
              );
              setCheck((prev) => [...prev, { accessTokenExpired: hasExpired }]);
            });
        }}
      >
        만료된 토큰 확인
      </button>
      <button
        onClick={async () => {
          const instance = fetcher._instance;
          fetcher.setAccessToken(expiredToken);
          speakRefreshToken();
          // const res = await fetcher.get<{}>("/api/v2/s/asset?no=450", {
          //   headers: {
          //     USER_AUTH_TOKEN: `bearer ${expiredToken}`,
          //   },
          // });
          const res = await fetcher.get<{}>("/api/v2/s/asset?no=450");
          console.log({ res });
          speakRefreshToken();
          setCheck((prev) => [...prev, res]);
        }}
      >
        만료된 토큰으로 요청 후 access/refresh 갱신 확인
      </button>
      <div>
        <ObjectViewer objectData={check}></ObjectViewer>
      </div>
    </div>
  );
}

export default FetchTest;
