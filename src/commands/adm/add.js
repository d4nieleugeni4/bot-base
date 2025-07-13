const isAdmin = require('../../middlewares/isAdmin');
const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}add`,

  run: async (sock, m, from) => {
    try {
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { text: '🚫 Este comando só pode ser usado em grupos.' });
        return;
      }

      const admin = await isAdmin(sock, m);
      if (!admin) {
        await sock.sendMessage(from, { text: '❌ Você precisa ser *administrador* para usar este comando.' });
        return;
      }

      const messageType = Object.keys(m.message)[0];
      const text = m.message.conversation || m.message[messageType]?.text || "";

      const args = text.trim().split(' ').slice(1);
      if (args.length === 0) {
        await sock.sendMessage(from, { text: `❗ Informe o número para adicionar.\n\nExemplo:\n${prefixo}add 5511999999999` });
        return;
      }

      const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';

      await sock.groupParticipantsUpdate(from, [number], 'add');

      await sock.sendMessage(from, {
        text: `✅ Usuário *${args[0]}* adicionado com sucesso ao grupo!`
      });

      // Reage com ✅ na mensagem original do comando
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      await sock.sendMessage(from, {
        text: `❌ Ocorreu um erro ao tentar adicionar o número *${args[0]}*.`
      });
    }
  }
};