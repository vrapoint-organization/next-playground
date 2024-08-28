declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    red: true;
    gray: true;
    lightGray: true;
    black: true;
  }
  interface ButtonPropsSizeOverrides {
    regular: true;
    extraSmall: true;
  }
  interface ButtonPropsVariantOverrides {
    fill: true;
    line: true;
    text: true;
  }
}

const ButtonTheme = {
  defaultProps: {
    disableFocusRipple: true,
    disableElevation: true,
  },
  styleOverrides: {
    root: {
      fontWeight: 600,
      textTransform: "none",
      "&.Mui-disabled": {
        color: "var(--gray060)", // gray060
        backgroundColor: "var(--gray040)", // gray040
      },
    },
  },
  variants: [
    {
      props: { size: "small" },
      style: {
        minWidth: "32px",
        padding: "8px 12px",
        fontSize: "var(--fs-b2)",
        lineHeight: "var(--lh-b2)",
        borderRadius: "10px",
      },
    },
    {
      props: { size: "small", variant: "outlined" },
      style: {
        minWidth: "100px",
        padding: "7px 11px",
        fontSize: "var(--fs-b2)",
        lineHeight: "var(--lh-b2)",
      },
    },
    {
      props: { size: "small", variant: "text" },
      style: {
        minWidth: "16px",
        padding: "4px 8px",
        fontSize: "var(--fs-b2)",
        lineHeight: "var(--lh-b2)",
        borderRadius: "10px",
      },
    },
    {
      props: { size: "medium" },
      style: {
        minWidth: "88px",
        padding: "12px 18px",
        fontSize: "var(--fs-b1)",
        lineHeight: "var(--lh-b1)",
      },
    },
    {
      props: { size: "medium", variant: "outlined" },
      style: {
        minWidth: "88px",
        padding: "11px 17px",
        fontSize: "var(--fs-b1)",
        lineHeight: "var(--lh-b1)",
      },
    },
    {
      props: { size: "regular" },
      style: {
        minWidth: "88px",
        padding: "12px 18px",
        fontSize: "var(--fs-b1)",
        lineHeight: "var(--lh-b1)",
        borderRadius: "16px",
      },
    },
    {
      props: { size: "regular", variant: "outlined" },
      style: {
        minWidth: "88px",
        padding: "12px 18px",
        fontSize: "var(--fs-b1)",
        lineHeight: "var(--lh-b1)",
        borderRadius: "16px",
      },
    },
    {
      props: { size: "large" },
      style: {
        minWidth: "98px",
        padding: "16px 24px",
        fontSize: "var(--fs-b1)",
        lineHeight: "var(--lh-b1)",
        borderRadius: "16px",
      },
    },
    {
      props: { size: "large", variant: "outlined" },
      style: {
        minWidth: "98px",
        padding: "15px 23px",
        fontSize: "var(--fs-b1)",
        lineHeight: "var(--lh-b1)",
      },
    },
    {
      props: { size: "extraSmall", variant: "contained" },
      style: {
        minWidth: "32px",
        padding: "5px 8px",
        fontSize: "var(--fs-c1)",
        lineHeight: "var(--lh-c1)",
        borderRadius: "8px",
      },
    },
    {
      // color: gray 일때 line 버튼 스타일 지정 (mui에서 자동으로 들어가면 스타일이 달라서 추가적으로 수정함)
      props: { color: "gray", variant: "outlined" },
      style: {
        borderColor: "var(--gray050)",
        backgroundColor: "var(--white)",
        color: "var(--gray070)",
        "&:hover": {
          borderColor: "var(--gray050)",
          backgroundColor: "var(--gray030)",
        },
        "&.Mui-disabled": {
          borderColor: "var(--gray050)",
          backgroundColor: "var(--white)",
          color: "var(--gray060)",
        },
      },
    },

    {
      // color: gray 일때 text 버튼 스타일 지정 (mui에서 자동으로 들어가면 스타일이 달라서 추가적으로 수정함)
      props: { color: "gray", variant: "text" },
      style: {
        backgroundColor: "var(--white)",
        color: "var(--gray070)",
        "&:hover": {
          backgroundColor: "var(--gray030)",
        },
        "&.Mui-disabled": {
          backgroundColor: "var(--white)",
          color: "var(--gray060)",
        },
      },
    },
    {
      props: { variant: "text" },
      style: {
        "&.Mui-disabled": {
          backgroundColor: "var(--white)",
          color: "var(--gray060)",
        },
      },
    },
  ],
};

export default ButtonTheme;
