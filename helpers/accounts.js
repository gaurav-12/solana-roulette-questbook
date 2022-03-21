const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  Account,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

// const newPair = new Keypair();
// const publicKey = new PublicKey(newPair.publicKey).toString();
// const secretKey = newPair.secretKey;

// Treasury account to hold user's staked SOL
module.exports.treasuryPublicKey =
  "4NKFVCRpES9PeGBYP6yeyYR4xcNvVUUkSKyK9D3jSo4m";
module.exports.treasurySecretKey = new Uint8Array([
  81, 77, 85, 201, 165, 116, 34, 152, 196, 3, 175, 108, 171, 1, 171, 35, 117,
  255, 55, 52, 58, 36, 93, 21, 121, 175, 143, 125, 249, 227, 191, 233, 50, 8,
  228, 145, 50, 95, 3, 250, 21, 19, 234, 120, 4, 151, 195, 150, 66, 50, 199, 18,
  131, 127, 51, 19, 53, 103, 112, 229, 94, 70, 124, 26,
]);

// Hardcoded account to stake SOL from
module.exports.userPublicKey = "GdJMtivEcSVHKQpmyBFFC8trDet3g75sg3Agv5qvb4Af";
module.exports.userSecretKey = new Uint8Array([
  93, 173, 176, 255, 233, 250, 78, 125, 37, 55, 134, 92, 104, 130, 39, 87, 100,
  5, 186, 69, 252, 105, 154, 209, 93, 249, 18, 75, 236, 167, 53, 148, 232, 43,
  215, 158, 191, 76, 66, 117, 191, 157, 6, 67, 31, 19, 35, 235, 2, 39, 174, 146,
  246, 134, 199, 154, 235, 244, 228, 37, 181, 226, 251, 188,
]);

module.exports.getWalletBalance = async (publicKey) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const walletBalance = await connection.getBalance(
      new PublicKey(publicKey) // or use variable 'publicKey'
    );
    console.log(`=> For wallet address ${publicKey}`);
    console.log(
      `   Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`
    );
    return parseInt(walletBalance) / LAMPORTS_PER_SOL;
  } catch (err) {
    console.log(err);
  }
};

module.exports.airDropSol = async (publicKey, dropAmount) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    console.log(`-- Airdropping 2 SOL --`);
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(publicKey),
      dropAmount * LAMPORTS_PER_SOL
    );
    console.log(`Airdropping to ${publicKey}...`);
    await connection.confirmTransaction(fromAirDropSignature);
    return fromAirDropSignature;
  } catch (err) {
    console.log(err);
  }
};

module.exports.transferSOL = async (from, to, transferAmt) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(from.publicKey.toString()),
        toPubkey: new PublicKey(to.publicKey.toString()),
        lamports: transferAmt * LAMPORTS_PER_SOL,
      })
    );
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);
    return signature;
  } catch (err) {
    console.log(err);
  }
};
