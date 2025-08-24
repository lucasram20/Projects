"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { v4 as uuidv4 } from 'uuid';

// Define the type for a single todo item
type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function Home() {
  // State to hold the list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State for the new todo input
  const [newTodoText, setNewTodoText] = useState("");

  // Load todos from local storage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to local storage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodoText.trim() !== "") {
      const newTodo: Todo = {
        id: uuidv4(),
        text: newTodoText.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setNewTodoText("");
    }
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-4">
            <Input 
              type="text" 
              placeholder="Add a new task..." 
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <Button onClick={handleAddTodo}>Add</Button>
          </div>
          <div className="space-y-2">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id={todo.id}
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTodo(todo.id)}
                  />
                  <Label 
                    htmlFor={todo.id}
                    className={`text-sm font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.text}
                  </Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTodo(todo.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{todos.filter(todo => !todo.completed).length} tasks left</span>
          <Button variant="link" onClick={handleClearCompleted}>Clear Completed</Button>
        </CardFooter>
      </Card>
    </main>
  );
}