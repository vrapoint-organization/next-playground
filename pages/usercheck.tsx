import { serverSideUserCheck } from "@/src/serverscripts/serverutils";
import { setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import React from "react";

type PageProps = {
  randomValue: number;
};

function asdf({ randomValue }: PageProps) {
  return (
    <div>
      asdf
      <button
        onClick={() => {
          setCookie("cookiekey", "cookie from client");
        }}
      >
        set cookie
      </button>
      <div>randomValue:{randomValue}</div>
      {/* <div>cookieValue:{cookieValue}</div> */}
    </div>
  );
}

export const getServerSideProps = serverSideUserCheck<PageProps>(
  (ctx: GetServerSidePropsContext) => {
    const randomValue = Math.random();
    return {
      props: { randomValue },
    };
  }
);

export default asdf;
