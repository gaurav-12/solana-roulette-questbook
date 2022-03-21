const web3 = require("@solana/web3.js");
const {
  getWalletBalance,
  airDropSol,
  transferSOL,
  treasurySecretKey,
  userSecretKey,
} = require("./helpers/accounts");
const { getRandom } = require("./helpers/misc");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const treasuryWallet = web3.Keypair.fromSecretKey(treasurySecretKey);
const userWallet = web3.Keypair.fromSecretKey(userSecretKey);

console.log(`
============================
    WELCOME TO SOL STAKE    
============================
`);

const randomNumber = getRandom(1, 5);
console.log(randomNumber);
let solToStake, ratio, numberPick;

readline.question("How much SOL do you want to stake? ", (s) => {
  solToStake = parseInt(s);
  readline.question(
    "At what ratio do you want to stake?(1:2, 1:1.5, 1:2.5) 1:",
    (r) => {
      ratio = parseFloat(r);
      console.log(`You will get ${solToStake * ratio} on winning.`);

      readline.question(
        "Finally, pick a random number between 1 & 5: ",
        async (p) => {
          numberPick = parseInt(p);

          const userBalance = await getWalletBalance(
            userWallet.publicKey.toString()
          );
          if (numberPick == randomNumber) {
            if (userBalance < solToStake)
              console.log("Insufficient balance. Exiting...");
            else {
              const payment = await transferSOL(
                userWallet,
                treasuryWallet,
                solToStake
              );
              console.log(
                `Payment done in transaction signature(txid) ${payment}`
              );

              const airdrop = await airDropSol(
                userWallet.publicKey.toString(),
                solToStake * ratio
              );
              console.log(
                `Winning amount sent in transaction signature(txid) ${payment}`
              );
            }
          } else {
            console.log("OOF Wrong guess...Exiting...");
          }

          readline.close();
        }
      );
    }
  );
});
