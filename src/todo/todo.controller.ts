import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { Todo, User } from '@prisma/client';
import { TodoService } from './todo.service';

@Controller('todos')
@UseGuards(JwtGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAllTodos(@GetUser() user: User): Promise<Todo[]> {
    return this.todoService.getAllTodos(user.id);
  }

  @Get(':id')
  async getTodoById(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Todo> {
    const todo = await this.todoService.getTodoById(id);
    this.ensureUserOwnsResource(todo, user);
    return todo;
  }

  @Post()
  async createTodo(
    @Body() todoData: { title: string; description?: string },
    @GetUser() user: User,
  ): Promise<Todo> {
    return this.todoService.createTodo(todoData, user.id);
  }

  private ensureUserOwnsResource(todo: Todo, user: User): void {
    if (todo.userId !== user.id) {
      throw new Error('You do not have permission to access this resource.');
    }
  }
}
