import * as socketio from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import Redis from "./Cache";
import IToken from "../interfaces/token";
import Log from "../middlewares/Log";

// Sample code for socket.io
// Kindly change to your business logic

/**
 * @class SocketIOService
 * @description This class is used to initialize the socket.io server
 */
export default class SocketIOService {
  static io: socketio.Server;
  static userIo: socketio.Namespace;
  static runnerIo: socketio.Namespace;
  static defaultDatabase = 0;
  
  /**
   * @method init
   * @description This function is used to initialize the socket.io server
   * @param {http.Server} server
   * @returns void
   */
  public static init(server: http.Server): void {

    // Initialize socket.io server
    this.io = new socketio.Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Initialize namespaces
    this.userIo = this.io.of("/user");

    // io events on all namespaces
    this.io.on("connection", () => {
      Log.info("Someone connected");
    });

    // user namespace events
    this.userIo.on("connection", (socket: socketio.Socket) => {

      // check if token is valid
      const authHeader = socket.handshake.headers.authorization;
      let token = authHeader;
      if (!token) {
        // No token found, return an error
        return socket.emit("error", "Unauthorized");
      }
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as IToken;
        
        // Invalid token, return an error
        if (!decoded) {
          return socket.emit("error", "Unauthorized");
        }

        // Add user to redis
        Log.info("Socker:: User connected");
        Redis.add(this.defaultDatabase, decoded.id, socket.id);
      } catch (err) {
        // Invalid token, return an error
        Log.error(err);
        return socket.emit("error", "Unauthorized");
      }

      // disconnect event
      socket.on("disconnect", () => {
        Log.info("User disconnected");
      });
    });
  }

  /**
   * @method emitToUser
   * @description This function is used to emit an event to a user
   * @param {string} userId
   * @param {string} event
   * @param {any} data 
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async emitToUser(userId: string, event: string, data: any): Promise<void> {
    const userSocket = await Redis.get(this.defaultDatabase, userId);
    this.userIo.to(userSocket).emit(event, data);
    Log.info("Emitting to user");
  }
}