//!
//! Stylus Hello World
//!
//! The following contract implements the Private Key Manager example.
//!
//! The program is ABI-equivalent with Solidity, which means you can call it from both Solidity and Rust.
//! To do this, run `cargo stylus export-abi`.
//!
//! Note: this code is a template-only and has not been audited.
//!

// Allow `cargo stylus export-abi` to generate a main function.
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

/// Import items from the SDK. The prelude contains common traits and macros.
use stylus_sdk::{alloy_primitives::U256, prelude::*};
use core::convert::TryInto;

// Private Key Manager Contract
sol_storage! {
    #[entrypoint]
    pub struct PrivateKeyManager {
        address owner;
        bytes32 private_key;
    }
}

/// Declare that `PrivateKeyManager` is a contract with the following external methods.
#[public]
impl PrivateKeyManager {
    /// Constructor to initialize the contract and generate a private key.
    pub fn new(&mut self) {
        self.owner.set(msg.sender());
        self.private_key.set(self.generate_private_key());
    }

    /// Function to generate a private key using a random seed.
    fn generate_private_key(&self) -> [u8; 32] {
        let seed: [u8; 32] = (msg.sender().as_bytes().to_vec().try_into().unwrap_or([0; 32]));
        let random_value = (block.timestamp() + block.difficulty()).to_le_bytes();
        let mut private_key = [0u8; 32];
        private_key.copy_from_slice(&seed[..]);
        private_key.copy_from_slice(&random_value[..]);
        private_key
    }

    /// Function to get the private key, only accessible by the owner.
    pub fn get_private_key(&self) -> [u8; 32] {
        require!(msg.sender() == self.owner.get(), "Only the owner can access the private key");
        self.private_key.get()
    }

    /// Function to prevent setting the private key after deployment.
    pub fn set_private_key(&mut self, _private_key: [u8; 32]) {
        require!(msg.sender() == self.owner.get(), "Only the owner can set the private key");
        panic!("Private key cannot be set after deployment");
    }
}
