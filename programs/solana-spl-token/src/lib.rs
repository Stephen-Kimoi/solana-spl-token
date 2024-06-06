use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, MintTo, TokenAccount, Transfer}; 

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("6A8iCWZPHAKV3gtkcM3idirxU2cXCPAJKrKNUx7bx9E3");

#[program]
pub mod solana_spl_token {
    use super::*;
    
    pub fn mint_token(ctx: Context<MintToken>) -> Result<()> {

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(), 
            to: ctx.accounts.token_account.to_account_info(), 
            authority: ctx.accounts.payer.to_account_info(), 
        }; 

        let cpi_program = ctx.accounts.token_program.to_account_info(); 
        let amount = 1_000_000_000; 

        token::mint_to(
            CpiContext::new_with_signer(
                cpi_program,
                cpi_accounts,
                &[
                    &[
                        ctx.accounts.mint.to_account_info().key.to_bytes().as_slice(),
                        ctx.accounts.payer.to_account_info().key.to_bytes().as_slice(),
                    ],
                    &[ctx.accounts.payer.to_account_info().key.to_bytes().as_slice()],
                ],
            ),
            amount,
        )?;

        Ok(())

    }

    pub fn transfer_token(ctx: Context<TransferToken>) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.from.to_account_info(), 
            to: ctx.accounts.to.to_account_info(), 
            authority: ctx.accounts.payer.to_account_info()
        }; 
        let cpi_program = ctx.accounts.token_program.to_account_info(); 
        let amount = 1_000_000; 

        token::transfer(
            CpiContext::new_with_signer(
                cpi_program,
                cpi_accounts,
                &[&[ctx.accounts.payer.to_account_info().key.to_bytes().as_slice()]],
            ),
            amount,
        )?;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintToken<'info> {
    #[account(init, payer = payer, mint::token_program = token_program, space = 82)] 
    pub mint: Account<'info, Mint>, 
    #[account(init, payer = payer, token::mint = mint, token::authority = payer)]
    pub token_account: Account<'info, TokenAccount>, 
    #[account(mut)] 
    pub payer: Signer<'info>, 
    pub token_program: Program<'info, Token>, 
    pub system_program: Program<'info, System>, 
    pub rent: Sysvar<'info, Rent>, 
}

#[derive(Accounts)]
pub struct TransferToken<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>, 
    #[account(mut)] 
    pub to: Account<'info, TokenAccount>, 
    #[account(mut)]
    pub payer: Signer<'info>, 
    pub token_program: Program<'info, Token>, 
}

