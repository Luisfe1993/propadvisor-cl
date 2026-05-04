import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <SignUp forceRedirectUrl="/dashboard" />
    </div>
  );
}
