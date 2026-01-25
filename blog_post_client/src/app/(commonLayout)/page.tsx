import { userService } from "@/services/user.service";

export default async function Home() {
  const { data } = await userService.getSession();
  console.log(data);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Home</h1>
      <p>This is the home page</p>
    </div>
  );
}
