import { config } from "dotenv";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import type { Laps } from "./types/laps";
import idl from "./idl/laps.json";
import { Connection, Keypair } from "@solana/web3.js";

config();

async function main() {
  const SECRETKEY = process.env.SECRET_KEY.split(",").map((num) => Number(num));
  const key = new Uint8Array(SECRETKEY);
  const keypair = Keypair.fromSecretKey(key);
  const wallet = new Wallet(keypair);
  console.log(`Using account: ${wallet.publicKey}`)

  const connection = new Connection("http://localhost:8899");
  const provider = new AnchorProvider(connection, wallet)
  const program = new Program<Laps>(idl as Laps, provider);
  // TODO: change timing
  const delay = new BN(5 * 60 * 1000);
  const amount = new BN(1.5 * 1e9);

  let info = await connection.getAccountInfo(wallet.publicKey);
  console.log(`Balance before locking: ${info.lamports}`)
  
  const lockTx = await program.methods.lock(delay, amount).accounts({
    signer: wallet.publicKey
  }).signers([keypair]).rpc()

  console.log(`Transaction submitted: ${lockTx}`)
}

main().catch(console.error);
