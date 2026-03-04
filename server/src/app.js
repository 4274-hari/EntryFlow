//AUTH 
const authRoutes = require("./modules/auth/auth.route");
const protect = require("./middlewares/auth.middleware");
const errorHandler = require("./middlewares/error.middleware");
const lateEntryRoutes = require("./modules/lateEntry/lateEntry.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");
const studentRoutes = require("./modules/student/student.route");
const helmet = require("helmet");
const cors = require("cors");






const express = require("express");
const app = express();

app.use(express.json());
app.use(errorHandler);
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.get('/',(req,res)=>{
    res.status(200).json({message : "Server is Running"})
})


//ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", protect, studentRoutes);
app.use("/api/v1/late-entries", lateEntryRoutes);
app.use("/api/v1/analytics", analyticsRoutes);


module.exports = app ; 