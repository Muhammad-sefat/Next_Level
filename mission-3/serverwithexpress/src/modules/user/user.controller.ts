import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const results = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: results.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUser();

    res.status(201).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getSingleUser(
      req.params.id as unknown as number
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "User retrieved successfully",
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

const updateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await userService.updateUser(
      req.params.id as unknown as number,
      { name, email }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const userController = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
