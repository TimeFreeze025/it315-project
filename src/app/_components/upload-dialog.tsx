"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { set } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { UploadButton, useUploadThing } from "~/utils/uploadthing";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { getImage } from "~/server/queries";
import { id } from "zod/v4/locales";

const formSchema = z.object({
  imageName: z
    .string()
    .min(5, { message: "Image Name must be at least 5 characters long" })
    .max(50),
});

export function UploadDialog({ idAsNumber }: { idAsNumber: number | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(
    null,
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageName: "",
    },
  });

  useEffect(() => {
    async function fetchImage() {
      if (idAsNumber !== null) {
        const [image] = await getImage(idAsNumber);
        setSelectedImageUrl(image?.imageUrl || null);
        setSelectedImageName(image?.imageName || null);
      }
    }
    fetchImage();
  }, [open, selectedImageUrl, selectedImageName]);

  useEffect(() => {
    if (idAsNumber !== null && selectedImageName) {
      form.reset({
        imageName: selectedImageName,
      });
    } else if (idAsNumber === null) {
      // Reset to empty for new uploads
      form.reset({
        imageName: "",
      });
    }
  }, [idAsNumber, selectedImageName, form]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImageName(file.name);
      setSelectedImageUrl(URL.createObjectURL(file));
    } else {
      setSelectedImageName(null);
      setSelectedImageUrl(null);
      toast.error(`Please select a valid image file.`);
    }
  };

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      toast(
        <div className="flex items-center gap-2">
          <span className="text-lg">Uploading...</span>
        </div>,
        {
          duration: 100000, // Keep the toast open for a long time
          id: "upload-begin",
        },
      );
    },
    onUploadError: (error) => {
      toast.dismiss("upload-begin");
      toast.error(
        <span className="text-lg">Upload Error {error.message}</span>,
      );
    },
    onClientUploadComplete: () => {
      toast.dismiss("upload-begin");
      toast.success(<span className="text-lg">Upload Complete!</span>);
      router.refresh();
    },
  });

  const handleImageUpload = async () => {
    if (!inputRef.current?.files?.length) {
      toast.warning(<span className="text-lg">No File Selected!</span>);
      return;
    }
    const selectedImage = Array.from(inputRef.current.files);
    await startUpload(selectedImage, {
      imageId: idAsNumber ? idAsNumber.toString() : "",
      imageName: form.getValues("imageName"),
    });
    setSelectedImageName(null);
    setSelectedImageUrl(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setOpen(false);
    await handleImageUpload();
  }

  return (
    // <UploadButton
    //   endpoint="imageUploader"
    //   onClientUploadComplete={(res) => {
    //     // Do something with the response
    //     console.log("Files: ", res);
    //     // alert("Upload Completed");
    //     toast.success("Upload Completed");
    //     router.refresh();
    //   }}
    //   onUploadError={(error: Error) => {
    //     // Do something with the error.
    //     // alert(`ERROR! ${error.message}`);
    //     toast.error(`ERROR! ${error.message}`);
    //   }}
    // />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {idAsNumber === null ? (
          <Button variant="outline">Upload Image</Button>
        ) : (
          <Button variant="default">Upload Image</Button>
        )}
        {/* <Button variant="outline">Upload Image</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Select an image to upload. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {selectedImageUrl !== null && (
            <div className="max-h-[60vh]">
              <img
                src={selectedImageUrl}
                alt={selectedImageName || "Selected Image"}
                className="max-h-full w-full rounded-md object-contain"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              onClick={() => inputRef.current?.click()}
            >
              <Upload />
            </Button>
            <input
              type="file"
              ref={inputRef}
              className="sr-only"
              accept="image/"
              onChange={handleImageSelect}
            />
            {setSelectedImageName !== null && (
              <div>Selected Image: {selectedImageName}</div>
            )}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="imageName"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Image Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Image Name" {...field} />
                  </FormControl> */}
                  {idAsNumber === null ? (
                    <div>
                      <div className="pb-4">
                        <FormLabel>Image Name</FormLabel>
                      </div>
                      <FormControl>
                        <Input placeholder="Image Name" {...field} />
                      </FormControl>
                    </div>
                  ) : (
                    <div>
                      <div className="pb-4">
                        <FormLabel>Updated Image Name</FormLabel>
                      </div>
                      <FormControl>
                        <Input placeholder="Updated Image Name" {...field} />
                      </FormControl>
                    </div>
                  )}
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isUploading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
