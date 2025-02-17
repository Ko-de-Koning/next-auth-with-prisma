import { LoginButton, LogoutButton } from "./auth";

import Link from "next/link";
import { TodoItem } from "app/components/TodoItem";
import { User } from "./user";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/db";

function getTodos() {
  return prisma.todo.findMany();
}

async function toggleTodo(id: string, complete: boolean) {
  "use server";

  await prisma.todo.update({ where: { id }, data: { complete } });

  // console.log(id, complete);
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const todos = await getTodos();

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Todos</h1>
        <Link
          className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          href="/new"
        >
          New
        </Link>
      </header>
      <main>
        <LoginButton />
        <LogoutButton />
        <h2>Server Session</h2>
        <pre>{JSON.stringify(session)}</pre>
        <h2>Client Call</h2>
        <User />
        <ul className="pl-4">
          {todos.map((todo) => (
            // <li key={todo.id}> {todo.title} </li> //first version
            <TodoItem key={todo.id} {...todo} toggleTodo={toggleTodo} />
          ))}
        </ul>
      </main>
    </>
  );
}
