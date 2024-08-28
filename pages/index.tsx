import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import styled from "@emotion/styled";
import { useModal } from "mui-modal-provider";
import { Modal } from "@/src/components/common/modal/Modal";
import ButtonComponent from "@/src/components/common/button/Button";
import { FlexEnd } from "@/src/components/style/Style";
import ModalHeader from "@/src/components/common/modal/ModalHeader";
import ModalFooter from "@/src/components/common/modal/ModalFooter";
import TextInput from "@/src/components/common/inputs/TextInput";
import { Select } from "@mui/material";
import SelectInput from "@/src/components/common/inputs/SelectInput";
import SliderInput from "@/src/components/common/inputs/SliderInput";
import AccordionComponent from "@/src/components/common/surfaces/Accordion";
import CardComponent from "@/src/components/common/surfaces/Card";
import TableComponent from "@/src/components/common/dataDisplay/Table";
import { HeadCell, TableData } from "@/src/components/common/type/Type";

const selectItem = [
  { name: "test1", value: "1" },
  { name: "test2", value: "2" },
  { name: "test3", value: "3" },
];

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Dessert (100g serving)",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Calories",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "Fat (g)",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Carbs (g)",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Protein (g)",
  },
];

function createData(
  id: number,
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): TableData {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData(1, "Cupcake", 305, 3.7, 67, 4.3),
  createData(2, "Donut", 452, 25.0, 51, 4.9),
  createData(3, "Eclair", 262, 16.0, 24, 6.0),
  createData(4, "Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData(5, "Gingerbread", 356, 16.0, 49, 3.9),
  createData(6, "Honeycomb", 408, 3.2, 87, 6.5),
  createData(7, "Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData(8, "Jelly Bean", 375, 0.0, 94, 0.0),
  createData(9, "KitKat", 518, 26.0, 65, 7.0),
  createData(10, "Lollipop", 392, 0.2, 98, 0.0),
  createData(11, "Marshmallow", 318, 0, 81, 2.0),
  createData(12, "Nougat", 360, 19.0, 9, 37.0),
  createData(13, "Oreo", 437, 18.0, 63, 4.0),
];

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
      <div style={{ padding: "15px 0px" }}>
        <SelectInput value={"1"} items={selectItem} />
      </div>
      <SliderInput value={25} min={0} max={100} step={0.1} />
      <AccordionComponent title={t("TestAccordion")}>
        <SelectInput value={"1"} items={selectItem} />
        <SliderInput value={25} min={0} max={100} step={0.1} />
      </AccordionComponent>
      <div style={{ padding: "15px 0px" }}>
        <CardComponent />
      </div>
      <div>Locale : {router.locale}</div>
      <TableComponent headCells={headCells} rows={rows} />
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
