import { injectable } from "tsyringe";
import {
  Expo,
  ExpoPushMessage,
  ExpoPushSuccessTicket,
  ExpoPushErrorTicket,
  ExpoPushErrorReceipt
} from "expo-server-sdk";
import cron from "node-cron";

interface ExpoNotificationWrapperInterface {
  isExpoPushToken: (token: string | null) => boolean;
  pushMessage: (
    token: string,
    body: string,
    data: object,
    title?: string
  ) => void;
  popErrorTokens: () => string[];
}

@injectable()
class ExpoNotificationWrapper implements ExpoNotificationWrapperInterface {
  expo = new Expo();

  messages: ExpoPushMessage[] = [];
  ticketIds: string[] = [];
  ticketIdToTokenMap = new Map<string, string>();

  errorTokens: string[] = [];

  constructor() {
    void this.startJobSendingNotifications();
    void this.startJobReceivingReceipts();
  }

  isExpoPushToken = (token: string | null) => {
    return token != null && Expo.isExpoPushToken(token);
  };

  pushMessage = (token: string, body: string, data: object, title?: string) => {
    console.log("[EXPO NOTIFICATION] Pushing message", {
      body: body,
      data: data,
      title: title
    });

    this.messages.push({
      to: token,
      body: body,
      data: data,
      title: title ? title : undefined
    });
  };

  popErrorTokens = () => {
    const tokens = this.errorTokens;
    this.errorTokens = [];
    return tokens;
  };

  startJobSendingNotifications = () => {
    console.log("[EXPO NOTIFICATION] Start startJobSendingNotifications");
    cron.schedule("0,5,10,15,20,25,30,35,40,45,50,55 * * * * *", () => {
      const chunks = this.expo.chunkPushNotifications(this.messages);
      if (chunks.length <= 0) return;

      const chunk = chunks.shift();
      if (chunk) {
        this.messages = this.messages.filter(
          (message) => chunk.filter((item) => item === message).length == 0
        );

        try {
          console.log("[EXPO NOTIFICATION] Sending message chunk: ", chunk);
          void this.expo
            .sendPushNotificationsAsync(chunk)
            .then((ticketChunk) => {
              console.log(
                "[EXPO NOTIFICATION] Ticket chunk received",
                ticketChunk
              );

              chunk.forEach((message, idx) => {
                if (ticketChunk[idx].status == "ok") {
                  const successTicket = ticketChunk[
                    idx
                  ] as ExpoPushSuccessTicket;
                  this.ticketIds.push(successTicket.id);
                  typeof message.to === "string"
                    ? this.ticketIdToTokenMap.set(successTicket.id, message.to)
                    : message.to.map((token) =>
                        this.ticketIdToTokenMap.set(successTicket.id, token)
                      );
                } else {
                  const errorTicket = ticketChunk[idx] as ExpoPushErrorTicket;
                  console.log(errorTicket);

                  if (errorTicket.details?.error === "DeviceNotRegistered") {
                    typeof message.to === "string"
                      ? this.errorTokens.push(message.to)
                      : message.to.map((token) => this.errorTokens.push(token));
                  }
                }
              });
            });
        } catch (error) {
          console.log("[EXPO NOTIFICATION] Ticket ERROR", error);
        }
      }
    });
  };

  startJobReceivingReceipts = () => {
    console.log("[EXPO NOTIFICATION] Start startJobReceivingReceipts");
    cron.schedule("0,5,10,15,20,25,30,35,40,45,50,55 * * * * *", () => {
      const ticketIdChunks = this.expo.chunkPushNotificationReceiptIds(
        this.ticketIds
      );
      ticketIdChunks.map(async (chunk) => {
        try {
          const receipts = await this.expo.getPushNotificationReceiptsAsync(
            chunk
          );
          console.log("[EXPO NOTIFICATION] Receipts:", receipts);

          for (const idx in receipts) {
            if (receipts[idx].status !== "error") continue;

            const errorReceipt = receipts[idx] as ExpoPushErrorReceipt;
            console.log("[EXPO NOTIFICATION] Receipt ERROR:", errorReceipt);

            if (errorReceipt.details?.error === "DeviceNotRegistered") {
              const token = this.ticketIdToTokenMap.get(idx);
              token && this.errorTokens.push(token);
            }
          }
        } catch (error) {
          console.error("[EXPO NOTIFICATION] Error", error);
        }
      });

      this.ticketIds = [];
      this.ticketIdToTokenMap = new Map();
    });
  };
}

export type { ExpoNotificationWrapperInterface };
export { ExpoNotificationWrapper };
