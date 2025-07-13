const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}ppt`,

  run: async (sock, m, from) => {
    try {
      const messageType = Object.keys(m.message)[0];
      const text = m.message.conversation || m.message[messageType]?.text || "";
      const args = text.split(' ').slice(1);
      
      const escolhaUsuario = args[0]?.toLowerCase();
      const opcoes = ['pedra', 'papel', 'tesoura'];

      if (!escolhaUsuario || !opcoes.includes(escolhaUsuario)) {
        await sock.sendMessage(from, { text: '❌ Escolha entre: pedra, papel ou tesoura!\nExemplo: !ppt pedra' });
        return;
      }

      const escolhaBot = opcoes[Math.floor(Math.random() * 3)];
      let resultado;

      if (escolhaUsuario === escolhaBot) {
        resultado = 'Empate!';
      } else if (
        (escolhaUsuario === 'pedra' && escolhaBot === 'tesoura') ||
        (escolhaUsuario === 'papel' && escolhaBot === 'pedra') ||
        (escolhaUsuario === 'tesoura' && escolhaBot === 'papel')
      ) {
        resultado = '🎉 Você ganhou!';
      } else {
        resultado = '😢 Você perdeu!';
      }

      const mensagem = `✊✋✌️ *Pedra, Papel e Tesoura*\n\nVocê: ${escolhaUsuario}\nBot: ${escolhaBot}\n\n${resultado}`;

      await sock.sendMessage(from, { text: mensagem });
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no comando ppt:', error);
      await sock.sendMessage(from, { text: '❌ Ocorreu um erro ao executar o comando.' });
    }
  }
};