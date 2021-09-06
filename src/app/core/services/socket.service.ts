import * as SC from "socketcluster-client";
import { Injectable } from "@angular/core";
import { NotificationService } from "@progress/kendo-angular-notification";
import { EventEmitter, Output } from "@angular/core";
import { socketResources } from "../const/urls";

@Injectable()
export class SocketService {

    success: EventEmitter<String> = new EventEmitter<String>();
    private socket: any;
    public data: any;

    constructor(private notificationSrvice: NotificationService) {
        // Connect Socket with server URL
        this.openSocket();
    }

    openSocket() {
        let socket = SC.create(socketResources);

        (async () => {
            // Subscribe to a channel.
            let fileUploadChannel = socket.subscribe("fileUploadChannel");

            await fileUploadChannel.listener("subscribe").once();
            // myChannel.state is now 'subscribed'.

            (async () => {
                for await (let data of fileUploadChannel) {
                    const obj = JSON.stringify(data);
                    console.log(obj);
                    if (obj.includes("error")) {
                        this.showNotification("File Upload Faild", "error", false);
                    } else {
                        this.showNotification("File Uploaded Successfuly", "success", true);
                        this.success.emit('-successful-');

                    }
                }
            })();
        })();

        console.log("socket is on");
    }

    closeSocket() {
        this.socket.close();
    }

    public showNotification(message: any, style: any, icon: any): void {
        this.notificationSrvice.show({
            content: message,
            cssClass: "button-notification",
            animation: { type: "slide", duration: 400 },
            position: { horizontal: "center", vertical: "bottom" },
            type: { style: style, icon: icon },
            closable: true,
        });
    }
}
