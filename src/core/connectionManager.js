const path = require("path");
const fs = require("fs");
const readline = require("readline");
const pino = require("pino");
const { 
  default: makeWASocket, 
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

class ConnectionManager {
  constructor() {
    this.sockInstance = null;
    this.botStatus = 'Iniciando...';
  }

  async initialize() {
    try {
      const authPath = path.resolve(__dirname, "../../assets", "auth", "creds");
      
      // Verificar credenciais
      if (!fs.existsSync(authPath)) {
        console.log("🔑 Nenhuma credencial encontrada! Execute o bot uma vez e faça o pareamento.");
      }

      const { state, saveCreds } = await useMultiFileAuthState(authPath);
      const { version } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({
        printQRInTerminal: false,
        version,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        markOnlineOnConnect: true,
      });

      this.sockInstance = sock;

      // Registrar eventos
      sock.ev.on("connection.update", (update) => this.handleConnectionUpdate(update));
      sock.ev.on("creds.update", saveCreds);

      // Pareamento se necessário
      if (!sock.authState.creds.registered) {
        await this.handlePairing(sock);
      }

      return sock;

    } catch (error) {
      console.error("Erro durante a inicialização:", error);
      process.exit(1);
    }
  }

  async handlePairing(sock) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      const phoneNumber = await new Promise((resolve) => {
        rl.question("Informe o seu número de telefone (com DDD, sem espaços ou caracteres especiais): ", (ans) => {
          resolve(ans.replace(/[^0-9]/g, ""));
        });
      });

      if (!phoneNumber || phoneNumber.length < 11) {
        throw new Error("Número inválido! Use o formato 5511987654321");
      }

      const code = await sock.requestPairingCode(phoneNumber);
      console.log(`📲 Código de pareamento: ${code}\nUse no WhatsApp em Linked Devices`);

    } finally {
      rl.close();
    }
  }

  handleConnectionUpdate(update) {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      this.botStatus = 'Reconectando...';
      const shouldReconnect = 
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      
      console.log("❌ Conexão fechada:", lastDisconnect.error?.message || lastDisconnect.error);
      console.log("🔄 Reconectando:", shouldReconnect);

      if (shouldReconnect) {
        setTimeout(() => this.initialize(), 5000);
      }
    } 
    else if (connection === "open") {
      this.botStatus = 'conectado';
      console.log("✅ Bot conectado com sucesso!");
    }
  }

  getSocket() {
    return this.sockInstance;
  }

  getStatus() {
    return this.botStatus;
  }
}

module.exports = new ConnectionManager();
