const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}admtag`,

  run: async (sock, m, from) => {
    try {
      // Verificar se é grupo
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { text: '🚫 Este comando só pode ser usado em grupos!' });
        return;
      }

      // Obter texto da mensagem
      const messageType = Object.keys(m.message)[0];
      const fullText = m.message.conversation || m.message[messageType]?.text || "";
      
      // Separar comando da mensagem personalizada
      const args = fullText.split(' ').slice(1);
      const customMessage = args.length > 0 ? args.join(' ') : "🔔 Mensagem automática";

      // Obter metadados do grupo
      const groupMetadata = await sock.groupMetadata(from);
      
      // Filtrar apenas administradores
      const admins = groupMetadata.participants.filter(
        participant => participant.admin === 'admin' || participant.admin === 'superadmin'
      );

      // Verificar se há admins
      if (admins.length === 0) {
        await sock.sendMessage(from, { text: 'ℹ️ Este grupo não possui administradores.' });
        return;
      }

      // Preparar menções
      const mentions = admins.map(admin => admin.id);
      const mentionTexts = admins.map(admin => `@${admin.id.split('@')[0]}`).join(' ');

      // Construir mensagem
      const message = {
        text: `👑 *Administradores do grupo*:\n\n${mentionTexts}\n\n📢 *Mensagem:* ${customMessage}`,
        mentions: mentions
      };

      // Enviar mensagem marcando todos
      await sock.sendMessage(from, message);
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no comando admtag:', error);
      await sock.sendMessage(from, { text: '❌ Ocorreu um erro ao marcar os administradores.' });
      await sock.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
  }
};