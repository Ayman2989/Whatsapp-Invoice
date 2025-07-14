import { redirect } from "next/navigation";

export default function Home() {
  redirect("/products"); // Always redirects to /tickets
}
