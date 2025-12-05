import { pool } from "../../config/db";

const createTodo = async (payload: Record<string, unknown>) => {
  const { user_id, title, description } = payload;
  const result = await pool.query(
    `INSERT INTO todos(user_id, title, description) VALUES($1, $2 , $3) RETURNING *`,
    [user_id, title, description]
  );
  return result;
};

const getTodo = async () => {
  const result = await pool.query(`
      SELECT * FROM todos
    `);

  return result;
};

const getSingleTodo = async (id: string) => {
  const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
  return result;
};

const updateTodo = async (id: string, payload: Record<string, any>) => {
  const { title, description } = payload;
  const result = await pool.query(
    `UPDATE todos SET title = $1, description = $2 WHERE id = $3 RETURNING *`,
    [title, description, id]
  );
  return result;
};

const deleteTodo = async (id: string) => {
  const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);
  return result;
};

export const todoService = {
  createTodo,
  getTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
