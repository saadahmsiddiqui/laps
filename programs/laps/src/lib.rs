use anchor_lang::prelude::*;

declare_id!("BDThdpgR8TRV1iUBBVUu7qHCmsgHvqydxqUN6BXQhghx");


#[program]
pub mod laps {
    use anchor_lang::solana_program::{system_instruction, program::invoke_signed};

    use super::*;

    #[error_code]
    pub enum LapsErrors {
        #[msg("Some funds are already locked")]
        AlreadyLocked,
        #[msg("Cannot withdraw before unlock time")]
        EarlyUnlock
    }
    
    pub fn unlock(ctx: Context<Unlock>) -> Result<()> {
        let state_account = &mut ctx.accounts.state_account;
        let signer = &ctx.accounts.signer;


        let now = Clock::get()?;
        if state_account.unlock_timestamp < now.unix_timestamp as u64 {
            return err!(LapsErrors::EarlyUnlock);
        }

        state_account.amount = 0;
        state_account.unlock_timestamp = 0;

        let transfer_ix = system_instruction::transfer(
            &state_account.key().clone(),
            &signer.key.clone(),
            state_account.amount
        );

        let result = invoke_signed(&transfer_ix, &[
            state_account.to_account_info(),
            signer.to_account_info(),
            ctx.accounts.system_program.to_account_info()
        ], &[])?;

        Ok(result)
    }

    pub fn lock(ctx: Context<Lock>, delay: u64, amount: u64) -> Result<()> {
        let locker = &ctx.accounts.signer;
        let clock = Clock::get()?;
        let state = &mut ctx.accounts.state_account;

        if state.amount != 0 {
            return err!(LapsErrors::AlreadyLocked);
        }

        state.amount = amount;
        state.unlock_timestamp = (clock.unix_timestamp as u64) + delay;

        let transfer_ix = system_instruction::transfer(&locker.key(), &state.key(), amount);

        let result = invoke_signed(&transfer_ix, &[
            locker.to_account_info(),
            ctx.accounts.state_account.to_account_info(),
            ctx.accounts.system_program.to_account_info()
        ], &[])?;

        Ok(result)
    }
}


#[account]
struct LockingData {
    pub unlock_timestamp: u64,
    pub amount: u64
}


#[derive(Accounts)]
pub struct Lock<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer = signer, space = 8 + 8 + 8, seeds = [b"laps", signer.key.as_ref()], bump)]
    pub state_account: Account<'info, LockingData>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unlock<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer = signer, space = 8 + 8 + 8, seeds = [b"laps", signer.key.as_ref()], bump)]
    pub state_account: Account<'info, LockingData>,
    pub system_program: Program<'info, System>,
}