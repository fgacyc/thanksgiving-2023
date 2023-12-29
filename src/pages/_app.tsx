import { type AppType } from "next/dist/shared/lib/utils";

import "@/styles/globals.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Thanksgiving | FGACYC</title>
        <meta name="description" content="Happy Thanksgiving!" />
      </Head>
      <Component {...pageProps} />
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default MyApp;
