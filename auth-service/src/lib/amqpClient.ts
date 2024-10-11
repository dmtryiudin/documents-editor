import amqp from "amqplib";

export class AmqpClient {
  private static connection: amqp.Connection | null = null;
  private static channel: amqp.Channel | null = null;

  private constructor() {}

  static async getConnectionAndChannel() {
    if (!this.connection) {
      this.connection = await amqp.connect(process.env.AMQP_URL!);
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      this.channel.prefetch(1);
    }

    return {
      connection: this.connection,
      channel: this.channel,
    };
  }

  static async initListener(
    queue: string,
    callback: (message: amqp.ConsumeMessage) => Promise<any>
  ) {
    const { channel } = await this.getConnectionAndChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.consume(
      queue,
      async (msg) => {
        if (!msg) {
          return null;
        }

        try {
          await callback(msg);
        } catch {
        } finally {
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  }

  static async initRpcListener(
    queue: string,
    callback: (message: amqp.ConsumeMessage) => Promise<string>
  ) {
    const { channel } = await this.getConnectionAndChannel();

    const rpcQueue = await channel.assertQueue(queue, {
      durable: false,
    });

    await channel.consume(rpcQueue.queue, async (msg) => {
      if (!msg) {
        return null;
      }
      const response = await callback(msg);

      channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
        correlationId: msg.properties.correlationId,
      });

      channel.ack(msg);
    });
  }
}
