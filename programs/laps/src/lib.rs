use anchor_lang::prelude::*;

declare_id!("ZoYEfG3ByifXtgXKjg3JERvJGJzDzJbx5G3f1QkYp7j");


#[program]
pub mod laps {
    use anchor_lang::solana_program::{system_instruction, program::invoke_signed};

    use super::*;

    #[error_code]
    pub enum LapsErrors {
        #[msg("Some funds are already locked")]
        AlreadyLocked
    }
    

    pub fn lock(ctx: Context<Lock>, delay: u64, amount: u64) -> Result<()> {
        let locker = &ctx.accounts.signer;
        let clock = Clock::get()?;
        let state = &mut ctx.accounts.state_account;

        if state.amount != 0 {
            return err!(LapsErrors::AlreadyLocked);
        }

        state.amount = amount;
        state.owner = locker.key.clone();
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
    pub owner: Pubkey,
    pub unlock_timestamp: u64,
    pub amount: u64
}


#[derive(Accounts)]
pub struct Lock<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer = signer, space = 8 + 64 + 8)]
    pub state_account: Account<'info, LockingData>,
    pub system_program: Program<'info, System>,
}