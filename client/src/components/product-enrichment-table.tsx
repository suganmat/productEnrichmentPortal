import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import type { ProductSKU } from "@shared/schema";

interface ProductSKUResponse {
  data: ProductSKU[];
  total: number;
}

export function ProductEnrichmentTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('dateUploaded');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    seller: 'all',
    brand: 'all',
    category: 'all',
    status: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery<ProductSKUResponse>({
    queryKey: ['/api/product-skus', currentPage, pageSize, sortBy, sortOrder, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
        ...(filters.seller && { seller: filters.seller }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
      });
      const response = await fetch(`/api/product-skus?${params}`);
      if (!response.ok) throw new Error('Failed to fetch product SKUs');
      return response.json();
    },
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ seller: 'all', brand: 'all', category: 'all', status: 'all' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Saved':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-red-600">Failed to load product SKUs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Product Enrichment</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-normal text-gray-500">
              {data ? `${data.data.length} of ${data.total} products` : 'Loading...'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-products"
              />
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters} data-testid="clear-filters">
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.seller} onValueChange={(value) => handleFilterChange('seller', value === "all" ? "" : value)}>
              <SelectTrigger data-testid="filter-seller">
                <SelectValue placeholder="Filter by Seller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sellers</SelectItem>
                <SelectItem value="Westcoast">Westcoast</SelectItem>
                <SelectItem value="Exertis">Exertis</SelectItem>
                <SelectItem value="TechTrade">TechTrade</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value === "all" ? "" : value)}>
              <SelectTrigger data-testid="filter-brand">
                <SelectValue placeholder="Filter by Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="Samsung">Samsung</SelectItem>
                <SelectItem value="Sony">Sony</SelectItem>
                <SelectItem value="Dell">Dell</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value === "all" ? "" : value)}>
              <SelectTrigger data-testid="filter-category">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Mobile phones">Mobile phones</SelectItem>
                <SelectItem value="Audio equipment">Audio equipment</SelectItem>
                <SelectItem value="Computers">Computers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value === "all" ? "" : value)}>
              <SelectTrigger data-testid="filter-status">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Saved">Saved</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('mpn')}
                    className="h-auto p-0 font-semibold"
                    data-testid="sort-mpn"
                  >
                    MPN
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('productName')}
                    className="h-auto p-0 font-semibold"
                    data-testid="sort-product-name"
                  >
                    Product Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('dateUploaded')}
                    className="h-auto p-0 font-semibold"
                    data-testid="sort-date-uploaded"
                  >
                    Date Uploaded
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('status')}
                    className="h-auto p-0 font-semibold"
                    data-testid="sort-status"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((product) => (
                  <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                    <TableCell className="font-mono text-sm" data-testid={`mpn-${product.id}`}>
                      {product.mpn}
                    </TableCell>
                    <TableCell data-testid={`product-name-${product.id}`}>
                      {product.productName}
                    </TableCell>
                    <TableCell data-testid={`date-uploaded-${product.id}`}>
                      {product.dateUploaded ? format(new Date(product.dateUploaded), 'MMM dd, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell data-testid={`seller-${product.id}`}>
                      {product.seller}
                    </TableCell>
                    <TableCell data-testid={`brand-${product.id}`}>
                      {product.brand}
                    </TableCell>
                    <TableCell data-testid={`category-${product.id}`}>
                      {product.category}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={getStatusColor(product.status)}
                        data-testid={`status-${product.id}`}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
              <SelectTrigger className="w-16" data-testid="page-size-selector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                data-testid="previous-page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                data-testid="next-page"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}