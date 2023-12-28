/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    card: {
      from: string;
      to: string;
      message: string;
      image: string | null;
    } | null;
  }>,
) {
  if (req.method === "GET") {
    const id = req.query.id;

    try {
      const card = await db.card.findUnique({
        where: {
          id: id as string,
        },
        select: {
          from: true,
          to: true,
          message: true,
          image: true,
        },
      });
      res.status(200).json({ card: card });
    } catch (err: unknown) {
      throw new Error(err as string);
    }
  }
}
