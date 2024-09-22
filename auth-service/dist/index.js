"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env.DB_CONNECTION_URL);
    console.log("Connected to MongoDB cluster");
    const connection = yield amqplib_1.default.connect("amqp://localhost:5672");
    console.log("RabbitMQ connection is running...");
    const channel = yield connection.createChannel();
    const rpcQueue = yield channel.assertQueue("rpc_queue", {
        durable: false,
    });
    channel.prefetch(1);
    yield channel.consume(rpcQueue.queue, (msg) => {
        if (!msg) {
            return null;
        }
        const message = msg.content.toString();
        const square = +message * +message;
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(square.toString()), {
            correlationId: msg.properties.correlationId,
        });
        channel.ack(msg);
    });
});
main();
