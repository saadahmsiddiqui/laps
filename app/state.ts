import { config } from "dotenv";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import type { Laps } from "./types/laps";
import idl from "./idl/laps.json";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

config();

async function main() {
  const SECRETKEY = process.env.SECRET_KEY.split(",").map((num) => Number(num));
  const key = new Uint8Array(SECRETKEY);
  const keypair = Keypair.fromSecretKey(key);
  const wallet = new Wallet(keypair);
  console.log(`Using account: ${wallet.publicKey}`);

  const connection = new Connection("http://localhost:8899");
  const provider = new AnchorProvider(connection, wallet);
  const program = new Program<Laps>(idl as Laps, provider);
  const [stateAccount, _bump] = PublicKey.findProgramAddressSync(
    [utf8.encode("laps"), keypair.publicKey.toBuffer()],
    program.programId
  );

  const data = await program.account.lockingData.fetch(stateAccount);
  console.log(`Unlock time: ${new Date(data.unlockTimestamp.toNumber() * 1000)} ${data.unlockTimestamp} Amount: ${data.amount.toNumber()/1e9}`);
}

main().catch(console.error);
