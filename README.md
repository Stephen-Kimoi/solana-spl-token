# Solana SPL Token Program

This is a Solana program written in Rust using the Anchor framework. It provides functionality to mint and transfer SPL (Solana Program Library) tokens.

## Instructions

### `mint_token`

The `mint_token` instruction mints a specified amount of tokens (1 billion in this case) to a designated token account.

It takes the following accounts:

- `mint`: The SPL Token mint account to be initialized.
- `token_account`: The token account where the minted tokens will be stored.
- `payer`: The account that will pay for the rent-exemption and initialization of the mint and token accounts.
- `token_program`: The SPL Token program ID.
- `system_program`: The Solana system program ID.
- `rent`: The Solana rent sysvar account.

### `transfer_token`

The `transfer_token` instruction transfers a specified amount of tokens (1 million in this case) from one token account to another.

It takes the following accounts:

- `from`: The token account from which the tokens will be transferred.
- `to`: The token account to which the tokens will be transferred.
- `payer`: The account that will pay for the transaction fee.
- `token_program`: The SPL Token program ID.

## Structs

### `MintToken`

This struct defines the accounts required for the `mint_token` instruction.

### `TransferToken`

This struct defines the accounts required for the `transfer_token` instruction.

## Usage

Check out the deployed token over [here](https://explorer.solana.com/address/RrqPJ31F1vQbckUoTMhqJMMrAXiFUvWWnRFvqax7J7j?cluster=devnet)