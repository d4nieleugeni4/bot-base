const { prefixo } = require('../../config');

module.exports = {
  name: `${prefixo}infogp`,

  run: async (sock, m, from) => {
    try {
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { text: '🚫 Este comando só pode ser usado dentro de grupos.' });
        return;
      }

      const metadata = await sock.groupMetadata(from);

      const groupName = metadata.subject;
      const groupId = metadata.id;
      const groupOwner = metadata.owner ? `wa.me/${metadata.owner.split('@')[0]}` : 'Indefinido';
      const creationDate = new Date(metadata.creation * 1000).toLocaleString('pt-BR');

      const infoText = `
👥 *Informações do Grupo*

🏷️ Nome: ${groupName}
🆔 ID: ${groupId}
👑 Criador: ${groupOwner}
📅 Criado em: ${creationDate}
👥 Total de participantes: ${metadata.participants.length}
`;

      await sock.sendMessage(from, { text: infoText });
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro ao pegar informações do grupo:', error);
      await sock.sendMessage(from, { text: '❌ Não consegui pegar as informações do grupo.' });
    }
  }
};