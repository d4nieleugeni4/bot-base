const { prefixo } = require("../../config/config");

module.exports = {
  comando: "infogp",
  exec: async (sock, m) => {
    const from = m.key.remoteJid;

    // Verifica se está em grupo
    if (!from.endsWith("@g.us")) {
      return sock.sendMessage(from, {
        text: `❌ Esse comando só pode ser usado em grupos!\nUse: ${prefixo}infogp dentro de um grupo.`,
      });
    }

    const groupMetadata = await sock.groupMetadata(from);

    const nome = groupMetadata.subject;
    const id = groupMetadata.id;
    const criadoEm = new Date(groupMetadata.creation * 1000).toLocaleString("pt-BR");
    const criador = groupMetadata.owner || "Desconhecido";

    const participantes = groupMetadata.participants;
    const administradores = participantes
      .filter(p => p.admin)
      .map(p => `@${p.id.split("@")[0]}`)
      .join(", ");

    const total = participantes.length;

    const msg = `📄 *INFORMAÇÕES DO GRUPO*\n\n` +
      `🏷️ *Nome:* ${nome}\n` +
      `🆔 *ID:* ${id}\n` +
      `👑 *Criador:* wa.me/${criador.replace("@s.whatsapp.net", "")}\n` +
      `📆 *Criado em:* ${criadoEm}\n` +
      `🧑‍🤝‍🧑 *Total de membros:* ${total}\n` +
      `🛡️ *Administradores:*\n${administradores || "Nenhum"}`;

    await sock.sendMessage(from, {
      text: msg,
      mentions: participantes.filter(p => p.admin).map(p => p.id)
    });
  }
};
