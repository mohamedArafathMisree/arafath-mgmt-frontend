import * as SC from "socketcluster-client";
import { Injectable } from "@angular/core";
import { NotificationService } from "@progress/kendo-angular-notification";
import { userListComponent } from "src/app/stundent";

@Injectable()
export class SocketService {
    private socket: any;
    public data: any;

    constructor(private notificationSrvice: NotificationService, private userList: userListComponent) {
        // Connect Socket with server URL
        this.openSocket();
    }

    openSocket() {
        let socket = SC.create({
            hostname: "localhost",
            port: 8000,
        });

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
                        setTimeout(() => { this.userList.refresh() }, 2000);

                    }

                    // ...
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
