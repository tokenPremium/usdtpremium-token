function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function init() {
  await delay(800);

  if (!window.tronWeb || !window.tronWeb.ready) {
    alert("Sila sambung TronLink Wallet dan refresh semula laman ini.");
    return;
  }

  const tronWeb = window.tronWeb;
  const walletAddress = tronWeb.defaultAddress.base58;
  document.getElementById("wallet-address").innerText = "Wallet: " + walletAddress;

  const trxBalance = await tronWeb.trx.getBalance(walletAddress);
  document.getElementById("trx-balance").innerText = "TRX Balance: " + (trxBalance / 1e6).toFixed(4);

  const usdtContractAddress = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
  const usdtContract = await tronWeb.contract().at(usdtContractAddress);
  const usdtBalance = await usdtContract.methods.balanceOf(walletAddress).call();
  const formattedUSDT = tronWeb.toBigNumber(usdtBalance).dividedBy(1e6).toFixed(2);
  document.getElementById("usdt-balance").innerText = "USDT Balance: " + formattedUSDT;
}

window.addEventListener("load", init);

// BUTANG CREATE TOKEN
document.getElementById("create-token-btn").addEventListener("click", async () => {
  const statusDiv = document.getElementById("token-status");
  statusDiv.innerText = "Sedang melancarkan token...";

  try {
    const abi = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const bytecode = "6080604052348015600f57600080fd5b5060a98061001e6000396000f3fe6080604052600080fdfea2646970667358221220c27e640eaf27de790ea47e3dc8787d4b804f10840d39950b6bdf761be38f5e6664736f6c634300080b0033";

    const contract = await window.tronWeb.contract().new({
      abi,
      bytecode
    });

    statusDiv.innerText = "✅ Token dilancar di alamat: " + contract.address;
  } catch (err) {
    console.error(err);
    statusDiv.innerText = "❌ Gagal lancar token.";
  }
});
