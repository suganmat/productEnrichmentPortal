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

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'tag',
    drop: (droppedTag: Tag) => {
      if (droppedTag.text !== tag.text && droppedTag.color === 'blue') {
        onDrop(droppedTag);
      }
    },
    canDrop: (droppedTag: Tag) => {
      return droppedTag.color === 'blue' && droppedTag.text !== tag.text;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDoubleClick = () => {
    onClick();
  };

  const setRefs = (node: HTMLDivElement) => {
    if (tag.color === 'blue') {
      drag(drop(node));
    } else {
      // Red tags can only be drop targets, not draggable
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
        isDragging && "opacity-50 transform scale-105",
        isOver && canDrop && "ring-2 ring-green-500 ring-offset-1 bg-green-50",
        isOver && !canDrop && "ring-2 ring-red-500 ring-offset-1 bg-red-50",
        tag.color === 'blue' && "cursor-move shadow-sm",
        tag.color === 'red' && "cursor-default"
      )}
      onDoubleClick={handleDoubleClick}
    >
      {tag.text}
    </Badge>
  );
}
