const isAdmin = require('../../middlewares/isAdmin');
const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}ban`,

  run: async (sock, m, from) => {
    try {
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { text: '🚫 Este comando só pode ser usado em grupos.' });
        return;
      }

      const admin = await isAdmin(sock, m);
      if (!admin) {
        await sock.sendMessage(from, { text: '❌ Apenas administradores podem usar este comando.' });
        return;
      }

      const participants = m.message.extendedTextMessage?.contextInfo?.mentionedJid;

      let target;

      if (participants && participants.length > 0) {
        target = participants[0];  // Se marcou alguém
      } else {
        // Se passou número por texto
        const messageType = Object.keys(m.message)[0];
        const text = m.message.conversation || m.message[messageType]?.text || "";
        const args = text.trim().split(' ').slice(1);

        if (args.length > 0) {
          target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }
      }

      if (!target) {
        await sock.sendMessage(from, {
          text: `❗ Marque o usuário ou informe o número.\n\nExemplo:\n${prefixo}ban @usuario\n${prefixo}ban 5511999999999`
        });
        return;
      }

      await sock.groupParticipantsUpdate(from, [target], 'remove');

      await sock.sendMessage(from, { text: `✅ Usuário removido com sucesso.` });
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no comando ban:', error);
      await sock.sendMessage(from, { text: '❌ Ocorreu um erro ao tentar remover o usuário.' });
    }
  }
};