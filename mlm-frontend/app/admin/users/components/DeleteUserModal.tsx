"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/app/api/axiosInstance";
import ProjectApiList from "@/app/api/ProjectApiList";
import toast from "react-hot-toast";

type User = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  user: User;
  open: boolean;
  onOpenChange: () => void;
  onDeleted: () => void;
};

export default function DeleteUserModal({ user, open, onOpenChange, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);
      await axiosInstance.post(ProjectApiList.DELETE_USER, { id: user.id });
      toast.success("User deleted");
      onDeleted();
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>

        <p>Are you sure you want to delete <strong>{user.name}</strong> ?</p>

        <DialogFooter>
          <Button className="bg-red-600 text-white" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
