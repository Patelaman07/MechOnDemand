import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: 'http://localhost:5173', // Change to your frontend URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
})); // Allows all origins


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import mechRouter from "./routes/mech.routes.js"
import bookinRouter from "./routes/booking.routes.js"
import adminRoutes from "./routes/admin.routes.js";

app.use("/api/v1/user", userRouter);

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/mech",mechRouter);

app.use("/api/v1/booking",bookinRouter);



export default app;