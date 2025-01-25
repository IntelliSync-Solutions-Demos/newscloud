import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  onClick: () => void;
}

export function UploadButton({ onClick }: UploadButtonProps) {
  return (
    <Button 
      onClick={onClick}
      className="w-full bg-primary"
    >
      Upload Content
    </Button>
  );
}