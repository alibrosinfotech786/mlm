"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface JoinEventModalProps {
  eventTitle: string;
}

export default function JoinEventModal({ eventTitle }: JoinEventModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 text-xs"
        >
          Join Event
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card text-foreground border border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Join {eventTitle}
          </DialogTitle>
          <DialogDescription>
            Fill in your details to confirm participation.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter your phone" required />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Join Now
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
