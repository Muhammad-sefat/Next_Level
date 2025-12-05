import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
  try {
    const results = await todoService.createTodo(req.body);

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: results.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getTodo();

    res.status(201).json({
      success: true,
      message: "Todos retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getSingleTodo(req.params.id as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Todo retrieved successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.updateTodo(
      req.params.id as string,
      req.body
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Todo updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.deleteTodo(req.params.id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Todo deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const todoController = {
  createTodo,
  getTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
