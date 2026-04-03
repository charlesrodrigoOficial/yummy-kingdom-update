"use client";

import { useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  createPizzaCategory,
  deletePizzaCategory,
  updatePizzaCategory,
} from "@/lib/actions/category.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type PizzaCategory = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  productCount: number;
};

const CategoryManager = ({
  initialCategories,
}: {
  initialCategories: PizzaCategory[];
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  const sortedCategories = useMemo(
    () =>
      [...initialCategories].sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" })
      ),
    [initialCategories]
  );

  const onCreate = () => {
    startTransition(async () => {
      const res = await createPizzaCategory({
        name: createName,
        description: createDescription || null,
      });

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });

      if (res.success) {
        setCreateName("");
        setCreateDescription("");
        router.refresh();
      }
    });
  };

  const onStartEdit = (category: PizzaCategory) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingDescription(category.description ?? "");
  };

  const onSaveEdit = () => {
    if (!editingId) return;

    startTransition(async () => {
      const res = await updatePizzaCategory({
        id: editingId,
        name: editingName,
        description: editingDescription || null,
      });

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });

      if (res.success) {
        setEditingId(null);
        setEditingName("");
        setEditingDescription("");
        router.refresh();
      }
    });
  };

  const onDelete = (id: string, name: string) => {
    const isConfirmed = window.confirm(
      `Delete "${name}"? This only works if no menu items are using it.`
    );
    if (!isConfirmed) return;

    startTransition(async () => {
      const res = await deletePizzaCategory(id);
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
      if (res.success) router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border p-4 md:p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create Pizza Category</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="Category name (e.g., Signature Pizza)"
            disabled={isPending}
          />
          <Button
            onClick={onCreate}
            disabled={isPending || createName.trim().length < 2}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add Category
          </Button>
        </div>
        <Textarea
          value={createDescription}
          onChange={(e) => setCreateDescription(e.target.value)}
          placeholder="Short description (optional)"
          className="min-h-24"
          disabled={isPending}
        />
      </div>

      <div className="rounded-xl border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">All Pizza Categories</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Linked Items</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCategories.map((category) => {
                const isEditing = editingId === category.id;
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          disabled={isPending}
                        />
                      ) : (
                        category.name
                      )}
                    </TableCell>
                    <TableCell className="max-w-md">
                      {isEditing ? (
                        <Textarea
                          value={editingDescription}
                          onChange={(e) =>
                            setEditingDescription(e.target.value)
                          }
                          className="min-h-20"
                          disabled={isPending}
                        />
                      ) : (
                        category.description || "No description"
                      )}
                    </TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell>
                      {formatDateTime(category.updatedAt).dateTime}
                    </TableCell>
                    <TableCell className="space-x-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={onSaveEdit}
                            disabled={isPending || editingName.trim().length < 2}
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingId(null)}
                            disabled={isPending}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStartEdit(category)}
                            disabled={isPending}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(category.id, category.name)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
