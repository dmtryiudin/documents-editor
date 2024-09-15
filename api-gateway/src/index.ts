import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";
import events from "events";

dotenv.config();

const port = process.env.PORT || 3001;
const app: Application = express();

app.use(express.json());

const main = async () => {
  try {
    const eventEmitter = new events.EventEmitter();

    app.listen(port, () => {
      console.log(`Server is Fire at http://localhost:${port}`);
    });

    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const replyQueue = await channel.assertQueue("", {
      exclusive: true,
    });

    const correlationId = uuidv4();

    await channel.consume(
      replyQueue.queue,
      (msg) => {
        if (!msg) {
          return null;
        }

        eventEmitter.emit(msg.properties.correlationId, msg.content.toString());
      },
      {
        noAck: true,
      }
    );

    app.post("/send", async (req: Request, res: Response) => {
      const int = req.body.int;

      channel.sendToQueue("rpc_queue", Buffer.from(int.toString()), {
        correlationId: correlationId,
        replyTo: replyQueue.queue,
      });

      const getResponse = () => {
        return new Promise((res, rej) => {
          eventEmitter.on(correlationId, (data) => {
            res(data);
          });
        });
      };

      const response = await getResponse();

      res.send(response);
    });
  } catch (e) {
    console.log(e);
  }
};

main();
