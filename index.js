const axios = require("axios");

function findGreater(arr) {
  let bestIndex = 0;
  let bestValue = arr[0];
  for(let i=1; i < arr.length; i++)  {
    if(arr[i] > bestValue){
      bestValue = arr[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}


setInterval(async () => {
  const {data} = await axios.get("https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=5000");
  
  const bidsFloat = data.bids.map(b => [parseFloat(b[0]), parseFloat(b[1])]);
  const asksFloat = data.asks.map(a => [parseFloat(a[0]), parseFloat(a[1])]);

  // Calcula o valor nominal (notional)
  const bidsNotional = bidsFloat.map( b => b[0] * b[1]);
  const asksNotional = asksFloat.map( a => a[0] * a[1]);
  
  // Somatorio de valores nominais
  const bidsSum = bidsNotional.reduce((a,b) => a + b);
  const asksSum = asksNotional.reduce((a,b) => a + b);
  
  console.log("Birds:" + bidsSum);
  console.log("Asks:" + asksSum);

  let difference = 0;

  if(bidsSum > asksSum) {
    console.log("Força compradora vencendo, o preço tende a subir!");
    difference = (bidsSum * 100 / asksSum) - 100;
    
  }
  else {
    console.log("Força vendedora vencendo, o preço tende a cair!");
    difference = (asksSum * 100 / asksSum) - 100;
  }
  console.log(difference.toFixed(2) + "%");

  const bestByIndex = findGreater(bidsNotional);
  console.log("Maior zona de zona de compra: " + bidsFloat[bestByIndex]);

   const bestSellIndex = findGreater(asksNotional);
  console.log("Maior zona de zona de venda: " + asksFloat[bestSellIndex]);
  
  
},300);