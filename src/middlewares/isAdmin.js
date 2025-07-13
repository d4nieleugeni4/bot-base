async function isAdmin(sock, message) {
    try {
        const groupMetadata = await sock.groupMetadata(message.key.remoteJid);
        const sender = message.key.participant || message.key.remoteJid;

        const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);

        return admins.includes(sender);
    } catch (error) {
        console.error('Erro ao verificar admin:', error);
        return false;
    }
}

module.exports = isAd
