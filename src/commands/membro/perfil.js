const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}perfil`,

  run: async (sock, m, from) => {
    try {
      // Verificar se é grupo
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { text: '🚫 Este comando só pode ser usado em grupos!' });
        return;
      }

      // Obter dados da mensagem
      const messageType = Object.keys(m.message)[0];
      const text = m.message.conversation || m.message[messageType]?.text || "";
      const mentions = m.message[messageType]?.contextInfo?.mentionedJid || [];
      const args = text.split(' ').slice(1);

      // Determinar alvo
      let targetJid = m.participant || m.key.participant; // Usuário que enviou o comando
      
      // Verificar menção
      if (mentions.length > 0) {
        targetJid = mentions[0];
      } 
      // Verificar se foi fornecido número
      else if (args.length > 0) {
        const numberInput = args[0].replace(/[^0-9]/g, '');
        if (numberInput.length >= 10) {
          targetJid = `${numberInput}@s.whatsapp.net`;
        }
      }

      // Verificar se usuário existe no WhatsApp
      const [userExists] = await sock.onWhatsApp(targetJid).catch(() => [null]);
      if (!userExists?.exists) {
        await sock.sendMessage(from, { text: '❌ Usuário não encontrado no WhatsApp.' });
        return;
      }

      // Obter metadados do grupo
      const groupMetadata = await sock.groupMetadata(from).catch(() => null);
      
      // Verificar se usuário está no grupo
      let isInGroup = true;
      let role = 'Membro';
      if (groupMetadata) {
        isInGroup = groupMetadata.participants.some(p => p.id === targetJid);
        const participant = groupMetadata.participants.find(p => p.id === targetJid);
        if (participant?.admin) {
          role = participant.admin === 'superadmin' ? 'Super Admin' : 'Admin';
        }
      }

      // Obter dados do perfil
      const profilePic = await sock.profilePictureUrl(targetJid, 'image').catch(() => null);
      const status = await sock.fetchStatus(targetJid).catch(() => null);
      const userInfo = await sock.fetchBlocklist().catch(() => []);
      const isBlocked = userInfo.includes(targetJid);

      // Construir mensagem
      const username = targetJid.split('@')[0];
      const mensagem = `
👤 *INFORMAÇÕES DO PERFIL*

📌 *Nome:* ${m.pushName || 'Não disponível'}
📞 *Número:* wa.me/${username}
${profilePic ? '🖼️ *Foto de perfil:* Disponível' : '🖼️ *Foto de perfil:* Privada'}
📝 *Status:* ${status?.status || 'Não configurado'}
⏱️ *Última atualização:* ${status?.setAt ? new Date(status.setAt).toLocaleString('pt-BR') : 'Nunca alterado'}

👥 *NO GRUPO:*
🎖️ *Cargo:* ${role}
🚫 *Bloqueado:* ${isBlocked ? 'Sim' : 'Não'}
${!isInGroup ? '⚠️ *Observação:* Usuário não está neste grupo' : ''}`;

      // Enviar resposta
      const messageOptions = {
        text: mensagem,
        mentions: [targetJid]
      };

      if (profilePic) {
        messageOptions.image = { url: profilePic };
        messageOptions.caption = mensagem;
      }

      await sock.sendMessage(from, messageOptions);
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro no comando perfil:', error);
      await sock.sendMessage(from, { 
        text: '❌ Não foi possível verificar o perfil. O usuário pode ter restrições de privacidade.' 
      });
      await sock.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
  }
};