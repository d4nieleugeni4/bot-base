const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}cc`,

  run: async (sock, m, from) => {
    try {
      const messageType = Object.keys(m.message)[0];
      const text = m.message.conversation || m.message[messageType]?.text || "";
      const args = text.split(' ').slice(1);
      
      const escolhaUsuario = args[0]?.toLowerCase();
      const opcoes = ['cara', 'coroa'];

      if (!escolhaUsuario || !opcoes.includes(escolhaUsuario)) {
        await sock.sendMessage(from, { text: '❌ Escolha entre: cara ou coroa!\nExemplo: !cc cara' });
        return;
      }

      const resultado = Math.random() < 0.5 ? 'cara' : 'coroa';
      const venceu = escolhaUsuario === resultado;

      const mensagem = `🎲 *Cara ou Coroa*\n\nVocê: ${escolhaUsuario}\nResultado: ${resultado}\n\n${venceu ? '🎉 Você ganhou!' : '😢 Você perdeu!'}`;

      await sock.sendMessage(from, { text: mensagem });
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no comando cc:', error);
      await sock.sendMessage(from, { text: '❌ Ocorreu um erro ao executar o comando.' });
    }
  }
};