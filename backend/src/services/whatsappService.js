const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Initialize the WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(), // Saves your login so you don't scan every time
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

/**
 * Initialize the WhatsApp Bot
 */
exports.initWhatsApp = () => {
    client.on('qr', (qr) => {
        console.log('------------------------------------------------------------');
        console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP TO START THE BOT');
        console.log('------------------------------------------------------------');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('✅ Rentify WhatsApp Bot is READY!');
    });

    client.on('authenticated', () => {
        console.log('🔐 WhatsApp Bot Authenticated!');
    });

    client.on('auth_failure', msg => {
        console.error('❌ WhatsApp Auth Failure:', msg);
    });

    client.initialize().catch(err => console.error('WhatsApp Init Error:', err));
};

/**
 * Send a welcome message to a user
 * @param {string} phone - User's phone number
 * @param {string} name - User's name
 * @param {string} role - User's role
 */
exports.sendWhatsAppWelcome = async (phone, name, role) => {
    try {
        if (!phone) return;

        // Format phone number (remove +, spaces, and add @c.us)
        // Note: For India, make sure it has 91 prefix.
        let formattedPhone = phone.replace(/[^\d]/g, '');
        if (formattedPhone.length === 10) formattedPhone = '91' + formattedPhone;
        const chatId = formattedPhone + '@c.us';

        const roleKey = (role || 'RENTER').toUpperCase();
        
        const messages = {
            RENTER: `🗝️ *Welcome home, ${name}!* \n\nYour digital keys to Rentify are now active. We’ve handled the paperwork so you can focus on making your new place feel like home. Your premium dashboard is live! 🏡✨`,
            
            OWNER: `📈 *Rentify | Business Mode Active, ${name}!* \n\nWelcome to a smarter way to manage your portfolio. Your property command center is now live. We've automated the heavy lifting so you can focus on growth. 🏢💼`,
            
            SERVICE: `🛠️ *Service Hub Online, ${name}!* \n\nWelcome to the Rentify elite network. Your service dashboard is ready for new jobs. We connect you with the right properties at the right time. ⚡🔧`,
            
            INSPECTOR: `🔍 *Rentify | Inspection Protocol Active, ${name}!* \n\nWelcome to the network of certified inspectors. Your digital toolkit is now synced and ready for your first assignment. 📋✅`
        };

        const message = messages[roleKey] || messages.RENTER;

        await client.sendMessage(chatId, message);
        console.log(`[WhatsApp Bot] Welcome message sent to ${name} (${phone})`);
    } catch (error) {
        console.error('[WhatsApp Bot] Send error:', error.message);
    }
};
