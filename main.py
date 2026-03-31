import os
import logging
import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes

# إعداد السجلات (Logs) لمراقبة الأداء والأخطاء
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# الإعدادات - تأكد من وضع التوكن الخاص بك هنا أو في المتغيرات البيئية
BOT_TOKEN = os.environ.get("BOT_TOKEN", "8604072763:AAFNYb5LOMgbj5h5-UEcRhv2zuGs7yPRhkc")
KEYAUTH_SELLER_KEY = os.environ.get("KEYAUTH_SELLER_KEY", "")
KEYAUTH_API_URL = "https://keyauth.win/api/seller/"

CHANNEL_URL = "https://t.me/Fluoriteofficiel"
SUPPORT_USERNAME = "@IVANExKING"

# القوائم (Menus)
def get_main_menu():
    keyboard = [
        [
            InlineKeyboardButton("📁 Get Files", callback_data="get_files"),
            InlineKeyboardButton("🔍 Check Status", callback_data="check_status")
        ],
        [InlineKeyboardButton("🛒 Buy Keys", callback_data="buy_keys")],
        [InlineKeyboardButton("🏦 Account", callback_data="account")],
        [
            InlineKeyboardButton("📞 Support", callback_data="support"),
            InlineKeyboardButton("📢 Channel", url=CHANNEL_URL)
        ],
        [InlineKeyboardButton("ℹ️ About", callback_data="about")]
    ]
    return InlineKeyboardMarkup(keyboard)

# دالة البداية /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = (
        "🛒 <b>Welcome to our store!</b>\n\n"
        "⭐ Best prices guaranteed\n"
        "⭐ Instant delivery\n"
        "⭐ 24/7 Support\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "📦 <b>Choose an option:</b>\n"
        "━━━━━━━━━━━━━━━━━━━━"
    )
    await update.message.reply_text(
        welcome_text,
        reply_markup=get_main_menu(),
        parse_mode="HTML"
    )

# دالة إعادة تعيين المفتاح /reset
async def reset_key(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("❌ <b>Please provide a key.</b>\nUsage: <code>/reset YOUR_KEY_HERE</code>", parse_mode="HTML")
        return
    
    key = context.args[0].upper()
    
    if not KEYAUTH_SELLER_KEY:
        await update.message.reply_text("⚠️ <b>Reset service is not configured.</b>", parse_mode="HTML")
        return
    
    try:
        params = {"sellerkey": KEYAUTH_SELLER_KEY, "type": "resethwid", "key": key}
        response = requests.get(KEYAUTH_API_URL, params=params, timeout=10)
        data = response.json()
        
        if data.get("success"):
            await update.message.reply_text("♻️ <b>Key has been reset.</b>", parse_mode="HTML")
        else:
            await update.message.reply_text(f"❌ <b>Error:</b> {data.get('message', 'Unknown error')}", parse_mode="HTML")
    except Exception as e:
        logger.error(f"Error resetting key: {e}")
        await update.message.reply_text("❌ <b>An error occurred during reset.</b>", parse_mode="HTML")

# تشغيل البوت (الجزء الذي كان ناقصاً)
def main():
    if not BOT_TOKEN or BOT_TOKEN == "8604072763:AAFNYb5LOMgbj5h5-UEcRhv2zuGs7yPRhkc":
        print("خطأ: يرجى وضع BOT_TOKEN الخاص بك!")
        return

    application = Application.builder().token(BOT_TOKEN).build()

    # إضافة الأوامر
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("reset", reset_key))

    print("البوت يعمل الآن...")
    application.run_polling()

if __name__ == '__main__':
    main()
