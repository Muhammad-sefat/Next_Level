import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.PORT || 3000;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connent to the database successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("An error occurd", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
