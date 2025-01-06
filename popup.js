document.getElementById('saveCurrency').addEventListener('click', () => {
    const selectedCurrency = document.getElementById('currencySelect').value;
    chrome.storage.sync.set({ preferredCurrency: selectedCurrency }, () => {
      alert(`Preferred currency set to: ${selectedCurrency}`);
    });
  });
  