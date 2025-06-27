import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { CategoryMappingTable } from "@/components/category-mapping-table";
import { ProductGroupingTable } from "@/components/product-grouping-table";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("categoryMapping");
  
  const getModelConfidence = () => {
    return activeTab === "categoryMapping" ? "94%" : "87%";
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Category Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">
                <Brain className="w-4 h-4 mr-2" />
                Model Confidence: {getModelConfidence()}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="categoryMapping" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="categoryMapping">Category Mapping</TabsTrigger>
            <TabsTrigger value="productGrouping">Product-variant Grouping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categoryMapping" className="mt-8">
            <CategoryMappingTable />
          </TabsContent>
          
          <TabsContent value="productGrouping" className="mt-8">
            <ProductGroupingTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
