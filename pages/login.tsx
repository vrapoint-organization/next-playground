import { FlexCenterDiv, FlexDiv } from "@/src/components/style/Style";
import styled from "@emotion/styled";
import React from "react";
import logo from "public/img/logo.png";
import Image from "next/image";
import Checkbox from "@mui/material/Checkbox";
import TextInput from "@/src/components/common/inputs/TextInput";
import ButtonComponent from "@/src/components/common/button/Button";
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";

const login = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <BackgroundDiv>
      <MainDiv>
        <FlexCenterDiv>
          <Image src={logo.src} width={80} height={40} alt="logo" />
        </FlexCenterDiv>
        <TitleP>TWINVIZ</TitleP>
        <LoginForm>
          <InputNameP>이메일(Email):</InputNameP>
          <TextInput
            value={""}
            placeholder="userName@email.com"
            onChange={() => {}}
          />
          <InputNameP>비밀번호(Password):</InputNameP>
          <TextInput
            value={""}
            type="password"
            placeholder="••••••••"
            onChange={() => {}}
          />
          <ForgetPasswordDiv>
            <ForgetPasswordSpan>{t("find_password")}</ForgetPasswordSpan>
          </ForgetPasswordDiv>
          <StayLoginDiv>
            <Checkbox
              sx={{
                "&.MuiCheckbox-root": {
                  paddingLeft: "0",
                },
                ":hover": {
                  border: "none",
                },
              }}
            />
            <InfoSpan>{t("stay_login")}</InfoSpan>
          </StayLoginDiv>

          <ButtonComponent
            type="contained"
            color="primary"
            title={t("login")}
            customStyle={{
              width: "100%",
              padding: "4px 16px",
              borderRadius: "5px",
              fontSize: "12px",
            }}
            onClick={() => {
              router.push("/");
            }}
          />
          <ButtonComponent
            type="outlined"
            color="primary"
            title={t("sign_up")}
            customStyle={{
              width: "100%",
              padding: "4px 16px",
              marginTop: "4px",
              borderRadius: "5px",
              border: "none",
              fontSize: "12px",
              ":hover": {
                border: "none",
              },
            }}
            onClick={() => {}}
          />
        </LoginForm>
      </MainDiv>
    </BackgroundDiv>
  );
};

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

const BackgroundDiv = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("/img/loginBg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const MainDiv = styled.div`
  width: 30%;
  background-color: white;
  border-radius: 20px;
  padding: 16px;
`;

const TitleP = styled.p`
  text-align: center;
  margin: 0;
  font-weight: 600;
  font-size: var(--fs-h1);
  line-height: var(--lh-h1);
  color: var(--primary050);
`;

const LoginForm = styled.form`
  width: 95%;
  padding: 0 16px;
`;
const InputNameP = styled.p`
  font-weight: 600;
  margin-bottom: 8px;
  font-size: var(--fs-b2);
  line-height: var(--lh-b2);
  color: var(--text050);
`;

const ForgetPasswordDiv = styled.div`
  font-size: var(--fs-c1);
  line-height: var(--lh-c1);
  text-align: end;
  padding-top: 8px;
`;

const ForgetPasswordSpan = styled.span`
  cursor: pointer;
  font-weight: 500;
  color: var(--text050);
  :hover {
    font-weight: 700;
  }
`;
const StayLoginDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
`;
const InfoSpan = styled.span`
  font-size: var(--fs-c1);
  line-height: var(--lh-c1);
  font-weight: 500;
  color: var(--text050);
`;

export default login;
