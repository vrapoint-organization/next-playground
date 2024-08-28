import { FlexCenterDiv, FlexDiv } from "@/src/components/style/Style";
import styled from "@emotion/styled";
import React from "react";
import logo from "public/img/logo.png";

const login = () => {
  return (
    <BackgroundDiv>
      <MainDiv>
        <FlexCenterDiv>
          <LogoImg src={logo.src} alt="logo" />
        </FlexCenterDiv>
        <TitleP>TWINVIZ</TitleP>
        <LoginForm>
          <InputNameSpan>이메일(Email):</InputNameSpan>
        </LoginForm>
      </MainDiv>
    </BackgroundDiv>
  );
};

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
  height: 50%;
  background-color: white;
  border-radius: 20px;
  padding: 16px;
`;

const LogoImg = styled.img`
  width: 10%;
  height: auto;
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
  width: 100%;
`;
const InputNameSpan = styled.span`
  font-weight: 500;
  font-size: var(--fs-h3);
  line-height: var(--lh-h3);
`;

export default login;
