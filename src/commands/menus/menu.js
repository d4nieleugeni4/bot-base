const { prefixo, versao, nomeBot, numeroDono } = require('../../config');

module.exports = {
  name: `${prefixo}menu`,

  run: async (sock, m, from) => {
    try {
      const date = new Date();

      const dono = numeroDono.split('@')[0]; // Extrai só o número do dono (sem @s.whatsapp.net)

      const menuText = `
┌─⫸ ${nomeBot} ⫷─┐
│
│➢ Data: ${date.toLocaleDateString("pt-BR")}
│➢ Hora: ${date.toLocaleTimeString("pt-BR")}
│➢ Prefixo: ${prefixo}
│➢ Versão: ${versao}
│➢ Dono: wa.me/${dono}
│
└─────────────⫸

📋 *Menus Disponíveis:*

🔐 ${prefixo}menuadm
👥 ${prefixo}menumembro
🎞️ ${prefixo}menumidia
👑 ${prefixo}menudono
`;

      await sock.sendMessage(from, { text: menuText });
      await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
      console.error('Erro ao exibir o menu:', error);
    }
  }
};