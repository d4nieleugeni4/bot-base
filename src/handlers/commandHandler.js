const fs = require("fs");
const path = require("path");

class CommandHandler {
  constructor() {
    this.commands = [];
    this.loadCommands();
  }

  loadCommands(dir = path.join(__dirname, "..", "commands")) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        this.loadCommands(fullPath);
      } else if (file.endsWith(".js")) {
        const command = require(fullPath);
        if (command.name && command.run) {
          this.commands.push(command);
        }
      }
    });
  }

  setup(sock) {
    sock.ev.on("messages.upsert", async (msg) => {
      const m = msg.messages[0];
      if (!m?.message || m.key.fromMe) return;

      const from = m.key.remoteJid;
      const messageType = Object.keys(m.message)[0];
      const text = m.message.conversation || m.message[messageType]?.text || "";

      for (const cmd of this.commands) {
        if (text.startsWith(cmd.name)) {
          try {
            await cmd.run(sock, m, from);
          } catch (e) {
            console.log(`Erro ao executar comando ${cmd.name}:`, e);
          }
        }
      }
    });
  }
}
