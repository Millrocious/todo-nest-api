import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getAllTodos(userId: number): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: {
        userId,
      },
    });
  }

  async getTodoById(id: number): Promise<Todo> {
    return this.prisma.todo.findUnique({
      where: {
        id,
      },
    });
  }

  async createTodo(
    todoData: { title: string; description?: string },
    userId: number,
  ): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        ...todoData,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  // You can add more CRUD methods here as needed
}
