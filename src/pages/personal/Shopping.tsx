import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { amazonProductService, ProductResult } from '@/services/amazon/amazonProductApi';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Filter, 
  Search, 
  XCircle,
  ArrowUpDown,
  SlidersHorizontal
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function PersonalShopping() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [wishlist, setWishlist] = useState<ProductResult[]>(() => {
    const savedWishlist = localStorage.getItem('shopping-wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [error, setError] = useState<string | null>(null);

  // Advanced Filtering State
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'relevance'>('relevance');
  const [availabilityFilter, setAvailabilityFilter] = useState(false);

  // Effect to save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopping-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const categories = [
    'All', 
    'Electronics', 
    'Books', 
    'Clothing', 
    'Home', 
    'Beauty', 
    'Toys'
  ];

  const searchProducts = async () => {
    if (!searchTerm) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await amazonProductService.searchProducts({
        keywords: searchTerm,
        category: category === 'All' ? undefined : category,
        itemsPerPage: 10
      });

      setProducts(results);

      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No products found for your search",
          variant: "default"
        });
      }
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      toast({
        title: "Search Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive"
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized and filtered products
  const filteredAndSortedProducts = useMemo(() => {
    let processedProducts = [...products];

    // Price Range Filter
    processedProducts = processedProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        processedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // Keep original order for 'relevance'
        break;
    }

    return processedProducts;
  }, [products, priceRange, sortBy]);

  const addToWishlist = (product: ProductResult) => {
    if (!wishlist.some(item => item.asin === product.asin)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (asin: string) => {
    setWishlist(wishlist.filter(item => item.asin !== asin));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchProducts();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Amazon Product Search</span>
            <ShoppingCart className="text-primary" />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Discover and save your favorite products
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-grow">
                <Input 
                  placeholder="Search Amazon products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full"
                />
              </div>
              <Select 
                value={category} 
                onValueChange={setCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={searchProducts} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Search size={16} />
                Search
              </Button>
            </div>

            {/* Advanced Filtering Section */}
            <div className="flex items-center space-x-4 mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal size={16} className="mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-4 space-y-4">
                  <DropdownMenuLabel>Price Range</DropdownMenuLabel>
                  <div className="flex items-center space-x-4">
                    <span>${priceRange[0]}</span>
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={1000}
                      step={50}
                      onValueChange={(value: [number, number]) => setPriceRange(value)}
                    />
                    <span>${priceRange[1]}</span>
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuItem 
                    onSelect={() => setSortBy('relevance')}
                    className={sortBy === 'relevance' ? 'bg-accent' : ''}
                  >
                    Relevance
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => setSortBy('price-asc')}
                    className={sortBy === 'price-asc' ? 'bg-accent' : ''}
                  >
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => setSortBy('price-desc')}
                    className={sortBy === 'price-desc' ? 'bg-accent' : ''}
                  >
                    Price: High to Low
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="availability"
                      checked={availabilityFilter}
                      onCheckedChange={(checked) => setAvailabilityFilter(!!checked)}
                    />
                    <label 
                      htmlFor="availability" 
                      className="text-sm font-medium leading-none"
                    >
                      In Stock Only
                    </label>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown size={16} className="mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setSortBy('relevance')}>
                    Relevance
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSortBy('price-asc')}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSortBy('price-desc')}>
                    Price: High to Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator className="my-4" />

            {/* Rest of the component remains the same */}
            {/* Product Catalog and Wishlist sections */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Star size={20} className="text-yellow-500" />
                  Product Catalog
                  {isLoading && (
                    <span className="text-sm text-muted-foreground animate-pulse">
                      Loading...
                    </span>
                  )}
                </h3>
                <AnimatePresence>
                  {filteredAndSortedProducts.length === 0 && !isLoading ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground py-8"
                    >
                      <Filter size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No products match your filters</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {filteredAndSortedProducts.map((product) => (
                        <motion.div
                          key={product.asin}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Product card remains the same */}
                          <Card className="p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-4">
                              {product.imageUrl && (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.title} 
                                  className="w-16 h-16 object-contain rounded"
                                />
                              )}
                              <div className="flex-grow">
                                <h4 className="font-bold line-clamp-1">{product.title}</h4>
                                <p className="text-green-600 font-semibold">
                                  ${product.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => window.open(product.productUrl, '_blank')}
                                >
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => addToWishlist(product)}
                                >
                                  <Heart size={16} className="mr-2" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist section remains the same */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Heart size={20} className="text-red-500" />
                  Wishlist
                  <span className="text-sm text-muted-foreground ml-2">
                    ({wishlist.length})
                  </span>
                </h3>
                {/* Existing wishlist implementation */}
                <AnimatePresence>
                  {wishlist.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground py-8"
                    >
                      <XCircle size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Your wishlist is empty</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {wishlist.map((product) => (
                        <motion.div
                          key={product.asin}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Wishlist product card remains the same */}
                          <Card className="p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-4">
                              {product.imageUrl && (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.title} 
                                  className="w-16 h-16 object-contain rounded"
                                />
                              )}
                              <div className="flex-grow">
                                <h4 className="font-bold line-clamp-1">{product.title}</h4>
                                <p className="text-green-600 font-semibold">
                                  ${product.price.toFixed(2)}
                                </p>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                  >
                                    Remove
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove from Wishlist?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove this item from your wishlist?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => removeFromWishlist(product.asin)}
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
