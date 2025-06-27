import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Category Mappings API
  app.get("/api/category-mappings", async (req, res) => {
    try {
      const mappings = await storage.getCategoryMappings();
      res.json(mappings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category mappings" });
    }
  });

  app.patch("/api/category-mappings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { selectedCategory } = req.body;
      
      if (!selectedCategory) {
        return res.status(400).json({ message: "selectedCategory is required" });
      }
      
      const updated = await storage.updateCategoryMapping(id, selectedCategory);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category mapping" });
    }
  });

  app.post("/api/category-mappings/approve", async (req, res) => {
    try {
      await storage.approveCategoryMappings();
      res.json({ message: "Category mappings approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve category mappings" });
    }
  });

  // Product Variants API
  app.get("/api/product-variants", async (req, res) => {
    try {
      const variants = await storage.getProductVariants();
      res.json(variants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product variants" });
    }
  });

  app.patch("/api/product-variants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { productTags } = req.body;
      
      if (!productTags) {
        return res.status(400).json({ message: "productTags is required" });
      }
      
      const updated = await storage.updateProductVariant(id, productTags);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product variant" });
    }
  });

  app.post("/api/product-variants/create-group", async (req, res) => {
    try {
      const { sourceVariantId, tagText } = req.body;
      
      if (!sourceVariantId || !tagText) {
        return res.status(400).json({ message: "sourceVariantId and tagText are required" });
      }
      
      const newVariant = await storage.createNewGroup(sourceVariantId, tagText);
      res.json(newVariant);
    } catch (error) {
      res.status(500).json({ message: "Failed to create new group" });
    }
  });

  app.post("/api/product-variants/approve", async (req, res) => {
    try {
      await storage.approveProductGroupings();
      res.json({ message: "Product groupings approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve product groupings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
