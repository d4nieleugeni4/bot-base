const isAdmin = require('../../middlewares/isAdmin');
const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}onlyadms`,

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

      const messageType = Object.keys(m.message)[0];
      const text = m.message.conversation || m.message[messageType]?.text || "";

      const args = text.trim().split(' ').slice(1);
      const option = args[0]?.toLowerCase();

      if (option === 'on') {
        await sock.groupSettingUpdate(from, 'announcement');
        await sock.sendMessage(from, { text: '🔒 Grupo fechado! Agora apenas *administradores* podem enviar mensagens.' });
        await sock.sendMessage(from, { react: { text: '✅', key: m.key } });
      } else if (option === 'off') {
        await sock.groupSettingUpdate(from, 'not_announcement');
        await sock.sendMessage(from, { text: '🔓 Grupo aberto! Agora *todos os membros* podem enviar mensagens.' });
        await sock.sendMessage(from, { react: { text: '✅', key: m.key } });
      } else {
        await sock.sendMessage(from, {
          text: `❗ Uso incorreto.\n\nExemplos:\n${prefixo}onlyadms on\n${prefixo}onlyadms off`
        });
      }

    } catch (error) {
      console.error('Erro no comando onlyadms:', error);
      await sock.sendMessage(from, { text: '❌ Ocorreu um erro ao tentar alterar as configurações do grupo.' });
    }
  }
};