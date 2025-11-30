import express, { Request, Response } from "express";
const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello There my name is muhammad sefat");
});

app.listen(port, () => {
  console.log(`Server runing on port ${port}`);
});
