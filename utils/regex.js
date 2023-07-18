const ruRegex = /^[?!"';,.а-яА-ЯёЁ0-9\s]+$/;
const engRegex = /^[?!"';,.a-zA-Z0-9\s]+$/;
const urlRegex = /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{0,}/i;

module.exports = {
  ruRegex,
  engRegex,
  urlRegex,
};
