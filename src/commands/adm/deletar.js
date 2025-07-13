const isAdmin = require('../../middlewares/isAdmin');
const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}deletar`,
  aliases: [`${prefixo}delete`, `${prefixo}del`], // Adicionando aliases para o comando

  run: async (sock, m, from) => {
    try {
      // Verifica se é admin
      const admin = await isAdmin(sock, m);
      if (!admin) {
        await sock.sendMessage(from, { 
          text: '❌ Apenas administradores podem deletar mensagens.',
          mentions: [m.key.participant || m.key.remoteJid]
        });
        return;
      }

      // Verifica se é uma mensagem respondida
      const quoted = m.message?.extendedTextMessage?.contextInfo;

      if (!quoted?.stanzaId || !quoted?.participant) {
        await sock.sendMessage(from, { 
          text: `❗ Você precisa responder a mensagem que deseja deletar.\n\nExemplos:\n${prefixo}deletar (respondendo)\n${prefixo}del (respondendo)\n${prefixo}delete (respondendo)`,
          mentions: [m.key.participant || m.key.remoteJid]
        });
        return;
      }

      // Deleta a mensagem
      await sock.sendMessage(from, {
        delete: {
          remoteJid: from,
          fromMe: false,
          id: quoted.stanzaId,
          participant: quoted.participant
        }
      });

      // Reage e confirma a deleção
      await sock.sendMessage(from, { 
        react: { text: '✅', key: m.key } 
      });
      
      // Responde confirmando a ação
      await sock.sendMessage(from, { 
        text: '🗑️ Mensagem deletada com sucesso!',
        mentions: [m.key.participant || m.key.remoteJid]
      });

    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      await sock.sendMessage(from, { 
        text: '❌ Erro ao tentar deletar a mensagem. Verifique se eu tenho permissões suficientes.',
        mentions: [m.key.participant || m.key.remoteJid]
      });
    }
  }
};