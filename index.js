const { showBanner, startBannerLoop } = require("./src/utils/terminal");
const connectionManager = require("./src/core/connectionManager");
const commandHandler = require("./src/handlers/commandHandler");
const groupHandler = require("./src/handlers/groupHandler");

// Mostrar banner inicial
showBanner(connectionManager.getStatus());
startBannerLoop(() => connectionManager.getStatus());

// Iniciar conexão
connectionManager.initialize()
  .then(sock => {
    // Configurar handlers
    commandHandler.setup(sock);
    groupHandler.setup(sock);
  })
  .catch(error => {
    console.error("Falha crítica:", error);
    process.exit(1);
  });

// Gerenciar encerramento
process.on('SIGINT', () => {
  console.log(chalk.red("\n🛑 Desconectando o bot..."));
  connectionManager.getSocket()?.end();
  process.exit();
});
