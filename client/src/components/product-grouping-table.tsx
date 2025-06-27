import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableTag } from "@/components/draggable-tag";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Info, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ProductVariant } from "@shared/schema";

export function ProductGroupingTable() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProductInfo, setSelectedProductInfo] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<{text: string, variantId: number} | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: variants, isLoading } = useQuery<ProductVariant[]>({
    queryKey: ["/api/product-variants"],
  });

  const updateVariantMutation = useMutation({
    mutationFn: async ({ id, productTags }: { id: number; productTags: Array<{text: string, type: 'group' | 'product', color: 'blue' | 'red'}> }) => {
      const response = await apiRequest("PATCH", `/api/product-variants/${id}`, { productTags });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-variants"] });
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: async ({ sourceVariantId, tagText }: { sourceVariantId: number; tagText: string }) => {
      const response = await apiRequest("POST", "/api/product-variants/create-group", { sourceVariantId, tagText });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/product-variants"] });
      toast({
        title: "New Group Created",
        description: "The tag has been moved to a new group successfully.",
      });
      setShowCreateGroup(false);
      setSelectedTag(null);
    },
  });

  const handleTagClick = (tag: {text: string, type: 'group' | 'product', color: 'blue' | 'red'}, variantId: number) => {
    if (tag.color === 'blue') {
      setSelectedTag({ text: tag.text, variantId });
      setShowCreateGroup(true);
    } else {
      setSelectedProductInfo(tag.text);
      setShowProductDetails(true);
    }
  };

  const handleDrop = (draggedTag: {text: string, type: 'group' | 'product', color: 'blue' | 'red'}, targetRow: ProductVariant) => {
    // Validation: same seller, category, and brand
    const sourceRow = variants?.find(v => v.productTags.some(tag => tag.text === draggedTag.text));
    if (!sourceRow) return;

    // Don't allow dropping on the same row
    if (sourceRow.id === targetRow.id) return;

    if (sourceRow.seller !== targetRow.seller || 
        sourceRow.eeCategory !== targetRow.eeCategory || 
        sourceRow.brand !== targetRow.brand) {
      toast({
        title: "Invalid Drop",
        description: "Items must have the same Seller, EE Category, and Brand to be grouped together.",
        variant: "destructive",
      });
      return;
    }

    // Add tag to target row if it doesn't already exist
    const tagExists = targetRow.productTags.some(tag => tag.text === draggedTag.text);
    if (!tagExists) {
      // Remove tag from source row
      const updatedSourceTags = sourceRow.productTags.filter(tag => tag.text !== draggedTag.text);
      updateVariantMutation.mutate({ id: sourceRow.id, productTags: updatedSourceTags });

      // Add tag to target row
      const updatedTargetTags = [...targetRow.productTags, draggedTag];
      updateVariantMutation.mutate({ id: targetRow.id, productTags: updatedTargetTags });
    }
  };

  const handleCreateGroup = () => {
    if (selectedTag) {
      createGroupMutation.mutate({
        sourceVariantId: selectedTag.variantId,
        tagText: selectedTag.text
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-20">Serial No.</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>EE Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Product/Advert Name</TableHead>
                <TableHead>Grouping Logic</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants?.map((variant) => (
                <TableRow key={variant.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {variant.serialNumber}
                  </TableCell>
                  <TableCell>{variant.seller}</TableCell>
                  <TableCell>{variant.eeCategory}</TableCell>
                  <TableCell>{variant.brand}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {variant.productTags.map((tag, index) => (
                        <DraggableTag
                          key={index}
                          tag={tag}
                          onClick={() => handleTagClick(tag, variant.id)}
                          onDrop={(droppedTag) => handleDrop(droppedTag, variant)}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {variant.groupingLogic}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Group Modal */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Create New Group
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {selectedTag && `Move "${selectedTag.text}" to a new group with the same seller, category, and brand?`}
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateGroup} 
                className="flex-1"
                disabled={createGroupMutation.isPending}
              >
                {createGroupMutation.isPending ? "Creating..." : "Create New Group"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateGroup(false);
                  setSelectedTag(null);
                }} 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Details Modal */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-red-600" />
              Product Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm font-medium text-gray-900">Specification:</p>
                <p className="text-sm text-gray-600">{selectedProductInfo}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium text-gray-900">Availability:</p>
                <p className="text-sm text-gray-600">In Stock</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium text-gray-900">Price Range:</p>
                <p className="text-sm text-gray-600">$899 - $1199</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Last Updated:</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowProductDetails(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DndProvider>
  );
}
