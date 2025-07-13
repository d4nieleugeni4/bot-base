class GroupHandler {
  setup(sock) {
    sock.ev.on("group-participants.update", async (update) => {
      const { id, participants, action } = update;
      
      // Exemplo: Notificar quando alguém é adicionado
      if (action === "add") {
        const user = participants[0];
        await sock.sendMessage(id, { 
          text: `Bem-vindo(a) @${user.split('@')[0]} ao grupo!`,
          mentions: [user]
        });
      }
      
      // Adicione mais lógicas conforme necessário
    });
  }
}

module.exports = new GroupHandler();
