import { v4 as uuidv4 } from 'uuid';
import pool from '../db';

/**
 * Representa os dados de uma tarefa.
 */
export interface TodoData {
  user_email: string;
  title: string;
  description: string;
  progress: number;
  date: string;
  status: 'pendente' | 'em progresso' | 'concluída';
}

/**
 * Busca todas as tarefas de um usuário.
 * @param userEmail - Email do usuário.
 * @returns Um array de tarefas.
 */
export const fetchTodos = async (userEmail: string): Promise<any[]> => {
  const result = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail]);
  return result.rows;
};

/**
 * Cria uma nova tarefa.
 * @param data - Dados da tarefa.
 * @returns A tarefa criada.
 */
export const createTodo = async (data: TodoData): Promise<any> => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO todos(id, user_email, title, description, progress, date, status)
     VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [id, data.user_email, data.title, data.description, data.progress, data.date, data.status]
  );
  return result.rows[0];
};

/**
 * Atualiza uma tarefa existente.
 * @param id - ID da tarefa.
 * @param data - Novos dados da tarefa.
 * @returns A tarefa atualizada.
 */
export const updateTodo = async (id: string, data: TodoData): Promise<any> => {
  const result = await pool.query(
    `UPDATE todos 
     SET user_email = $1, title = $2, description = $3, progress = $4, date = $5, status = $6
     WHERE id = $7 RETURNING *`,
    [data.user_email, data.title, data.description, data.progress, data.date, data.status, id]
  );
  return result.rows[0];
};

/**
 * Deleta uma tarefa.
 * @param id - ID da tarefa.
 * @returns A tarefa deletada.
 */
export const deleteTodo = async (id: string): Promise<any> => {
  const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
