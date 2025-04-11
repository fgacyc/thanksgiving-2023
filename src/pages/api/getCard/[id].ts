/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import { cardTable } from "@/server/schema";
import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    card?: {
      from: string;
      to: string;
      message: string;
      image: string | null;
    } | null;
    error?: string;
  }>,
) {
  if (req.method === "GET") {
    const id = req.query.id;

    try {
      const rows = await db.select().from(cardTable).where(eq(cardTable.id, id as string));
      if (rows.length === 0)
        res.status(404).json({ error: "No card found." })
      else
        res.status(200).json({ card: rows[0] })
    } catch (err: unknown) {
      throw new Error(err as string);
    }
  }
}
