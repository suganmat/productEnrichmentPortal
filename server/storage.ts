import { users, type User, type InsertUser, categoryMappings, type CategoryMapping, type InsertCategoryMapping, productVariants, type ProductVariant, type InsertProductVariant } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCategoryMappings(): Promise<CategoryMapping[]>;
  updateCategoryMapping(id: number, selectedCategory: string): Promise<CategoryMapping>;
  approveCategoryMappings(): Promise<void>;
  
  getProductVariants(): Promise<ProductVariant[]>;
  updateProductVariant(id: number, productTags: Array<{text: string, type: 'group' | 'product', color: 'blue' | 'red'}>): Promise<ProductVariant>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categoryMappings: Map<number, CategoryMapping>;
  private productVariants: Map<number, ProductVariant>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;

  constructor() {
    this.users = new Map();
    this.categoryMappings = new Map();
    this.productVariants = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize category mappings with sample data
    const categoryData: Omit<CategoryMapping, 'id'>[] = [
      {
        serialNumber: 1,
        incomingSellerCategory: ["Mobile", "Mobile", "Smartphone", "Android"],
        mlSuggestedCategory: "Mobile phones",
        selectedCategory: "Mobile phones"
      },
      {
        serialNumber: 2,
        incomingSellerCategory: ["Home", "Gaming", "Accessories", "Cases"],
        mlSuggestedCategory: "PlayStation accessories",
        selectedCategory: "PlayStation accessories"
      },
      {
        serialNumber: 3,
        incomingSellerCategory: ["Electronics", "Audio", "Headphones"],
        mlSuggestedCategory: "Audio equipment",
        selectedCategory: "Audio equipment"
      }
    ];

    categoryData.forEach(data => {
      const mapping: CategoryMapping = { ...data, id: this.currentCategoryId++ };
      this.categoryMappings.set(mapping.id, mapping);
    });

    // Initialize product variants with sample data
    const productData: Omit<ProductVariant, 'id'>[] = [
      {
        serialNumber: 1,
        seller: "TechMart",
        eeCategory: "Mobile phones",
        brand: "Samsung",
        productTags: [
          { text: "Galaxy S23", type: "group", color: "blue" },
          { text: "256GB", type: "product", color: "red" },
          { text: "Flagship", type: "group", color: "blue" }
        ],
        groupingLogic: "Brand + Model"
      },
      {
        serialNumber: 2,
        seller: "TechMart",
        eeCategory: "Mobile phones",
        brand: "Samsung",
        productTags: [
          { text: "Galaxy S23", type: "group", color: "blue" },
          { text: "128GB", type: "product", color: "red" },
          { text: "Flagship", type: "group", color: "blue" }
        ],
        groupingLogic: "Brand + Model"
      },
      {
        serialNumber: 3,
        seller: "MobileHub",
        eeCategory: "Mobile phones",
        brand: "Apple",
        productTags: [
          { text: "iPhone 14", type: "group", color: "blue" },
          { text: "Pro Max", type: "product", color: "red" },
          { text: "512GB", type: "product", color: "red" }
        ],
        groupingLogic: "Brand + Model"
      }
    ];

    productData.forEach(data => {
      const variant: ProductVariant = { ...data, id: this.currentProductId++ };
      this.productVariants.set(variant.id, variant);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCategoryMappings(): Promise<CategoryMapping[]> {
    return Array.from(this.categoryMappings.values());
  }

  async updateCategoryMapping(id: number, selectedCategory: string): Promise<CategoryMapping> {
    const mapping = this.categoryMappings.get(id);
    if (!mapping) {
      throw new Error("Category mapping not found");
    }
    
    const updated = { ...mapping, selectedCategory };
    this.categoryMappings.set(id, updated);
    return updated;
  }

  async approveCategoryMappings(): Promise<void> {
    // In a real application, this would persist the approved mappings
    console.log("Category mappings approved");
  }

  async getProductVariants(): Promise<ProductVariant[]> {
    return Array.from(this.productVariants.values());
  }

  async updateProductVariant(id: number, productTags: Array<{text: string, type: 'group' | 'product', color: 'blue' | 'red'}>): Promise<ProductVariant> {
    const variant = this.productVariants.get(id);
    if (!variant) {
      throw new Error("Product variant not found");
    }
    
    const updated = { ...variant, productTags };
    this.productVariants.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
