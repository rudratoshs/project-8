import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Shield } from 'lucide-react';
import { Role } from '@/lib/types/role';
import { useToast } from '@/components/ui/use-toast';
import { deleteRole } from '@/lib/api/roles';
import RoleDialog from './RoleDialog';
import { Badge } from '@/components/ui/badge';

interface RoleTableProps {
  roles: Role[];
  onRoleChange: () => void;
}

export default function RoleTable({ roles, onRoleChange }: RoleTableProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (role: Role) => {
    try {
      await deleteRole(role.id);
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      });
      onRoleChange();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete role',
      });
    }
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Roles</h2>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((rp) => (
                      <Badge key={rp.permission.id} variant="secondary">
                        {rp.permission.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(role)}
                      disabled={role.name === 'admin'}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RoleDialog
        role={selectedRole}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={onRoleChange}
      />
    </>
  );
}