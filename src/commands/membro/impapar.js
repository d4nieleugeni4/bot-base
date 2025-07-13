const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}imparpar`,

  run: async (sock, m, from) => {
    try {
      const messageType = Object.keys(m.message)[0];
      const text = m.message.conversation || m.message[messageType]?.text || "";
      const args = text.split(' ').slice(1);
      
      const escolhaUsuario = args[0]?.toLowerCase();
      const numeroUsuario = parseInt(args[1]);
      const opcoes = ['impar', 'par'];

      if (!escolhaUsuario || !opcoes.includes(escolhaUsuario) || isNaN(numeroUsuario)) {
        await sock.sendMessage(from, { text: '❌ Uso correto: !imparpar <impar|par> <número>\nExemplo: !imparpar impar 5' });
        return;
      }

      const numeroBot = Math.floor(Math.random() * 10) + 1;
      const soma = numeroUsuario + numeroBot;
      const resultado = soma % 2 === 0 ? 'par' : 'impar';
      const venceu = escolhaUsuario === resultado;

      const mensagem = `🔢 *Ímpar ou Par*\n\nVocê: ${escolhaUsuario} (${numeroUsuario})\nBot: ${numeroBot}\nSoma: ${soma} (${resultado})\n\n${venceu ? '🎉 Você ganhou!' : '😢 Você perdeu!'}`;

      await sock.sendMessage(from, { text: mensagem });
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no comando imparpar:', error);
      await sock.sendMessage(from, { text: '❌ Ocorreu um erro ao executar o comando.' });
    }
  }
};