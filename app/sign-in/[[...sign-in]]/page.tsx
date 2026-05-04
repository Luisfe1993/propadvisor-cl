import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <SignIn forceRedirectUrl="/dashboard" />
    </div>
  );
}
