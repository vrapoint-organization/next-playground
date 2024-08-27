import styled from "@emotion/styled";
import { CheckBox, Padding } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import React from "react";
import { FlexBetween, FlexDiv, TagDiv } from "../../style/Style";
import StarIcon from "@mui/icons-material/Star";

const CardComponent = () => {
  const header = () => {
    return (
      <FlexDiv>
        <FlexBetween>
          <FlexDiv>
            <Checkbox defaultChecked />
            <TypeDiv>3D모델</TypeDiv>
            <p style={{ fontSize: "12px", fontWeight: 800, color: "#616161" }}>
              활성
            </p>
          </FlexDiv>
          <StarIcon style={{ color: "#FFD56D", paddingRight: "8px" }} />
        </FlexBetween>
      </FlexDiv>
    );
  };
  return (
    <Card sx={{ maxWidth: 225 }}>
      <CardHeader component={header} />

      <CardMedia
        component="img"
        height="225"
        image="https://scontent-gmp1-1.xx.fbcdn.net/v/t31.18172-8/17158882_1200780330039318_8303178265317416651_o.jpg?stp=c128.0.768.768a_dst-jpg_s160x160&_nc_cat=102&ccb=1-7&_nc_sid=095f84&_nc_ohc=ZnX-y4lmCnEQ7kNvgE5Ooz3&_nc_ht=scontent-gmp1-1.xx&oh=00_AYCbkG_Lc9nHj0liZ2ldg7dMGfvy8hf9ESLYl-LzPnNryQ&oe=66F4E709"
        alt="Paella dish"
      />
      <CardContent
        sx={{
          "&.MuiCardContent-root:last-child": {
            padding: "8px",
          },
        }}
      >
        <Typography variant="body2" color="#425393" sx={{ fontWeight: 800 }}>
          에셋명1
        </Typography>
        <TagDiv>플라스틱</TagDiv>
        <p style={{ padding: "0px", margin: "0px", fontSize: "12px" }}>
          업데이트 : 2024/08/09
        </p>
        <p style={{ padding: "0px", margin: "0px", fontSize: "12px" }}>300KB</p>
      </CardContent>
    </Card>
  );
};

const TypeDiv = styled.div`
  margin-left: 4px;
  margin-right: 4px;
  border-width: 2px;
  background-color: white;
  border-radius: 12px;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 0.1rem; /* 0.1rem = 1.6px */
  padding-bottom: 0.1rem;
  font-weight: 600; /* font-semibold in Tailwind */
  font-size: 12px;
  border-radius: 15px;
  color: #5087e1;
  border: 1px solid;
  border-color: #5087e1;
`;

export default CardComponent;
