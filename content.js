chrome.storage.sync.get(['preferredCurrency'], (result) => {
    const preferredCurrency = result.preferredCurrency || 'USD';
    const currencyRegex = /(\d+(\.\d{1,2})?)\s?(USD|EUR|GBP|JPY|INR)/g;
  
    function traverseNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const matches = node.textContent.match(currencyRegex);
        if (matches) {
          matches.forEach((match) => {
            const parts = match.match(/(\d+(\.\d{1,2})?)\s?(USD|EUR|GBP|JPY|INR)/);
            const amount = parseFloat(parts[1]);
            const currency = parts[3];
  
            if (currency !== preferredCurrency) {
              chrome.runtime.sendMessage(
                {
                  type: 'convertCurrency',
                  baseCurrency: currency,
                  targetCurrency: preferredCurrency,
                  amount: amount,
                },
                (response) => {
                  if (response && response.convertedAmount) {
                    const convertedText = `${amount} ${currency} (~${response.convertedAmount} ${preferredCurrency})`;
                    node.textContent = node.textContent.replace(match, convertedText);
                  }
                }
              );
            }
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.childNodes.forEach(traverseNodes);
      }
    }
  
    traverseNodes(document.body);
  });
  