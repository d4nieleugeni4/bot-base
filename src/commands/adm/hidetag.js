const isAdmin = require('../../middlewares/isAdmin');
const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}hidetag`,

  run: async (sock, m, from) => {
    try {
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { text: '🚫 Este comando só pode ser usado em grupos.' });
        return;
      }

      const admin = await isAdmin(sock, m);
      if (!admin) {
        await sock.sendMessage(from, { text: '❌ Apenas administradores podem usar o hidetag.' });
        return;
      }

      const metadata = await sock.groupMetadata(from);
      const members = metadata.participants.map(p => p.id);

      const messageType = Object.keys(m.message)[0];
      const text = m.message.conversation || m.message[messageType]?.text || "";
      const args = text.trim().split(' ').slice(1);
      const msg = args.join(' ');

      if (msg.length > 0) {
        await sock.sendMessage(from, {
          text: msg,
          mentions: members
        });
      } else {
        await sock.sendMessage(from, {
          text: '🔔',
          mentions: members
        });
      }

      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no hidetag:', error);
      await sock.sendMessage(from, { text: '❌ Erro ao marcar todos.' });
    }
  }
};