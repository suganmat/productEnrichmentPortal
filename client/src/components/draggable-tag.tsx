import { useDrag, useDrop } from "react-dnd";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Tag {
  text: string;
  type: 'group' | 'product';
  color: 'blue' | 'red';
}

interface DraggableTagProps {
  tag: Tag;
  onClick: () => void;
  onDrop: (droppedTag: Tag) => void;
}

export function DraggableTag({ tag, onClick, onDrop }: DraggableTagProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'tag',
    item: tag,
    canDrag: tag.color === 'blue',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'tag',
    drop: (droppedTag: Tag) => {
      if (droppedTag.text !== tag.text) {
        onDrop(droppedTag);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleDoubleClick = () => {
    onClick();
  };

  const setRefs = (node: HTMLDivElement) => {
    if (tag.color === 'blue') {
      drag(drop(node));
    } else {
      drop(node);
    }
  };

  return (
    <Badge
      ref={setRefs}
      variant={tag.color === 'blue' ? 'secondary' : 'destructive'}
      className={cn(
        "cursor-pointer transition-all duration-200",
        tag.color === 'blue' 
          ? "bg-blue-100 text-blue-800 hover:bg-blue-200" 
          : "bg-red-100 text-red-800 hover:bg-red-200",
        isDragging && "opacity-50",
        isOver && "ring-2 ring-primary ring-offset-1",
        tag.color === 'blue' && "cursor-move"
      )}
      onDoubleClick={handleDoubleClick}
    >
      {tag.text}
    </Badge>
  );
}
