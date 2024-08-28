import { ThemeOptions } from "@mui/material";
import ButtonTheme from "./buttonTheme";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    "dialog-sm": true;
    "dialog-md": true;
    "dialog-lg": true;
    mobile: true;
    tablet: true;
    laptop: true;
    laptop_lg: true;
    desktop_sm: true;
    desktop: true;
  }

  interface Palette {
    gray: Palette["primary"];
    lightGray: Palette["primary"];
    black: Palette["primary"];
  }
  interface PaletteOptions {
    gray: PaletteOptions["primary"];
    lightGray: PaletteOptions["primary"];
    black: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Tabs" {
  interface TabsPropsTextColorOverrides {
    red: true;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    sky: true;
    yellow: true;
  }
}

const customTheme: ThemeOptions = {
  breakpoints: {
    keys: [
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "dialog-sm",
      "dialog-md",
      "dialog-lg",
      "mobile",
      "tablet",
      "laptop",
      "laptop_lg",
      "desktop_sm",
      "desktop",
    ],
    values: {
      // extra-small
      xs: 0,
      // small
      sm: 600,
      // medium
      md: 900,
      // large
      lg: 1200,
      // extra-large
      xl: 1536,
      "dialog-sm": 400,
      "dialog-md": 560,
      "dialog-lg": 980,
      mobile: 0,
      tablet: 768,
      laptop: 1024,
      laptop_lg: 1280,
      desktop_sm: 1440,
      desktop: 1728,
    },
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif",
  },
  palette: {
    error: {
      main: "#c7000d", // coral 100
    },
    primary: {
      light: "#6477d1", // primary040
      main: "#3b82f6", // primary050
      dark: "#1f3061", // primary080
      contrastText: "#fff", // white
    },
    gray: {
      light: "#fafafa", // gray 020
      main: "#f5f5f5", // gray 030
      dark: "#eeeeee", // gray 040
      contrastText: "#616161", // gray070
    },
    lightGray: {
      // disabled 상태인거 처럼 보이면서 클릭이 가능한 버튼 표현에 사용
      light: "#EEEEEE", // gray 040
      main: "#EEEEEE", // gray 040
      dark: "#EEEEEE", // gray 040
      contrastText: "#9E9E9E", // gray 060
    },
    black: {
      light: "#616161", // gray 080
      main: "#424242", // gray 090
      dark: "#212121", // gray 100
      contrastText: "#fff",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "var(--fs-b1)",
          lineHeight: "var(--lh-b1)",
          color: "var(--gray070)",
          "&.Mui-disabled": {
            color: "var(--gray060)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "var(--fs-b1)",
          lineHeight: "var(--lh-b1)",
          color: "var(--gray070)",
          "&.MuiInputBase-adornedEnd": {
            paddingRight: "20px",
          },
          "&:not(.Mui-focused):not(.Mui-error):not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "var(--gray070)",
            },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
          },
          "&.Mui-disabled:not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--gray040)",
          },
        },
        input: {
          color: "var(--gray090)",
          padding: "8px 16px",
          "&.Mui-disabled": {
            color: "var(--gray060)",
            "-webkit-text-fill-color": "var(--gray060)",
          },
          "&::placeholder": {
            color: "var(--gray070)",

            opacity: 1,
          },
        },
        notchedOutline: {
          borderColor: "var(--gray050)",
          borderRadius: "5px",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "var(--fs-c1)",
          lineHeight: "var(--lh-c1)",
        },
      },
    },
    MuiButton: ButtonTheme,
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "var(--fs-h4)",
          lineHeight: "var(--lh-h4)",
          color: "var(--black)",
          padding: "28px 32px 8px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "0",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 32px 28px",
          "&>:not(:first-of-type)": {
            marginLeft: "12px",
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--gray020)",
          borderRadius: "16px",
        },
      },
    },
  },
};

export default customTheme;
