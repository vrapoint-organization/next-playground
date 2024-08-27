import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { appWithTranslation } from "next-i18next";
import ModalProvider from "mui-modal-provider";
import { SocketProvider } from "scripts/SocketProvider";

function App({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <ModalProvider>
        <AppCacheProvider {...pageProps}>
          <Component {...pageProps} />
        </AppCacheProvider>
      </ModalProvider>
    </SocketProvider>
  );
}

export default appWithTranslation(App);
