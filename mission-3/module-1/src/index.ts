import http, { ServerResponse } from "http";
import { config } from "./config/server";
import path from "path";
import fs from "fs";

// Type Definitions
interface User {
  id: number;
  name: string;
  role?: string;
  location?: string;
  age?: number;
}

// Utility Functions
const filePath = path.join(__dirname, "data", "users.json");
const readUsers = () => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeUsers = (data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data));
};

const sendResponse = (res: ServerResponse, statusCode: number, data: any) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};

const parseRequestBody = (req: http.IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Server Creation
const server = http.createServer(
  async (req: http.IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "application/json");

    // ---------------- GET: Start Server ----------------
    if (req.url === "/" && req.method === "GET") {
      return sendResponse(res, 200, {
        status: "success",
        message: "Server is running",
      });
    }

    // ---------------- GET: All Users ----------------
    if (req.url === "/users" && req.method === "GET") {
      const users = readUsers();
      return sendResponse(res, 200, users);
    }

    // ---------------- GET: Single User ----------------
    if (req.url?.startsWith("/users/") && req.method === "GET") {
      const id = Number(req.url.split("/")[2]);
      if (Number.isNaN(id)) {
        return sendResponse(res, 400, { message: "Invalid User ID" });
      }
      const users = readUsers();
      const user = users.find((user: User) => user.id === id);
      if (!user) {
        return sendResponse(res, 404, { message: "User Not Found" });
      }
      return sendResponse(res, 200, user);
    }

    // ---------------- POST: Create User ----------------
    if (req.url === "/users" && req.method === "POST") {
      try {
        const body = await parseRequestBody(req);
        const users = readUsers();
        const id = users[users.length - 1].id + 1;
        const user = { id, ...body };
        users.push(user);
        writeUsers(users);
        return sendResponse(res, 201, user);
      } catch (error) {
        return sendResponse(res, 400, { message: "Invalid Request Body" });
      }
    }

    // ---------------- PUT: Update User ----------------
    if (req.url?.startsWith("/users/") && req.method === "PUT") {
      const id = Number(req.url.split("/")[2]); // ✅ you forgot this line

      if (Number.isNaN(id)) {
        return sendResponse(res, 400, { message: "Invalid User ID" });
      }

      try {
        const body = await parseRequestBody(req);
        const users = readUsers();

        const index = users.findIndex((user: User) => user.id === id);

        if (index === -1) {
          return sendResponse(res, 404, { message: "User Not Found" });
        }

        const updatedUser = {
          ...users[index],
          ...body, // ⭐ dynamically update any fields
        };

        users[index] = updatedUser;
        writeUsers(users);

        return sendResponse(res, 200, updatedUser);
      } catch (error) {
        return sendResponse(res, 400, { message: "Invalid Request Body" });
      }
    }

    // ---------------- Post : Delete User ----------------
    if (req.url?.startsWith("/users/") && req.method === "DELETE") {
      const id = Number(req.url.split("/")[2]);
      if (Number.isNaN(id)) {
        return sendResponse(res, 400, { message: "Invalid User ID" });
      }
      const users = readUsers();
      const user = users.find((user: User) => user.id === id);
      if (!user) {
        return sendResponse(res, 404, { message: "User Not Found" });
      }
      const filteredUsers = users.filter((user: User) => user.id !== id);
      writeUsers(filteredUsers);
      return sendResponse(res, 200, { message: "User Deleted Successfully" });
    }

    // 🔹 4. Fallback Route
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Page Not Found" }));
  }
);

server.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
});
