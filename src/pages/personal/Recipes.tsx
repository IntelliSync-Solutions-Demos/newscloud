import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

// Define Recipe interface with strict typing
interface Recipe {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  ingredients: string[];
  preparation: string;
  cookingDirections: string;
  tags: string[];
}

export default function PersonalRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      title: 'Chocolate Chip Cookies',
      description: 'Classic homemade chocolate chip cookies',
      imageUrl: 'https://example.com/cookies.jpg',
      ingredients: ['Flour', 'Sugar', 'Chocolate Chips', 'Butter', 'Eggs'],
      preparation: '15 minutes',
      cookingDirections: '1. Mix dry ingredients\n2. Cream butter and sugar\n3. Add eggs\n4. Fold in chocolate chips\n5. Bake at 350°F for 12 minutes',
      tags: ['Dessert', 'Baking', 'Quick']
    }
  ]);

  const [newRecipe, setNewRecipe] = useState<Omit<Recipe, 'id'>>({
    title: '',
    description: '',
    imageUrl: '',
    ingredients: [],
    preparation: '',
    cookingDirections: '',
    tags: []
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const availableTags = Array.from(new Set(recipes.flatMap(recipe => recipe.tags)));

  const filteredRecipes = useMemo(() => {
    return selectedTags.length > 0
      ? recipes.filter(recipe => 
          selectedTags.every(tag => recipe.tags.includes(tag))
        )
      : recipes;
  }, [recipes, selectedTags]);

  const addRecipe = () => {
    if (newRecipe.title) {
      const recipeToAdd: Recipe = {
        ...newRecipe,
        id: recipes.length + 1
      };
      setRecipes([...recipes, recipeToAdd]);
      // Reset new recipe state
      setNewRecipe({
        title: '',
        description: '',
        imageUrl: '',
        ingredients: [],
        preparation: '',
        cookingDirections: '',
        tags: []
      });
    }
  };

  const addTag = () => {
    if (newTag && !newRecipe.tags.includes(newTag)) {
      setNewRecipe(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewRecipe(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-2 mb-4">
        {availableTags.map(tag => (
          <Badge 
            key={tag} 
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            onClick={() => 
              setSelectedTags(prev => 
                prev.includes(tag) 
                  ? prev.filter(t => t !== tag) 
                  : [...prev, tag]
              )
            }
            className="cursor-pointer"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Recipe
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Recipe</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input 
                id="title" 
                value={newRecipe.title} 
                onChange={(e) => setNewRecipe(prev => ({ ...prev, title: e.target.value }))} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea 
                id="description" 
                value={newRecipe.description} 
                onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input 
                id="imageUrl" 
                value={newRecipe.imageUrl} 
                onChange={(e) => setNewRecipe(prev => ({ ...prev, imageUrl: e.target.value }))} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ingredients" className="text-right">Ingredients</Label>
              <div className="col-span-3 flex flex-col space-y-2">
                {newRecipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input 
                      value={ingredient} 
                      onChange={(e) => {
                        const newIngredients = [...newRecipe.ingredients];
                        newIngredients[index] = e.target.value;
                        setNewRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                      }} 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => {
                        const newIngredients = newRecipe.ingredients.filter((_, i) => i !== index);
                        setNewRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => setNewRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }))}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="preparation" className="text-right">Preparation Time</Label>
              <Input 
                id="preparation" 
                value={newRecipe.preparation} 
                onChange={(e) => setNewRecipe(prev => ({ ...prev, preparation: e.target.value }))} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cookingDirections" className="text-right">Cooking Directions</Label>
              <Textarea 
                id="cookingDirections" 
                value={newRecipe.cookingDirections} 
                onChange={(e) => setNewRecipe(prev => ({ ...prev, cookingDirections: e.target.value }))} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">Tags</Label>
              <div className="col-span-3 flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <Input 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)} 
                    placeholder="Add a tag" 
                  />
                  <Button variant="outline" onClick={addTag}>
                    <Plus className="mr-2 h-4 w-4" /> Add Tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newRecipe.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center">
                      {tag}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-1 h-4 w-4" 
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={addRecipe}>Save Recipe</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map(recipe => (
          <Card key={recipe.id} className="flex flex-col">
            {recipe.imageUrl && (
              <div className="relative h-48 w-full">
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.title} 
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg" 
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
              {recipe.description && (
                <CardDescription>{recipe.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <div>
                  <strong>Ingredients:</strong>
                  <ul className="list-disc list-inside">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Preparation Time:</strong> {recipe.preparation}
                </div>
                <div>
                  <strong>Cooking Directions:</strong>
                  <pre className="whitespace-pre-wrap text-sm">{recipe.cookingDirections}</pre>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
