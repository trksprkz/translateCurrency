import currencyapi from '@everapi/currencyapi-js';

const API_KEY = 'cur_live_RHjB6NFMkJmz0Mxq3IDwLFz6TCcZKOt2A5a98wF9';
const client = new currencyapi(API_KEY);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'convertCurrency') {
    const { baseCurrency, targetCurrency, amount } = message;

    client
      .latest({
        base_currency: baseCurrency,
        currencies: targetCurrency,
      })
      .then((response) => {
        const rate = response.data[targetCurrency].value;
        const convertedAmount = (amount * rate).toFixed(2);
        sendResponse({ convertedAmount });
      })
      .catch((error) => {
        console.error('CurrencyAPI Error:', error);
        sendResponse({ error: 'Failed to convert currency' });
      });

    return true; // Keeps the messaging channel open for async response
  }
});
