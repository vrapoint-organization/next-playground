import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

function Home() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div>
      Home<div>{t("button_okay")}</div>
      <div>Locale : {router.locale}</div>
    </div>
  );
}

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "ko", ["common"])),
      // Will be passed to the page component as props
    },
  };
}

export default Home;
