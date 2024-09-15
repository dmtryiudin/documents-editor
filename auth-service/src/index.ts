import amqp, { ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_URL!);
  console.log("Connected to MongoDB cluster");
  const connection = await amqp.connect("amqp://localhost:5672");
  console.log("RabbitMQ connection is running...");

  const channel = await connection.createChannel();

  const rpcQueue = await channel.assertQueue("rpc_queue", {
    durable: false,
  });

  channel.prefetch(1);

  await channel.consume(rpcQueue.queue, (msg) => {
    if (!msg) {
      return null;
    }

    const message = msg.content.toString();
    const square = +message * +message;

    channel.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(square.toString()),
      {
        correlationId: msg.properties.correlationId,
      }
    );

    channel.ack(msg);
  });
};

main();
