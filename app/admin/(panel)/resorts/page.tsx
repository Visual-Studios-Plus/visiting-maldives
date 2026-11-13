import { redirect } from "next/navigation";

/*
 * Resort islands used to be edited atoll by atoll here. They now appear in the Places to stay
 * list itself, each with its own editor, so this address just sends people there.
 */
export default function ResortsPage() {
  redirect("/admin/stays");
}
