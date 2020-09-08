
import { connectDB, WeiboModel } from "./database";
import startServer from './server/server'

connectDB();
startServer();
