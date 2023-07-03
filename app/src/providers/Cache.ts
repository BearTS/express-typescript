import * as redis from 'redis';
import Log from "../middlewares/Log";

type RedisClient = ReturnType<typeof redis.createClient>;

/**
 * @class Redis
 * @description This class is used to initialize the Redis database
 */
export default class Redis {
  private static client: RedisClient;

  /**
   * @method init
   * @description This function is used to init the connection to the Redis database
   * @returns void
   */
  public static async init(): Promise<void> {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URI,
      });
      this.client.on("connect", () => {
        Log.info("Redis :: Connected");
      });
      this.client.on("error", (err: Error) => {
        Log.error(`Redis :: Error: ${String(err.message)}`);
      });
      this.client.on("end", () => {
        Log.info("Redis :: Disconnected");
      });
      await this.client.connect();
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        Log.error(`Redis :: Error: ${error.message}`);
      }
    }
  }

  /**
   * @method add
   * @description This function is used to add a key-value pair to the Redis database
   * @param {number} database database number
   * @param {string} key key 
   * @param {string} value value
   */
  public static async add(database: number, key: string, value: string): Promise<void> {
    try {
      this.client.select(database);
      this.client.set(key, value);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Log.error(`Redis :: Error: ${error.message}`);
      }
    }
  }
  
  /**
   * @method get
   * @description This function is used to get a value from the Redis database
   * @param {number} database database number
   * @param {string} key key
   * @returns string 
   */
  public static async get(database: number, key: string): Promise<string> {
    try {
      this.client.select(database);
      const data = await this.client.get(key);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        Log.error(`Redis :: Error: ${error.message}`);
      }
    }
  }

  /**
   * @method delete
   * @description This function is used to delete a key-value pair from the Redis database
   * @param {number} database database number
   * @param {string} key key
   * @returns void 
   */
  public static async delete(database: number, key: string): Promise<void> {
    try {
      this.client.select(database);
      this.client.del(key);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Log.error(`Redis :: Error: ${error.message}`);
      }
    }
  }

  /**
   * @method addWithExpiry
   * @description This function is used to add a key-value pair to the Redis database with an expiry time
   * @param {number} database database number
   * @param {string} key key
   * @param {string} value value
   * @param {number} expiryTime expiry time in seconds
   * @returns void
   */
  public static async addWithExpiry(database: number, key: string, value: string, expiryTime: number): Promise<void> {
    try {
      this.client.select(database);
      this.client.setEx(key, expiryTime, value);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Log.error(`Redis :: Error: ${error.message}`);
      }
    }
  }
}
