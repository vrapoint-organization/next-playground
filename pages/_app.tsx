import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { appWithTranslation } from "next-i18next";
import ModalProvider from "mui-modal-provider";
import { SocketProvider } from "scripts/SocketProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import customTheme from "theme/muiTheme";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../styles/font/Pretendard/PretendardVariable.woff2",
  preload: true,
  display: "block",
});

const muiFontFallback = customTheme.typography?.fontFamily;
const theme = createTheme({
  ...customTheme,
  typography: {
    fontFamily:
      pretendard.style.fontFamily + muiFontFallback
        ? `, ${muiFontFallback}`
        : "",
  },
});

function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={pretendard.className}
      style={{ height: "100%" }}
      id="main-container"
    >
      <SocketProvider>
        <ModalProvider>
          <AppCacheProvider>
            <ThemeProvider theme={theme}>
              <Component {...pageProps} />
            </ThemeProvider>
          </AppCacheProvider>
        </ModalProvider>
      </SocketProvider>
    </main>
  );
}

export default appWithTranslation(App);
