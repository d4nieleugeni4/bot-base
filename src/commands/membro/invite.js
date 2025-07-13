const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}invite`,

  run: async (sock, m, from) => {
    try {
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { text: '🚫 Este comando só pode ser usado em grupos.' });
        return;
      }

      const code = await sock.groupInviteCode(from);

      const messageType = Object.keys(m.message)[0];
      const text = m.message.conversation || m.message[messageType]?.text || "";

      const args = text.trim().split(' ').slice(1);

      if (args.length > 0) {
        const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await sock.sendMessage(number, { text: `📎 *Convite para o grupo:*\nhttps://chat.whatsapp.com/${code}` });
        await sock.sendMessage(from, { text: `✅ Convite enviado no privado de ${args[0]}!` });
      } else {
        await sock.sendMessage(from, { text: `📎 *Link de convite do grupo:*\nhttps://chat.whatsapp.com/${code}` });
      }

      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no comando invite:', error);
      await sock.sendMessage(from, { text: '❌ Não consegui gerar o link de convite.' });
    }
  }
};