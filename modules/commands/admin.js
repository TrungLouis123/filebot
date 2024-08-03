module.exports.config = {
	name: "admin",
	version: "1.0.5",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Quản lý admin bot",
	commandCategory: "Admin",
	usages: "[list/add/remove] [userID]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "vi": {
        "listAdmin": '===『ADMINBOT』=== \n\n%1\n===「Người Điều Hành」===',
        "notHavePermssion": '⚡️ Bạn không đủ quyền hạn để có thể sử dụng chức năng "%1"',
        "addedNewAdmin": '⚡️ Đã thêm %1 người dùng trở thành người điều hành bot:\n\n%2',
        "removedAdmin": '⚡️Đã gỡ bỏ %1 người điều hành bot:\n\n%2'
    },
    "en": {
        "listAdmin": '[Admin] Admin list: \n\n%1',
        "notHavePermssion": '[Admin] You have no permission to use "%1"',
        "addedNewAdmin": '[Admin] Added %1 Admin :\n\n%2',
        "removedAdmin": '[Admin] Remove %1 Admin:\n\n%2'
    }
}
module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'cache', 'data.json');
    if (!existsSync(path)) {
        const obj = {
            adminbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}
module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {
    const content = args.slice(1, args.length);
    const { threadID, messageID, mentions } = event;
    const { configPath } = global.client;
    const { ADMINBOT } = global.config;
    const { userName } = global.data;
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const mention = Object.keys(mentions);

    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);

    switch (args[0]) {
        case "list":
        case "all":
        case "-a": {
            const listAdmin = ADMINBOT || config.ADMINBOT || [];
            var msg = [];

            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                    const name = (await Users.getData(idAdmin)).name
                    msg.push(` 《${name}》\n➢ Facebook: https://facebook.com/${idAdmin}`);
                }
            }

            return api.sendMessage(getText("listAdmin", msg.join("\n")), threadID, messageID);
        }
        
        case "add": {
            if (permssion != 2) return api.sendMessage("⚡️ Quyền nồn biên giới", threadID, messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    ADMINBOT.push(id);
                    config.ADMINBOT.push(id);
                    listAdd.push(`[ ${id} ] » ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                ADMINBOT.push(content[0]);
                config.ADMINBOT.push(content[0]);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", 1, `[ 𝘼𝘿𝙈𝙄𝙉 ] » ${name}`), threadID, messageID);
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
        }

        case "remove":
        case "rm":
        case "delete": {
            if (permssion != 2) return api.sendMessage("⚡️ Quyền nồn biên giới", threadID, messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.ADMINBOT.findIndex(item => item == id);
                    ADMINBOT.splice(index, 1);
                    config.ADMINBOT.splice(index, 1);
                    listAdd.push(`[ ${id} ] » ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
                ADMINBOT.splice(index, 1);
                config.ADMINBOT.splice(index, 1);
                const name = (await Users.getData(content[0])).name
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", 1, `[ ${content[0]} ] » ${name}`), threadID, messageID);
            }
            else global.utils.throwError(this.config.name, threadID, messageID);
        }
        case 'boxonly': {
            if (permssion != 1) return api.sendMessage("⚡️ Quyền nồn biên giới", threadID, messageID);
        const { resolve } = require("path");
        const pathData = resolve(__dirname, 'cache', 'data.json');
        const database = require(pathData);
        const { adminbox } = database;   
        if (adminbox[threadID] == true) {
            adminbox[threadID] = false;
            api.sendMessage("» Tắt thành công chế độ admin (tất cả mọi người đều có thể sử dụng bot)", threadID, messageID);
        } else {
            adminbox[threadID] = true;
            api.sendMessage("» Bật thành công chế độ admin (chỉ Admin với Qtv box mới có thể sử dụng bot)", threadID, messageID);
        }
        writeFileSync(pathData, JSON.stringify(database, null, 4));
        break;
        }
   case 'only':
   case '-o': {
        //---> CODE ADMIN ONLY<---//
        if (permssion != 2) return api.sendMessage("⚡️ Quyền nồn biên giới", threadID, messageID);
        if (config.adminOnly == false) {
            config.adminOnly = true;
            api.sendMessage("» Bật thành công admin only (Chỉ admin mới có thể sử dụng bot)", threadID, messageID);
        } else {
            config.adminOnly = false;
            api.sendMessage("» Tắt thành công admin only (tất cả mọi người đều có thể sử dụng bot)", threadID, messageID);
        }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
              break;
        }
    case 'paonly':
    case 'personalonly':
    case '-pa': {
        //---> CODE ADMIN PERSONAL ONLY<---//
        if (permssion != 2) return api.sendMessage("⚡️ Quyền nồn biên giới", threadID, messageID);
        if (config.adminPersonalOnly == false) {
            config.adminPersonalOnly = true;
            api.sendMessage("» Bật thành công admin personal only", threadID, messageID);
        } else {
            config.adminPersonalOnly = false;
            api.sendMessage("» Tắt thành công admin personal only", threadID, messageID);
        }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
              break;
        }
        default: {
          return api.sendMessage("Bạn có thể dùng: \n» .𝘼𝘿𝙈𝙄𝙉 𝙇𝙄𝙎𝙏 -> xem list admin\n» .𝘼𝘿𝙈𝙄𝙉 𝘼𝘿𝘿 -> thêm admin bot\n» .𝘼𝘿𝙈𝙄𝙉 𝙍𝙀𝙈𝙊𝙑𝙀 -> gỡ admin bot\n» .𝘼𝘿𝙈𝙄𝙉 𝘽𝙊𝙓𝙊𝙉𝙇𝙔 -> bật chế độ chỉ admin box mới được sử dụng bot\n» .𝘼𝘿𝙈𝙄𝙉 𝙊𝙉𝙇𝙔 -> bật chể độ chỉ admin bot mới được sử dụng bot\n» .𝘼𝘿𝙈𝙄𝙉 𝙋𝙀𝙍𝙎𝙊𝙉𝘼𝙇𝙊𝙉𝙇𝙔 -> chỉ admin mới có thể chat riêng với bot\n» HDSD: .𝘼𝘿𝙈𝙄𝙉 <case>", threadID, messageID);
        }
    };
}