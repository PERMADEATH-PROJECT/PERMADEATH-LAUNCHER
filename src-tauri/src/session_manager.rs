// src-tauri/src/session_manager.rs
use keyring::Entry;
use log::info;
use sqlx::MySqlPool;
use chrono::{Utc, Duration};
use uuid::Uuid;

const SERVICE_NAME: &str = "permadeath_launcher";
const TOKEN_USERNAME: &str = "session_token";

pub struct SessionManager {
    pool: MySqlPool,
}

impl SessionManager {
    pub fn new(pool: MySqlPool) -> Self {
        Self { pool }
    }

    /// Generate and store a new session token
    pub async fn create_session(&self, user_id: i32) -> Result<String, String> {
        let token = Uuid::new_v4().to_string();
        let expires_at = Utc::now() + Duration::days(30);

        // Database save
        sqlx::query!(
            "INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)",
            user_id,
            token,
            expires_at
        )
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Error guardando sesión en DB: {}", e))?;

        // Save token in system keyring
        self.save_token_to_keyring(&token)?;

        info!("Sesión creada para usuario ID: {}", user_id);
        Ok(token)
    }

    /// Validate a session token
    pub async fn validate_token(&self, token: &str) -> Result<Option<i32>, String> {
        let result = sqlx::query!(
            "SELECT user_id, expires_at FROM sessions WHERE session_token = ? AND expires_at > NOW()",
            token
        )
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| format!("Error validando token: {}", e))?;

        match result {
            Some(row) => {
                info!("Token válido para usuario ID: {}", row.user_id);
                Ok(Some(row.user_id))
            }
            None => {
                info!("Token inválido o expirado");
                Ok(None)
            }
        }
    }

    /// Save the token in the system keyring
    fn save_token_to_keyring(&self, token: &str) -> Result<(), String> {
        let entry = Entry::new(SERVICE_NAME, TOKEN_USERNAME)
            .map_err(|e| format!("Error creando entrada en keyring: {}", e))?;
        entry.set_password(token)
            .map_err(|e| format!("Error guardando token en keyring: {}", e))?;
        info!("Token guardado en el keyring del sistema");
        Ok(())
    }

    /// Retrieves the token from the keyring
    pub fn get_token_from_keyring() -> Result<Option<String>, String> {
        let entry = Entry::new(SERVICE_NAME, TOKEN_USERNAME)
            .map_err(|e| format!("Error accediendo al keyring: {}", e))?;
        match entry.get_password() {
            Ok(token) => {
                info!("Token recuperado del keyring");
                Ok(Some(token))
            }
            Err(_) => {
                info!("No se encontró token en el keyring");
                Ok(None)
            }
        }
    }

    /// Delete the session (logout)
    pub async fn delete_session(&self, token: &str) -> Result<(), String> {
        sqlx::query!("DELETE FROM sessions WHERE session_token = ?", token)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Error eliminando sesión de DB: {}", e))?;

        let entry = Entry::new(SERVICE_NAME, TOKEN_USERNAME)
            .map_err(|e| format!("Error accediendo al keyring: {}", e))?;
        let _ = entry.delete_credential(); // Ignore error if not found

        info!("Sesión eliminada");
        Ok(())
    }
}
