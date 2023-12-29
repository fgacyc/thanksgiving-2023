/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GiftPage } from "@/modules/Gift";
import { type NextPage, type GetServerSideProps } from "next";
import Head from "next/head";

export type Card = {
  from: string;
  to: string;
  message: string;
  image: string | null;
};

const Gift: NextPage<Card> = (card) => {
  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/OG_IMAGE.jpg" />
        <meta
          property="og:image:secure_url"
          content="https://thanksgiving.fgacyc.com/OG_IMAGE.jpg"
        />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image:alt" content="You Got Mail!" />
      </Head>
      <GiftPage {...card} />
    </>
  );
};

export const getServerSideProps = (async (context) => {
  // Fetch data from external API
  const res = await fetch(
    `https://thanksgiving.fgacyc.com/api/getCard/${
      context.params?.id as string
    }`,
    {
      method: "GET",
    },
  );
  const card = await res.json();

  if (res.ok)
    return {
      props: {
        from: card.card.from ?? "",
        to: card.card.to ?? "",
        message: card.card.message ?? "",
        image: card.card.image ?? "",
      },
    };
  else
    return {
      props: {
        from: "",
        to: "",
        message: "",
        image: "",
      },
    };
}) satisfies GetServerSideProps<Card>;

export default Gift;
