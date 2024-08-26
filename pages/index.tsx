import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";
import { useModal } from "mui-modal-provider";
import { Modal } from "@/src/component/common/modal/Modal";
import SubmitButton from "@/src/component/common/button/SubmitButton";
import { FlexEnd } from "@/src/component/style/Style";
import ModalHeader from "@/src/component/common/modal/ModalHeader";

function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { showModal } = useModal();

  // Header Component
  const Header = <ModalHeader title={t("folder_add")} />;

  // Main Contents Component
  const MainContents = (
    <input
      type="text"
      placeholder={t("new_folder_name")}
      style={{ width: "100%" }}
    />
  );

  // Footer Component
  const Footer = (
    <div style={{ width: "100%" }}>
      <FlexEnd>
        <SubmitButton
          type="outlined"
          color="error"
          title={t("cancel")}
          customStyle={{ marginRight: "5px" }}
          onClick={() => console.log("Cancel")}
        />
        <SubmitButton
          type="contained"
          color="primary"
          title={t("add")}
          onClick={() => console.log("Add")}
        />
      </FlexEnd>
    </div>
  );

  return (
    <div>
      Home<div>{t("button_okay")}</div>
      <Button
        variant="text"
        onClick={() =>
          showModal(Modal, {
            header: Header,
            width: "640px",
            mainContents: MainContents,
            footer: Footer,
          })
        }
      >
        Text
      </Button>
      <Box>Box</Box>
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

const Box = styled.div`
  background-color: red;
`;

export default Home;
