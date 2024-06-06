import assert from "assert";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import type { SolanaSplToken } from "../target/types/solana_spl_token";

describe("solana_spl_token", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaSplToken as anchor.Program<SolanaSplToken>;
  
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaSplToken;

  // Generate a new mint and token account
  const mint = anchor.web3.Keypair.generate();
  const tokenAccount = anchor.web3.Keypair.generate();

  it("mints tokens", async () => {
    // Derive the rent exemption threshold
    const rent = await provider.connection.getMinimumBalanceForRentExemption(
      82
    );

    // Fund the mint account
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        provider.wallet.publicKey,
        anchor.web3.LAMPORTS_PER_SOL
      )
    );

    // Create the mint
    await program.rpc.mintToken({
      accounts: {
        mint: mint.publicKey,
        tokenAccount: tokenAccount.publicKey,
        payer: provider.wallet.publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [mint, tokenAccount],
      instructions: [
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: mint.publicKey,
          space: 82,
          lamports: rent,
          programId: anchor.utils.token.TOKEN_PROGRAM_ID,
        }),
      ],
    });

    // Fetch the token account balance
    const tokenAccountBalance =
      await provider.connection.getTokenAccountBalance(tokenAccount.publicKey);

    // Check if the balance is 1 billion
    assert.ok(tokenAccountBalance.value.amount === "1000000000");
  });

  it("transfers tokens", async () => {
    // Generate a new token account
    const toAccount = anchor.web3.Keypair.generate();

    // Transfer tokens
    await program.rpc.transferToken({
      accounts: {
        from: tokenAccount.publicKey,
        to: toAccount.publicKey,
        payer: provider.wallet.publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      },
    });

    // Fetch the token account balances
    const fromAccountBalance = await provider.connection.getTokenAccountBalance(
      tokenAccount.publicKey
    );
    const toAccountBalance = await provider.connection.getTokenAccountBalance(
      toAccount.publicKey
    );

    // Check if the balances are as expected
    assert.ok(fromAccountBalance.value.amount === "999999000");
    assert.ok(toAccountBalance.value.amount === "1000000");
  });
});
