import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";
import { useModal } from "mui-modal-provider";
import { Modal } from "@/src/components/common/modal/Modal";
import SubmitButton from "@/src/components/common/button/SubmitButton";
import { FlexEnd } from "@/src/components/style/Style";
import ModalHeader from "@/src/components/common/modal/ModalHeader";
import ModalFooter from "@/src/components/common/modal/ModalFooter";
import TextInput from "@/src/components/common/input/TextInput";

const MyModal = ({ onClose }) => {
  return (
    <Modal
      open={true}
      footer={
        <div>
          <button
            onClick={() => {
              onClose?.();
            }}
          >
            닫기
          </button>
        </div>
      }
    ></Modal>
  );
};

const Footer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <div style={{ width: "100%" }}>
      <FlexEnd>
        <SubmitButton
          type="outlined"
          color="error"
          title={t("cancel")}
          customStyle={{ marginRight: "5px" }}
          onClick={onClose}
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
};

function Home() {
  const { t } = useTranslation();
  const router = useRouter();

  const { showModal } = useModal();

  // Header Component
  const Header = <ModalHeader title={t("folder_add")} onClose={() => {}} />;
  const Footer = (
    <ModalFooter
      cancel={t("cancel")}
      submit={t("submit")}
      onCancel={() => {
        console.log("취소");
      }}
      onSubmit={() => {
        console.log("승인");
      }}
    />
  );

  // Main Contents Component
  const MainContents = <TextInput value="" onChange={() => {}} />;

  return (
    <div>
      Home<div>{t("button_okay")}</div>
      <Button
        variant="text"
        onClick={() => {
          const modal = showModal(Modal, {
            header: Header,
            width: "640px",
            mainContents: MainContents,
            footer: Footer,
            onClose: () => {
              modal.destroy();
            },
          });
        }}
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
