import AdminOffcanvas from "@/components/AdminOffcanvas";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AdminOffcanvas>{children}</AdminOffcanvas>;
    </AuthProvider>
  );
}
