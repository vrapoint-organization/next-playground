import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { appWithTranslation } from "next-i18next";
import ModalProvider from "mui-modal-provider";

function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <AppCacheProvider {...pageProps}>
        <Component {...pageProps} />
      </AppCacheProvider>
    </ModalProvider>
  );
}

export default appWithTranslation(App);
