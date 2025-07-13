const { prefixo, nomeBot, versao, emojiBot } = require('../../config');

module.exports = {
  name: `${prefixo}ping`,

  run: async (sock, m, from) => {
    try {
      const start = Date.now();
      await sock.sendMessage(from, { text: "🏓 Testando o ping..." });

      const end = Date.now();
      const latency = end - start;

      await sock.sendMessage(from, {
        text: `${emojiBot} *Pong!*  
📡 *Latência:* ${latency}ms  
🤖 *Bot:* ${nomeBot}  
🛠️ *Versão:* ${versao}`
      });

      // Reagir com ✅ na mensagem original do comando
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no comando ping:', error);
    }
  }
};