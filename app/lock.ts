import { Program, Wallet } from "@coral-xyz/anchor";
import type { Laps } from "./idl/laps";
import idl from "./idl/laps.json";
import { Connection, Keypair } from "@solana/web3.js";

async function main() {
  const key = new Uint8Array([
    233, 216, 162, 3, 207, 96, 166, 69, 155, 111, 20, 251, 203, 221, 65, 7, 136,
    27, 128, 225, 120, 175, 153, 31, 90, 191, 138, 83, 20, 10, 231, 44, 229, 99,
    143, 44, 221, 238, 221, 86, 79, 100, 230, 126, 183, 134, 13, 180, 212, 157,
    0, 171, 206, 187, 97, 89, 125, 189, 218, 240, 224, 218, 216, 10,
  ]);
  const keypair = Keypair.fromSecretKey(key);
  const stateAccountKeyPair = new Keypair();
  const wallet = new Wallet(keypair);

  const connection = new Connection("http://localhost:8899");

  const program = new Program<Laps>(idl as Laps, {
    connection,
  });


  const all = await program.account.lockingData.all()
  console.log(all)
  const info = await connection.getAccountInfo(wallet.publicKey)
}

main().catch(console.error);
