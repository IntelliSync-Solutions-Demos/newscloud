import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  title: string;
  description: string;
  content: string;
  category: string;
  newCategory?: string;
  tags: string;
  files: FileList;
}

const existingCategories = [
  "Today",
  "Feed",
  "Videos",
  "News+",
  "Sports",
  "Puzzles",
  "New Category",
];

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch } = useForm<FormData>();
  const [selectedCategory, setSelectedCategory] = useState("Today");

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("content", data.content);
    formData.append("category", selectedCategory === "New Category" ? data.newCategory || "" : selectedCategory);
    formData.append("tags", data.tags);

    if (data.files) {
      Array.from(data.files).forEach((file) => {
        formData.append("files", file);
      });
    }

    // Here you would typically send the formData to your backend
    console.log("Form submitted:", Object.fromEntries(formData));
    
    toast({
      title: "Content uploaded",
      description: "Your content has been successfully uploaded.",
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
          <DialogDescription>
            Create and share your content with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: true })}
              placeholder="Enter your title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {existingCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory === "New Category" && (
            <div className="space-y-2">
              <Label htmlFor="newCategory">New Category Name</Label>
              <Input
                id="newCategory"
                {...register("newCategory")}
                placeholder="Enter new category name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: true })}
              placeholder="Enter a brief description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...register("content", { required: true })}
              placeholder="Enter your content"
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Upload Files</Label>
            <Input
              id="files"
              type="file"
              multiple
              {...register("files")}
              className="cursor-pointer"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="Enter tags separated by commas"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}