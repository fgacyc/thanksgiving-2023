/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GiftPage } from "@/modules/Gift";
import { type NextPage, type GetServerSideProps } from "next";

export type Card = {
  from: string;
  to: string;
  message: string;
  image: string | null;
  error?: boolean;
};

const Gift: NextPage<Card> = (card) => {
  return <GiftPage {...card} />;
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
        from: card.card.from,
        to: card.card.to,
        message: card.card.message,
        image: card.card.image,
      },
    };
  else
    return {
      props: {
        from: "",
        to: "",
        message: "",
        image: "",
        error: true,
      },
    };
}) satisfies GetServerSideProps<Card>;

export default Gift;
