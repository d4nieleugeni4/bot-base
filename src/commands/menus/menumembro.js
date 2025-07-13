const { prefixo, nomeBot } = require('../../config');

module.exports = {
  name: `${prefixo}menumembro`,

  run: async (sock, m, from) => {
    try {
      const menuText = `
┌─⫸ ${nomeBot} | Menu Membro ⫷─┐
│
📋 *Comandos para Membros:*

🏓 ${prefixo}ping - Testa a latência do bot
📋 ${prefixo}infogp - Mostra informações do grupo
📎 ${prefixo}invite [número] - Gera link de convite
👤 ${prefixo}perfil [@usuário] - Mostra informações de um perfil
👑 ${prefixo}admtag [mensagem] - Marca todos os admins do grupo

🎲 *Comandos de Diversão:*
🪙 ${prefixo}cc <cara|coroa> - Cara ou coroa
✊ ${prefixo}ppt <pedra|papel|tesoura> - Pedra, papel e tesoura
🔢 ${prefixo}imparpar <impar|par> <número> - Ímpar ou par
🔫 ${prefixo}roleta - Roleta russa (1/6 chance de perder)

└─────────────⫸
`;

      await sock.sendMessage(from, { text: menuText });
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro ao exibir o Menu Membro:', error);
      await sock.sendMessage(from, { text: '❌ Ocorreu um erro ao exibir o menu.' });
    }
  }
};