exports.showBanner = (status = 'Iniciando...') => {
    // Códigos ANSI para cores e estilos
    const styles = {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",
        
        // Cores de texto
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        
        // Cores de fundo
        bgBlack: "\x1b[40m",
        bgRed: "\x1b[41m",
        bgGreen: "\x1b[42m",
        bgYellow: "\x1b[43m",
        bgBlue: "\x1b[44m",
        bgMagenta: "\x1b[45m",
        bgCyan: "\x1b[46m",
        bgWhite: "\x1b[47m"
    };

    // Limpa o console
    console.clear();

    // Cria o banner
    const banner = `
${styles.bgBlue}${styles.bright}${styles.white}╔══════════════════════════════════════════════════╗${styles.reset}
${styles.bgBlue}${styles.bright}${styles.white}║${styles.reset}${styles.bgBlue}${styles.bright}${styles.yellow}          🤖 JARVIS - WhatsApp Bot           ${styles.reset}${styles.bgBlue}${styles.white}║${styles.reset}
${styles.bgBlue}${styles.white}╚══════════════════════════════════════════════════╝${styles.reset}

${styles.cyan}╭──────────────────────────────────────────────────╮${styles.reset}
${styles.cyan}│${styles.reset}  ${styles.bright}📅 ${new Date().toLocaleString('pt-BR')}${styles.reset}
${styles.cyan}│${styles.reset}  ${styles.bright}📡 Status: ${status === 'conectado' ? styles.green + '🟢 ONLINE' : styles.red + '🔴 ' + status.toUpperCase()}${styles.reset}
${styles.cyan}╰──────────────────────────────────────────────────╯${styles.reset}

${styles.magenta}⚠️ Pressione ${styles.bright}CTRL+C${styles.reset}${styles.magenta} para encerrar o bot${styles.reset}
`;

    console.log(banner);
};

// Função para atualizar o banner periodicamente
exports.startBannerLoop = (getStatus) => {
    // Atualiza a cada 20 segundos
    setInterval(() => {
        const status = getStatus();
        exports.showBanner(status);
    }, 20000);
};
