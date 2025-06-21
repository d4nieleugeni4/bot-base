const { prefixo } = require("../../config/config");

module.exports = {
  comando: "ban",
  exec: async (sock, m) => {
    const from = m.key.remoteJid;

    if (!from.endsWith("@g.us")) {
      return sock.sendMessage(from, { text: `❌ Esse comando só pode ser usado em grupos!\nUse: ${prefixo}ban @usuario` });
    }

    const groupMetadata = await sock.groupMetadata(from);
    const sender = m.key.participant || m.key.remoteJid;
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

    if (!isAdmin) {
      return sock.sendMessage(from, { text: "⚠️ Apenas administradores podem usar este comando!" });
    }

    const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
      return sock.sendMessage(from, { text: `🚫 Marque um usuário para banir!\nEx: ${prefixo}ban @usuario` });
    }

    await sock.groupParticipantsUpdate(from, [mentioned], "remove");
    await sock.sendMessage(from, { text: "✅ Usuário removido com sucesso." });
  }
};
