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