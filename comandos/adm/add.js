module.exports = {
  comando: "add",
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

    const text = m.message.conversation || m.message.extendedTextMessage?.text;
    const number = text.split(" ")[1]?.replace(/\D/g, "");

    if (!number) return sock.sendMessage(from, { text: "📲 Informe um número para adicionar!" });

    await sock.groupParticipantsUpdate(from, [`${number}@s.whatsapp.net`], "add");
    await sock.sendMessage(from, { text: `✅ ${number} foi adicionado ao grupo.` });
  }
};
