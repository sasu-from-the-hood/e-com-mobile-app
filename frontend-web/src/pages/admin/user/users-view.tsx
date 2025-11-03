"use client";

import { useState, useEffect } from "react";
import { createUserColumns } from "./user-columns";
import { EnhancedDataTable } from "@/components/enhanced-data-table";
import { authClient } from "@/hooks/auth/auth-client";
import { toast } from "sonner";
import { z } from "zod";

const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format"),
  banned: z.boolean().default(false)
});

interface UserFormData {
  id?: string;
  name: string;
  phoneNumber: string;
  role: string;
  banned: boolean;
  password?: string;
}
import { UserForm } from "./user-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus, IconSearch, IconFilter } from "@tabler/icons-react";

export function UsersView() {
  const [data, setData] = useState<UserFormData[]>([]);
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchUsers = async (search?: string, role?: string, status?: string) => {
    try {
      setLoading(true);
      const query: any = {};
      
      if (search) {
        query.searchValue = search;
        query.searchField = "name";
        query.searchOperator = "contains";
      }
      
      if (role && role !== "all") {
        query.filterField = "role";
        query.filterValue = role;
        query.filterOperator = "eq";
      }
      
      if (status && status !== "all") {
        query.filterField = "banned";
        query.filterValue = status === "banned";
        query.filterOperator = "eq";
      }
      
      const response = await authClient.admin.listUsers({ query });
      if (response.data) {
        const users = response.data.users.map((user: any) => ({
          id: user.id,
          name: user.name || '',
          phoneNumber: user.phoneNumber || '',
          role: user.role || 'user',
          banned: user.banned || false,
        }));
        setData(users);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(searchTerm, roleFilter, statusFilter);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, roleFilter, statusFilter]);

  const handleCreate = async (newRecord: Omit<UserFormData, "id">) => {
    try {
      userFormSchema.omit({ id: true }).parse(newRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
        return;
      }
    }

    try {
      const response = await authClient.admin.createUser({
        email: `${newRecord.name.toLowerCase().replace(/\s+/g, '.')}@temp.com`,
        password: newRecord.password || 'defaultPassword123',
        name: newRecord.name,
        role: newRecord.role as "user" | "admin",
        data: { phoneNumber: newRecord.phoneNumber }
      });
      
      if (response.error) {
        toast.error(response.error.message || 'Failed to create user');
      } else {
        fetchUsers();
        setIsDialogOpen(false);
        toast.success(`User ${newRecord.name} created successfully`);
      }
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdate = async (updatedUser: UserFormData) => {
    try {
      userFormSchema.parse(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
        return;
      }
    }

    try {
      const updateRes = await authClient.admin.updateUser({
        userId: updatedUser.id!,
        data: {
          name: updatedUser.name,
          phoneNumber: updatedUser.phoneNumber
        }
      });
      
      if (updateRes.error) {
        toast.error(updateRes.error.message || 'Failed to update user');
        return;
      }
      
      const roleRes = await authClient.admin.setRole({
        userId: updatedUser.id!,
        role: updatedUser.role as "user" | "admin"
      });
      
      if (roleRes.error) {
        toast.error(roleRes.error.message || 'Failed to update user role');
        return;
      }
      
      await fetchUsers();
      setIsDialogOpen(false);
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (id: string) => {
    const user = data.find(u => u.id === id);
    try {
      const response = await authClient.admin.removeUser({ userId: id });
      if (response.error) {
        toast.error(response.error.message || 'Failed to delete user');
      } else {
        fetchUsers();
        toast.success(`User ${user?.name || 'Unknown'} deleted successfully`);
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleMultiDelete = async (users: UserFormData[]) => {
    try {
     const res =  await Promise.all(
        users.map(user => authClient.admin.removeUser({ userId: user.id! }))
      );
      fetchUsers();
      if(res.some(r => r.error)) {
        const errorMessages = res.filter(r => r.error).map(r => r.error?.message).filter(Boolean);
        return toast.error(errorMessages.join(', ') || 'Failed to delete some users');
      }
      toast.success(`${users.length} users deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete users');
    }
  };

  const handleEdit = (record: UserFormData) => {
    setEditingUser(record);
    setIsDialogOpen(true);
  };

  const handleBanToggle = async (user: UserFormData) => {
    try {
      if (user.banned) {
        const response = await authClient.admin.unbanUser({ userId: user.id! });
        if (response.error) {
          toast.error(response.error.message || 'Failed to unban user');
        } else {
          toast.success('User unbanned successfully');
          await fetchUsers();
        }
      } else {
        const response = await authClient.admin.banUser({ 
          userId: user.id!,
          banReason: 'Banned by admin'
        });
        if (response.error) {
          toast.error(response.error.message || 'Failed to ban user');
        } else {
          toast.success('User banned successfully');
          await fetchUsers();
        }
      }
    } catch (error) {
      toast.error('Failed to update user ban status');
    }
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const columns = createUserColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onBanToggle: handleBanToggle,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto">
          <IconPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <IconFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingUser ? "Edit User" : "Create New User"}</SheetTitle>
            <SheetDescription>
              Please fill out the form below to {editingUser ? "update the user" : "create a new user"}.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 px-4 sm:px-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <UserForm
              onSubmit={editingUser ? handleUpdate : handleCreate}
              initialData={editingUser}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <EnhancedDataTable
        columns={columns}
        data={data}
        onAdd={openCreateDialog}
        onMultiDelete={handleMultiDelete}
        searchPlaceholder="Search users..."
        loading={loading}
      />
    </div>
  );
}