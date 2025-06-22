/* eslint-disable ts/no-redeclare */
import type { z } from "zod";

import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export * from "./auth";

export const tasks = pgTable("tasks", {
  id: serial()
    .primaryKey(),
  name: text()
    .notNull(),
  done: boolean()
    .notNull()
    .default(false),
  createdAt: timestamp()
    .notNull()
    .defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks);
export type selectTasksSchema = z.infer<typeof selectTasksSchema>;

export const insertTasksSchema = createInsertSchema(
  tasks,
  {
    name: schema => schema.min(1).max(500),
  },
).required({
  done: true,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type insertTasksSchema = z.infer<typeof insertTasksSchema>;

export const patchTasksSchema = insertTasksSchema.partial();
export type patchTasksSchema = z.infer<typeof patchTasksSchema>;
