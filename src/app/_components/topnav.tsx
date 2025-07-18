import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <div>IT315</div>
      <div>
        <SignedOut>
          <div className="cursor-pointer">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          {/* <SignOutButton /> */}
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
