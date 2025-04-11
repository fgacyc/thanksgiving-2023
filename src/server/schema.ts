import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const cardTable = pgTable("card", {
    id: uuid().primaryKey().defaultRandom(),
    from: text().notNull(),
    to: text().notNull(),
    message: text().notNull(),
    image: text(),
    createdAt: timestamp().notNull().defaultNow()
});
