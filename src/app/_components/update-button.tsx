"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { deleteImage } from "~/server/queries";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { toast } from "sonner";

export function UpdateButton({ idAsNumber }: { idAsNumber: number }) {
  const router = useRouter();

  async function handleUpdate() {
    try {
      await deleteImage(idAsNumber);
      router.push("/");
      toast.success("Image updated successfully!");
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image.");
    }
  }

  return (
    // <Button
    //   type="button"
    //   variant="destructive"
    //   onClick={handleDelete}
    //   className="cursor-pointer"
    // >
    //   Delete
    // </Button>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" className="cursor-pointer">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently update your
            image and its descriptions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
