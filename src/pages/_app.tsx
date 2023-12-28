import { type AppType } from "next/dist/shared/lib/utils";

import "@/styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Thanksgiving | FGACYC</title>
        <meta name="description" content="Happy Thanksgiving!" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
