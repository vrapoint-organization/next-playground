import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { appWithTranslation } from "next-i18next";
import ModalProvider from "mui-modal-provider";
import { SocketProvider } from "scripts/SocketProvider";
import { SessionProvider } from "next-auth/react";

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <SocketProvider>
        <ModalProvider>
          <AppCacheProvider {...pageProps}>
            <Component {...pageProps} />
          </AppCacheProvider>
        </ModalProvider>
      </SocketProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(App);
