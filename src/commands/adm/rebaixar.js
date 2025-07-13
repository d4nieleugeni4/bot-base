const isAdmin = require('../../middlewares/isAdmin');
const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}rebaixar`,

  run: async (sock, m, from) => {
    try {
      // Verifica se o comando foi usado em um grupo
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { text: '🚫 Este comando só pode ser usado em grupos.' });
        return;
      }

      // Verifica se o remetente é admin
      const admin = await isAdmin(sock, m);
      if (!admin) {
        await sock.sendMessage(from, { text: '❌ Apenas administradores podem usar este comando.' });
        return;
      }

      // Obtém os participantes mencionados
      const participants = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
      
      // Valida se há menções
      if (!participants || participants.length === 0) {
        await sock.sendMessage(from, { 
          text: `❗ Marque o usuário que você deseja rebaixar.\n\nExemplo:\n${prefixo}rebaixar @usuario` 
        });
        return;
      }

      // Obtém metadados do grupo para verificar se o usuário é admin
      const groupMetadata = await sock.groupMetadata(from);
      const targetUser = participants[0];
      const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetUser)?.admin;

      // Verifica se o alvo é admin antes de rebaixar
      if (!isTargetAdmin) {
        await sock.sendMessage(from, { text: '⚠️ Este usuário já não é um administrador.' });
        return;
      }

      // Executa o rebaixamento
      await sock.groupParticipantsUpdate(from, [targetUser], 'demote');
      
      // Confirmação
      await sock.sendMessage(from, { 
        text: `✅ Usuário rebaixado com sucesso!` 
      });
      
      // Reação na mensagem original
      await sock.sendMessage(from, { 
        react: { text: '✅', key: m.key } 
      });

    } catch (error) {
      console.error('Erro ao rebaixar usuário:', error);
      await sock.sendMessage(from, { 
        text: '❌ Ocorreu um erro ao tentar rebaixar o usuário.' 
      });
    }
  }
};