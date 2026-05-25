require('dotenv').config()

const { Telegraf, Markup } = require('telegraf')

const token = process.env.BOT_TOKEN

if (!token) {
    throw new Error('BOT TOKEN KHÔNG TỒN TẠI')
}

const bot = new Telegraf(token)

// DATABASE TẠM
const users = {}

// HÀM LẤY NGÔN NGỮ
function getLang(id) {
    return users[id]?.lang || 'vi'
}

// TEXT ĐA NGÔN NGỮ
const text = {

    vi: {
        welcome: '✨ MMO SHOP',
        products: '🛍 Sản phẩm',
        orders: '📦 Đơn hàng của tôi',
        deposit: '💰 Nạp số dư',
        language: '🌐 Ngôn ngữ',
        support: '🆘 Hỗ trợ',
        api: '🔑 API Key',
        cart: '🛒 Giỏ hàng'
    },

    en: {
        welcome: '✨ MMO SHOP',
        products: '🛍 Products',
        orders: '📦 My Orders',
        deposit: '💰 Deposit',
        language: '🌐 Language',
        support: '🆘 Support',
        api: '🔑 API Key',
        cart: '🛒 Cart'
    }
}

// MENU CHÍNH
function mainMenu(lang) {

    return Markup.keyboard([
        [text[lang].products, text[lang].orders],
        [text[lang].deposit, text[lang].api],
        [text[lang].language, text[lang].support],
        [text[lang].cart]
    ]).resize()
}

// START BOT
bot.start((ctx) => {

    const id = ctx.from.id
    const name = ctx.from.first_name

    // TẠO USER
    if (!users[id]) {
        users[id] = {
            balance: 0,
            lang: 'vi'
        }
    }

    const lang = getLang(id)

    ctx.replyWithHTML(`
<b>${text[lang].welcome}</b>

👋 Xin chào, <b>${name}</b>

🆔 ID: <code>${id}</code>

💰 Số dư: <b>${users[id].balance}đ</b>

📦 Đơn hàng: <b>0</b>
`,
    mainMenu(lang))
})

// MENU NGÔN NGỮ
bot.hears(['🌐 Ngôn ngữ', '🌐 Language'], (ctx) => {

    ctx.reply(
        'Choose language',
        Markup.keyboard([
            ['🇻🇳 Tiếng Việt'],
            ['🇺🇸 English']
        ]).resize()
    )
})

// CHỌN VIỆT
bot.hears('🇻🇳 Tiếng Việt', (ctx) => {

    users[ctx.from.id].lang = 'vi'

    ctx.reply(
        '✅ Đã chuyển sang tiếng Việt',
        mainMenu('vi')
    )
})

// CHỌN ENGLISH
bot.hears('🇺🇸 English', (ctx) => {

    users[ctx.from.id].lang = 'en'

    ctx.reply(
        '✅ Switched to English',
        mainMenu('en')
    )
})

// DANH SÁCH SẢN PHẨM
bot.hears(['🛍 Sản phẩm', '🛍 Products'], (ctx) => {

    const lang = getLang(ctx.from.id)

    if (lang == 'vi') {

        ctx.reply(`
1️⃣ Capcut Pro 30 ngày

2️⃣ Youtube Premium 6 tháng

3️⃣ Youtube Premium 1 năm

4️⃣ Netflix 1 tháng

5️⃣ Spotify Premium 1 tháng
`)
    }

    else {

        ctx.reply(`
1️⃣ Capcut Pro 30 Days

2️⃣ Youtube Premium 6 Months

3️⃣ Youtube Premium 1 Year

4️⃣ Netflix 1 Month

5️⃣ Spotify Premium 1 Month
`)
    }

})

// NẠP TIỀN
bot.hears(['💰 Nạp số dư', '💰 Deposit'], (ctx) => {

    const code =
    'NAP' + Math.floor(Math.random() * 999999)

    const qr =
'https://img.vietqr.io/image/MB-1981905174162-print.png?amount=50000&addInfo=' + code

    ctx.replyWithPhoto(qr, {

        caption:
`
🏦 NẠP SỐ DƯ

Ngân hàng: MB BANK

Số TK:
1981905174162

Chủ TK:
NGUYEN DUY LINH

Số tiền:
50,000đ

Nội dung CK:
${code}

⏰ QR tồn tại 15 phút
`
    })

})

// ĐƠN HÀNG
bot.hears(['📦 Đơn hàng của tôi', '📦 My Orders'], (ctx) => {

    ctx.reply('📭 Chưa có đơn hàng')
})

// API KEY
bot.hears('🔑 API Key', (ctx) => {

    ctx.reply(`
🔑 API KEY

DEMO-123456
`)
})

// HỖ TRỢ
bot.hears(['🆘 Hỗ trợ', '🆘 Support'], (ctx) => {

    ctx.reply(`
📞 ADMIN SUPPORT

@admin
`)
})

// GIỎ HÀNG
bot.hears(['🛒 Giỏ hàng', '🛒 Cart'], (ctx) => {

    ctx.reply('🛒 Giỏ hàng trống')
})

bot.launch()

console.log('BOT ĐANG CHẠY...')
