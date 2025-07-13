const isAdmin = require('../../middlewares/isAdmin');
const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}promover`,

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
      if (!participants || participants.length === 0) {
        await sock.sendMessage(from, { text: `❗ Marque o usuário que você deseja promover.\n\nExemplo:\n${prefixo}promover @usuario` });
        return;
      }

      await sock.groupParticipantsUpdate(from, [participants[0]], 'promote');
      await sock.sendMessage(from, { text: `✅ Usuário promovido a administrador com sucesso!` });
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro ao promover usuário:', error);
      await sock.sendMessage(from, { text: '❌ Ocorreu um erro ao tentar promover o usuário.' });
    }
  }
};