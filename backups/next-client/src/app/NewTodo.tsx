import { PlusIcon } from 'lucide-react';
import { createTodo } from './actions';

export default function NewTodo() {
  return (
    <form className="mt-2 flex h-8 w-full items-center rounded px-2 text-sm font-medium" action={createTodo}>
      <PlusIcon className="text-gray-400" size={16} />
      <input
        className="ml-4 h-8 flex-grow bg-transparent font-medium focus:outline-none"
        type="text"
        placeholder="add a new task"
        name="task"
        required
        minLength={3}
      />
      <input type="submit" hidden />
    </form>
  );
}
