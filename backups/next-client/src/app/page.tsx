import { BookOpenCheckIcon } from 'lucide-react';
import NewTodo from './NewTodo';
import TodoItem, { Todo } from './TodoItem';

async function getData(): Promise<Todo[]> {
  const res = await fetch('http://host.docker.internal:3001/api/todos', { next: { tags: ['todos'] } });
  return res.json();
}

function InfoItem({ item, value }: { item: string; value: string }) {
  return (
    <p>
      <span className="font-medium">{item}</span>: <span className="font-mono text-sm">{value}</span>
    </p>
  );
}

export default async function Home() {
  const todos = await getData();

  return (
    <main className="h-full w-full">
      <div className="grid h-full grid-cols-12">
        <div className="col-span-7 flex">
          <div className="flex h-full flex-1 items-center justify-center">
            <div className="w-96 max-w-full rounded-lg bg-gray-700 p-8 text-gray-200 shadow-lg">
              <div className="mb-6 flex items-center">
                <BookOpenCheckIcon className="text-indigo-500" />
                <h4 className="ml-3 text-lg font-semibold">Todo List</h4>
              </div>

              {todos.map((todo, index) => (
                <TodoItem id={index} key={`todo_item_${index}`} todo={todo} />
              ))}

              <NewTodo />
            </div>
          </div>
        </div>
        <div className="col-span-5 flex h-full flex-col justify-center gap-4 p-8">
          <InfoItem item="API URL" value="http://localhost:3001" />
          <InfoItem item="User" value="lazaro94@ethereal.email" />
          <InfoItem item="Password" value="ZF4k1x18v5hJz96uMX" />
          <InfoItem item="Mailbox" value="https://ethereal.email/messages" />
          <div>
            <p className="font-medium">Nodemailer config</p>
            <pre className="mt-2 overflow-hidden rounded-md bg-gray-800 p-4 text-sm">
              {`const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'lazaro94@ethereal.email',
    pass: 'ZF4k1x18v5hJz96uMX'
  }
});`}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
