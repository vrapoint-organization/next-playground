import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";
import { useModal } from "mui-modal-provider";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

interface SimpleDialogProps extends DialogProps {
  title: string;
}

// Create the dialog you want to use
const SimpleDialog: React.FC<SimpleDialogProps> = ({ title, ...props }) => (
  <Dialog {...props}>
    <DialogTitle>{title}</DialogTitle>
  </Dialog>
);

function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { showModal } = useModal();

  return (
    <div>
      Home<div>{t("button_okay")}</div>
      <Button
        variant="text"
        onClick={() => showModal(SimpleDialog, { title: "Simple Dialog" })}
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
