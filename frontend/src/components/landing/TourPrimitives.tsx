import { ReactNode, useRef } from "react";
import * as Select from "@radix-ui/react-select";
import * as Menu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./Tour.module.css";

export function TourSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.selectAnchor} ref={anchor}>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className={styles.select} aria-label={label}>
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={20} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal container={anchor.current}>
          <Select.Content
            className={styles.popup}
            position="popper"
            sideOffset={4}
          >
            <Select.ScrollUpButton className={styles.scrollButton}>
              <ChevronUp size={16} />
            </Select.ScrollUpButton>
            <Select.Viewport>
              {options.map((option) => (
                <Select.Item
                  className={styles.menuItem}
                  key={option}
                  value={option}
                >
                  <Select.ItemText>{option}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={17} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className={styles.scrollButton}>
              <ChevronDown size={16} />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export function TourMenu({
  trigger,
  label,
  children,
}: {
  trigger: ReactNode;
  label: string;
  children: ReactNode;
}) {
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.menuAnchor} ref={anchor}>
      <Menu.Root modal={false}>
        <Menu.Trigger className={styles.menuTrigger} aria-label={label}>
          {trigger}
          <ChevronDown size={19} />
        </Menu.Trigger>
        <Menu.Portal container={anchor.current}>
          <Menu.Content className={styles.popup} align="end" sideOffset={0}>
            {children}
          </Menu.Content>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}
export function MenuAction({
  children,
  onSelect,
  disabled = false,
}: {
  children: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <Menu.Item
      className={styles.menuItem}
      disabled={disabled}
      onSelect={onSelect}
    >
      {children}
    </Menu.Item>
  );
}
export function MenuLink({
  children,
  href,
  download = false,
}: {
  children: ReactNode;
  href: string;
  download?: boolean;
}) {
  return (
    <Menu.Item className={styles.menuItem} asChild>
      <a
        href={href}
        download={download || undefined}
        target={download ? undefined : "_blank"}
        rel={download ? undefined : "noreferrer"}
      >
        {children}
      </a>
    </Menu.Item>
  );
}

export function SortableList({
  ids,
  onMove,
  children,
}: {
  ids: string[];
  onMove: (from: number, to: number) => void;
  children: ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id)
          onMove(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
export function SortableRow({
  id,
  label,
  className = "",
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      className={className}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        zIndex: isDragging ? 3 : undefined,
      }}
    >
      <button
        className={styles.grip}
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${label}`}
        title="Drag to reorder, or press Space then use arrow keys"
      >
        <GripVertical size={23} />
      </button>
      {children}
    </div>
  );
}
