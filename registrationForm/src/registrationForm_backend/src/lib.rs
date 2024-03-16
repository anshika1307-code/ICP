// main.rs

use ic_cdk::export_candid;
use candid::{CandidType, Principal};

use ic_cdk::api::caller;

use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};

use std::cell::RefCell;
use std::{collections::HashMap, io::Write};

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct UserData {
   pub username: String,
   pub email: String,
}
pub type UserDataStorage = HashMap<Principal, UserData>;

thread_local! {
    pub static USERDATA_STORAGE: RefCell<UserDataStorage> = RefCell::new(UserDataStorage::new());
}

#[update]
pub async fn register_user(mut params: UserData) -> std::string::String {
    let user_data = params;
    let sender = caller();
   
    USERDATA_STORAGE.with(|storage| {
        storage.borrow_mut().insert(sender, user_data);
    });

    "User registered successfully".to_string()
}

#[query]
async fn get_user_data() -> UserData {
    let sender = caller();
    let user_data = USERDATA_STORAGE.with(|storage| {
        storage.borrow().get(&sender).cloned()
    });
    user_data.unwrap_or_else(|| UserData {
        username: "Unknown".to_string(),
        email: "Unknown".to_string(),
    })
    
}
