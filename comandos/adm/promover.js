module.exports = {
  comando: "promover",
  exec: async (sock, m) => {
    const from = m.key.remoteJid;

    if (!from.endsWith("@g.us")) {
      return sock.sendMessage(from, { text: "❌ Esse comando só pode ser usado em grupos!" });
    }

    const groupMetadata = await sock.groupMetadata(from);
    const sender = m.key.participant || m.key.remoteJid;
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

    if (!isAdmin) {
      return sock.sendMessage(from, { text: "⚠️ Apenas administradores podem usar este comando!" });
    }

    const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) {
      return sock.sendMessage(from, { text: "📌 Marque alguém para promover!" });
    }

    await sock.groupParticipantsUpdate(from, [mentioned], "promote");
    await sock.sendMessage(from, { text: "🎖️ Usuário promovido a administrador." });
  }
};
