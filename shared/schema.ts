import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categoryMappings = pgTable("category_mappings", {
  id: serial("id").primaryKey(),
  serialNumber: integer("serial_number").notNull(),
  incomingSellerCategory: json("incoming_seller_category").$type<string[]>().notNull(),
  mlSuggestedCategory: text("ml_suggested_category").notNull(),
  selectedCategory: text("selected_category").notNull(),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  serialNumber: integer("serial_number").notNull(),
  seller: text("seller").notNull(),
  eeCategory: text("ee_category").notNull(),
  brand: text("brand").notNull(),
  productTags: json("product_tags").$type<Array<{text: string, type: 'group' | 'product', color: 'blue' | 'red'}>>().notNull(),
  groupingLogic: text("grouping_logic").notNull(),
});

export const insertCategoryMappingSchema = createInsertSchema(categoryMappings).omit({
  id: true,
});

export const insertProductVariantSchema = createInsertSchema(productVariants).omit({
  id: true,
});

export type CategoryMapping = typeof categoryMappings.$inferSelect;
export type InsertCategoryMapping = z.infer<typeof insertCategoryMappingSchema>;
export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;

// Users table (keeping existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
