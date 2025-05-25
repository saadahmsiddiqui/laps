import { config } from "dotenv";
import { Program, Wallet } from "@coral-xyz/anchor";
import type { Laps } from "./idl/laps";
import idl from "./idl/laps.json";
import { Connection, Keypair } from "@solana/web3.js";

config();

async function main() {
  const SECRETKEY = process.env.SECRET_KEY.split(",").map((num) => Number(num));
  const key = new Uint8Array(SECRETKEY);
  const keypair = Keypair.fromSecretKey(key);
  const wallet = new Wallet(keypair);

  const connection = new Connection("http://localhost:8899");

  const program = new Program<Laps>(idl as Laps, {
    connection,
  });


  const all = await program.account.lockingData.all()
  console.log(all)
  const info = await connection.getAccountInfo(wallet.publicKey)
  console.log(info)
}

main().catch(console.error);
