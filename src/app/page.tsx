import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic"; // This page is dynamic and should not be cached

async function Images() {
  // const mockUrls = [
  //   "https://www.jedishop.eu/_obchody/www.jedishop.cz/prilohy/675/character-vocal-series-01-hatsune-miku-pvc-soska-1.jpg.big.jpg",
  //   "https://images.immediate.co.uk/production/volatile/sites/3/2025/01/hatsune-miku-fortnite-e23a13b.jpg?resize=1366,910",
  //   "https://bm1mkaq6i6.ufs.sh/f/vVnKMogA5mBcE7CgZBTbQsL2P64R0Z5wX3hpB7rqIxiyukSo",
  //   "https://bm1mkaq6i6.ufs.sh/f/vVnKMogA5mBccqOC7MK0LE236HjuyDFnkZgl98warKhezicN",
  // ];

  // const images = mockUrls.map((url, index) => ({
  //   id: index + 1,
  //   url,
  // }));

  const images = await getMyImages();

  return (
    <div>
      <div className="flex justify-end p-4">
        <UploadDialog />
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {images.map((image) => (
          <div key={image.id} className="flex w-64 flex-col">
            <div className="relative aspect-video bg-zinc-900">
              <img
                src={image.imageUrl}
                alt={`Image ${image.id}`}
                className="h-full w-full object-contain object-top"
              />
            </div>
            <div className="text-center">{image.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">
          Please Sign In Above to Continue!
        </div>
      </SignedOut>
      <SignedIn>
        <div className="h-full w-full text-center text-2xl">
          Welcome Back!
          <Images />
        </div>
      </SignedIn>
    </main>
  );
}
