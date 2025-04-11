/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { cardTable } from "@/server/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: string }>,
) {
  if (req.method === "POST") {
    const { from, to, message, image } = JSON.parse(req.body as string);
    console.log(req.body);

    try {
      const rows = await db.insert(cardTable).values({
        from: from,
        to: to,
        message: message,
        image: image,
      }).returning({ id: cardTable.id });

      if (rows.length === 0)
        throw new Error('failed to insert db')

      res.status(200).json({ id: rows[0]!.id });
    } catch (err: unknown) {
      throw new Error(err as string);
    }
  }
}
