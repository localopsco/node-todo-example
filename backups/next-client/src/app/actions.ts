'use server';

import { revalidatePath } from 'next/cache';

export const setChecked = async (id: number, checked: boolean) => {
  await fetch(`http://host.docker.internal:3001/api/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: checked }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  revalidatePath('/');
};

export const deleteTodo = async (id: number) => {
  await fetch(`http://host.docker.internal:3001/api/todos/${id}`, {
    method: 'DELETE',
  });

  revalidatePath('/');
};

export const createTodo = async (data: FormData) => {
  await fetch(`http://host.docker.internal:3001/api/todos`, {
    method: 'POST',
    body: JSON.stringify({ task: data.get('task') }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  revalidatePath('/');
};
