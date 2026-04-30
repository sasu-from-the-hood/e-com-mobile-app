import { Button } from "@/components/ui/button";
import { IconDots } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/oprc";

interface UserFormData {
  id?: string;
  name: string;
  phoneNumber: string;
  role: string;
  banned: boolean;
}

interface UserColumnProps {
  onEdit: (data: UserFormData) => void;
  onDelete: (id: string) => void;
  onBanToggle: (data: UserFormData) => void;
}

function VendorWarehousesCell({ userId }: { userId: string }) {
  const { data: warehouses = [] } = useQuery({
    queryKey: ["vendorWarehouses", userId],
    queryFn: () => orpc.getVendorWarehouses(userId),
  });

  if ((warehouses as any[]).length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {(warehouses as any[]).map((w: any) => (
        <span key={w.id} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {w.name}
        </span>
      ))}
    </div>
  );
}

export const createUserColumns = ({ onEdit, onDelete, onBanToggle }: UserColumnProps) => [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "phoneNumber", header: "Phone Number" },
  { 
    accessorKey: "banned", 
    header: "Banned",
    cell: (value: boolean) => value ? "Yes" : "No"
  },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "warehouses",
    header: "Warehouses",
    cell: (_value: any, row: UserFormData) =>
      row.role === "vendor" && row.id
        ? <VendorWarehousesCell userId={row.id} />
        : <span className="text-xs text-muted-foreground">—</span>,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: (value: any, row: UserFormData) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(row)} className="cursor-pointer">
            <span>Edit User</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBanToggle(row)} className="cursor-pointer">
            <span>{row.banned ? "Unban User" : "Ban User"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete(row.id!)} 
            className="text-red-600 focus:text-red-600 cursor-pointer"
          >
            <span>Delete User</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
];