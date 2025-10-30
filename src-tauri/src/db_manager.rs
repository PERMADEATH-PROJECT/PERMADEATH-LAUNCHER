use sqlx::{Error, MySqlPool};
use chrono::{DateTime, Utc};
use log::{info, error};

/// Represents a row of the 'users' table
/// `sqlx::FromRow` allow automatic mapping
#[derive(Debug, sqlx::FromRow)]
pub struct User {
    pub id: i32,
    pub minecraft_username: String,
    pub password_hash: String,
}

/// Main SQL Manager
pub struct DbManager {
    pool: MySqlPool,
}

impl DbManager {
    /// Create a new instance and connect to the database.
    pub async fn new(database_url: &str) -> Result<Self, Error> {
        let pool = MySqlPool::connect(database_url).await?;
        info!("Pool de conexiones a la base de datos creado correctamente.");
        Ok(Self { pool })
    }

    // --- SELECT METHODS ---

    /// Search a user by their minecraft username.
    pub async fn get_user_by_username(&self, username: &str) -> Result<Option<User>, Error> {
        info!("Buscando usuario por nombre: '{}'", username);
        sqlx::query_as::<_, User>("SELECT id, minecraft_username, password_hash FROM users WHERE minecraft_username = ?")
            .bind(username)
            .fetch_optional(&self.pool)
            .await
    }

    // --- INSERT METHODS ---

    /// Create a new user using an invitation code
    /// Execute a secure transaction
    pub async fn create_user_with_invite(
        &self,
        username: &str,
        password_hash: &str,
        invite_code: &str,
    ) -> Result<u64, Error> {
        info!("Iniciando transacción para registrar al usuario: '{}'", username);
        let mut tx = self.pool.begin().await?;

        // Verify that the code is not used
        let invite_row: Option<(i32, bool)> = sqlx::query_as("SELECT id, claimed FROM invites WHERE code = ?")
            .bind(invite_code)
            .fetch_optional(&mut *tx)
            .await?;

        if invite_row.is_none() || invite_row.unwrap().1 {
            error!("Intento de registro fallido: el código de invitación '{}' no es válido o ya fue usado.", invite_code);
            // Al devolver un error aquí, la transacción se revierte automáticamente (rollback).
            return Err(Error::RowNotFound);
        }

        // Insert the new user and obtain its id
        let new_user_id = sqlx::query("INSERT INTO users (minecraft_username, password_hash) VALUES (?, ?)")
            .bind(username)
            .bind(password_hash)
            .execute(&mut *tx)
            .await?
            .last_insert_id();

        // Update the invitation to link it to the user
        sqlx::query("UPDATE invites SET claimed = TRUE, user_id = ? WHERE code = ?")
            .bind(new_user_id)
            .bind(invite_code)
            .execute(&mut *tx)
            .await?;

        // Create an entry in the `account_status` table
        sqlx::query("INSERT INTO account_status (user_id, last_connection) VALUES (?, ?)")
            .bind(new_user_id)
            .bind(Utc::now())
            .execute(&mut *tx)
            .await?;

        // Confirm the transaction
        tx.commit().await?;

        info!("Transacción completada. Usuario '{}' creado con el ID: {}", username, new_user_id);
        Ok(new_user_id)
    }

    // --- UPDATE METHODS ---

    /// Update last connection date for a user by their ID.
    pub async fn update_user_last_connection(&self, user_id: i32) -> Result<u64, Error> {
        info!("Actualizando la última conexión para el usuario con ID: {}", user_id);

        let result = sqlx::query!(
            "UPDATE account_status SET last_connection = ? WHERE user_id = ?",
            Utc::now(),
            user_id
        )
            .execute(&self.pool)
            .await?;

        info!("Se afectaron {} filas al actualizar la conexión del usuario {}.", result.rows_affected(), user_id);
        Ok(result.rows_affected())
    }
}