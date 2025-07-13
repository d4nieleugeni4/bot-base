const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}roleta`,

  run: async (sock, m, from) => {
    try {
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { text: '🚫 Este comando só pode ser usado em grupos!' });
        return;
      }

      const perdeu = Math.floor(Math.random() * 6) === 0;
      const usuario = m.participant || m.key.participant;

      const mensagem = {
        text: perdeu
          ? `💥 BANG! @${usuario.split('@')[0]} foi eliminado(a)!`
          : `🔫 CLICK! @${usuario.split('@')[0]} sobreviveu!`,
        mentions: [usuario]
      };

      await sock.sendMessage(from, mensagem);
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no comando roleta:', error);
      await sock.sendMessage(from, { text: '❌ Ocorreu um erro ao executar o comando.' });
    }
  }
};