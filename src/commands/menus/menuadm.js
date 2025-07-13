const { prefixo, nomeBot } = require('../../config');

module.exports = {
  name: `${prefixo}menuadm`,

  run: async (sock, m, from) => {
    try {
      const menuText = `
┌─⫸ ${nomeBot} | Menu ADM ⫷─┐
│
📋 *Comandos de Administração:*

➕ ${prefixo}add (Adiciona um membro ao grupo)
🔐 ${prefixo}onlyadms on/off (Fecha ou abre o grupo)
❌ ${prefixo}ban (Remove um membro do grupo)
🔼 ${prefixo}promover (Promove um membro a administrador)
🔽 ${prefixo}rebaixar (Remove o cargo de administrador)
🗑️ ${prefixo}deletar (Deleta uma mensagem marcada)
🔔 ${prefixo}hidetag [msg opcional] (Marca todos os membros)
👁️ ${prefixo}revelar (Revela mensagens de visualização única)

└─────────────⫸
`;

      await sock.sendMessage(from, { text: menuText });
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro ao exibir o Menu ADM:', error);
    }
  }
};