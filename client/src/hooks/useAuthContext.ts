import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export const useAuthContext = () => {
  const router = useRouter();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  if (context.error) {
    console.error(context.error);
    router.push("/auth/login");
  }

  return context;
};
