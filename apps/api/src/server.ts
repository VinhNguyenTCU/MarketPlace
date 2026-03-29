import "dotenv/config";
import { app } from "./app.js";

console.log("Checking Environment Variables...");
console.log("FRONTEND_URL is:", process.env.FRONTEND_URL);

const port = Number(process.env.PORT) || 3001 ;
app.listen(port, () => console.log(`API listening on :${port}`));


