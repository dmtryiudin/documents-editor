import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";
import events from "events";
import { ResponseType } from "../types/ResponseType";

export class AmqpClient {
  private static connection: amqp.Connection | null = null;
  private static channel: amqp.Channel | null = null;
  private static eventEmitter: events.EventEmitter | null = null;
  private static rpcQueues: { [queueName: string]: string } = {};

  private constructor() {}

  static async getConnectionAndChannel() {
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.AMQP_URL!);
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }

    if (!this.eventEmitter) {
      this.eventEmitter = new events.EventEmitter();
    }

    return {
      connection: this.connection,
      channel: this.channel,
      eventEmitter: this.eventEmitter,
    };
  }

  static async sendRequest(queue: string, payload: string): Promise<any> {
    const { channel } = await this.getConnectionAndChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(payload), {
      persistent: true,
    });
  }

  static async sendRpcRequest(
    queue: string,
    payload: string
  ): Promise<ResponseType> {
    const { channel, eventEmitter } = await this.getConnectionAndChannel();
    let replyQueueName: string = "";

    if (this.rpcQueues[queue]) {
      replyQueueName = this.rpcQueues[queue];
    } else {
      const replyQueue = await channel.assertQueue("", {
        exclusive: true,
      });

      replyQueueName = replyQueue.queue;
      this.rpcQueues[queue] = replyQueue.queue;

      await channel.consume(
        replyQueueName,
        (msg) => {
          if (!msg) {
            return null;
          }

          eventEmitter.emit(
            msg.properties.correlationId,
            msg.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    }

    const correlationId = uuidv4();

    channel.sendToQueue(queue, Buffer.from(payload), {
      correlationId: correlationId,
      replyTo: replyQueueName,
    });

    return new Promise((res) => {
      eventEmitter.on(correlationId, (data) => {
        res(JSON.parse(data));
      });
    });
  }
}
