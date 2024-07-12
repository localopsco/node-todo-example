'use client';

import clsx from 'clsx';
import { deleteTodo, setChecked } from './actions';
import { CheckIcon, Trash2Icon } from 'lucide-react';

export interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

interface TodoItemProps {
  id: number;
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  return (
    <div className="group relative">
      <input
        className="hidden"
        type="checkbox"
        id={`task_${todo.id}`}
        checked={todo.completed}
        onChange={async (e) => {
          setChecked(todo.id, e.currentTarget.checked);
        }}
      />
      <label
        className="flex h-10 cursor-pointer items-center rounded px-2 hover:bg-gray-800"
        htmlFor={`task_${todo.id}`}
      >
        <span
          className={clsx(
            'flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 text-transparent',
            {
              'border-green-600 bg-green-600 text-white': todo.completed,
            },
          )}
        >
          <CheckIcon />
        </span>
        <span
          className={clsx('ml-4 flex-1 overflow-hidden text-ellipsis whitespace-nowrap pr-2 text-sm', {
            'line-through': todo.completed,
          })}
        >
          {todo.task}
        </span>
        <div
          className="hidden text-red-600 group-hover:block"
          onClick={(e) => {
            e.preventDefault();
            deleteTodo(todo.id);
          }}
        >
          <Trash2Icon size={16} />
        </div>
      </label>
    </div>
  );
}
