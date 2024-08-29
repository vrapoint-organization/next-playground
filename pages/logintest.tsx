import ENV_PUBLIC from "@/scripts/client/ENV_PUBLIC";
import ObjectViewer from "@/src/components/ObjectViewer";
import { translateAndUserCheck } from "@/src/serverscripts/serverutils";
import { deleteCookie, getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function logintest() {
  const router = useRouter();
  const { t } = useTranslation();
  const [tokens, setTokens] = useState<{
    accessToken: string;
    refreshToken: string;
  } | null>(null);

  const updateToken = () => {
    const access = getCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_ACCESS);
    const refresh = getCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH);
    setTokens({ accessToken: access ?? "", refreshToken: refresh ?? "" });
  };
  useEffect(() => {
    updateToken();
  }, []);

  return (
    <div>
      로그인해야만 볼 수 있는 페이지
      <div>번역테스트 : {t("button_okay")}</div>
      <button
        onClick={() => {
          deleteCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_ACCESS);
          updateToken();
          router.reload();
        }}
      >
        액세스 삭제 후 리로드
      </button>
      <button
        onClick={() => {
          deleteCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_REFRESH);
          updateToken();
          router.reload();
        }}
      >
        리프레시 삭제 후 리로드
      </button>
      <ObjectViewer objectData={tokens ?? {}}></ObjectViewer>
    </div>
  );
}

export const getServerSideProps = translateAndUserCheck();

export default logintest;
