import {
    createIcons,
    Skull,
    Settings,
    Download,
    FolderOpen,
    LogIn,
    Swords,
    Heart,
    Zap,
    TriangleAlert,
    Play,
    Users,
    Clock,
    Gamepad2,
    Info,
    MemoryStick,
    Gauge,
    User,
    ShieldCheck,
    LogOut,
    RefreshCw,
    AlertCircle
} from 'lucide';

import {game_options, options} from './main.ts';
import {invoke} from "@tauri-apps/api/core";
import {JavaVersions} from "./enums/java-versions.ts";
import {message} from "@tauri-apps/plugin-dialog";
import {loadUserData} from "./data/load-user-data.ts";

const icons = {
    Skull,
    Settings,
    Download,
    FolderOpen,
    LogIn,
    Swords,
    Heart,
    Zap,
    TriangleAlert,
    Play,
    Users,
    Clock,
    Gamepad2,
    Gauge,
    Info,
    MemoryStick,
    User,
    ShieldCheck,
    LogOut,
    RefreshCw,
    AlertCircle
};

/*
 *Change the dashboard and css when clicked on the sidebar
 *
 * This should be in different html files as templates, but tauri does not compile it with the project so it should be
 * hard coded :(
 */
const playDashboard = `<div class="dashboard" id="dashboard">
    <div class="dashboard-center-wrapper">
      <div class="alert-warning">
        <i data-lucide="triangle-alert"></i>
        <span>
          <strong>¡ADVERTENCIA!</strong>
          <br>
          En PERMADEATHSMP, la muerte es permanente. Una vez que mueras, serás expulsado del servidor para siempre.
        </span>
      </div>
      <div class="dashboard__content">
        <!-- Panel principal: Estado General -->
        <section class="panel panel--main">
          <div class="panel__title">
            <i data-lucide="Skull"></i>
            PERMADEATHSMP
          </div>
          <div class="panel__subtitle">
            ¿Estás preparado para el desafío definitivo de supervivencia?
          </div>
          <div class="panel__stats">
            <div class="panel__stat">
              <span class="panel__stat-number panel__stat--red">35</span>
              <span class="panel__stat-label">Día Actual</span>
            </div>
            <div class="panel__stat">
              <span class="panel__stat-number panel__stat--yellow">12</span>
              <span class="panel__stat-label">Supervivientes</span>
            </div>
            <div class="panel__stat">
              <span class="panel__stat-number panel__stat--purple">8</span>
              <span class="panel__stat-label">Caídos</span>
            </div>
          </div>
          <div class="panel__progress">
            <div class="panel__progress-label">Progreso de Dificultad</div>
            <div class="panel__progress-bar-bg">
              <div class="panel__progress-bar-fg"></div>
            </div>
          </div>
          <div class="panel__info">
            Los tótems ahora tienen 1% de probabilidad de fallar. El End está desbloqueado.
          </div>
          <button class="panel__button">
            <i data-lucide="Play"></i>
            INICIAR PERMADEATHSMP
          </button>
        </section>
        <!-- Paneles laterales -->
        <div class="dashboard__sidepanels">
          <!-- Jugadores Online -->
          <section class="panel panel--side panel--online">
            <div class="panel__side-title">
              <i data-lucide="Users"></i>
              Jugadores Online
            </div>
            <div class="panel__players">
              <div class="panel__player">
                <span>Ponchisao326</span>
                <span class="badge badge--yellow">Host</span>
              </div>
              <div class="panel__player">
                <span>IkerTc_</span>
                <span class="badge badge--green">Vivo</span>
              </div>
              <div class="panel__player">
                <span>Nombre</span>
                <span class="badge badge--green">Vivo</span>
              </div>
              <div class="panel__player">
                <span class="panel__player-out">Nombre</span>
                <span class="badge badge--red">Muerto</span>
              </div>
              <div class="panel__player">
                <span class="panel__player-out">Nombre</span>
                <span class="badge badge--red">Muerto</span>
              </div>
            </div>
          </section>
          <!-- Próximo Cambio -->
          <section class="panel panel--side panel--event">
            <div class="panel__side-title">
              <i data-lucide="Clock"></i>
              Próximo cambio
            </div>
            <div class="panel__event-main">
              <span class="panel__event-days">5</span>
              <span class="panel__event-label">días hasta Día 40</span>
            </div>
            <div class="panel__event-info">
              PVP permanente activado
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>`;
const configDashboard = `<div class="dashboard-config-wrapper" id="dashboard">
        <h1 class="config-title">
            <i data-lucide="Settings"></i>
            Configuración del Launcher
        </h1>
        <form class="config-grid">
            <!-- General -->
            <section class="config-section">
                <div class="config-section__header">
                    <i data-lucide="Settings"></i>
                    General
                </div>
                <div class="config-row">
                    <label class="config-label">
                        Inicio automático
                        <div class="config-inputs">
                            <span class="config-desc">Lanzar el juego automáticamente al abrir</span>
                            <input type="checkbox" class="switch-input" id="auto_init"/>
                            <span class="switch"></span>
                        </div>
                    </label>
                </div>
                <div class="config-row">
                    <label class="config-label">
                        Mostrar la consola de depuración
                        <div class="config-inputs">
                            <span class="config-desc">Cuando se abra el juego, mostrar la consola</span>
                            <input type="checkbox" class="switch-input" id="debug_console" />
                            <span class="switch"></span>
                        </div>
                    </label>
                </div>
            </section>
            <!-- Juego -->
            <section class="config-section">
                <div class="config-section__header config-section__header--yellow">
                    <i data-lucide="gamepad-2"></i>
                    Juego
                </div>
                <div class="config-row">
                    <label class="config-label">
                        Directorio del juego
                        <div class="config-inputs">
                            <div class="input-group">
                                <input type="text" class="input-text" value="" id="game_dir" readonly />
                                <button class="btn btn--light" type="button" id="change_game_dir">Cambiar</button>
                            </div>
                        </div>
                    </label>
                </div>
                <div class="config-row">
                    <label class="config-label">
                        Copia de seguridad automática
                        <div class="config-inputs">
                            <span class="config-desc">Backup de configuración</span>
                            <input type="checkbox" class="switch-input" id="automatic_backup" />
                            <span class="switch"></span>
                        </div>
                    </label>
                </div>
            </section>
            <div class="config-footer">
                <button class="btn btn--light" type="reset" id="config_reset">Restablecer</button>
                <button class="btn btn--red" type="submit" id="config-save">Guardar Cambios</button>
            </div>
        </form>
    </div>`;
const vmDashboard = `<div class="dashboard-vm-wrapper" id="dashboard">
            <h1 class="vm-title">
                <i data-lucide="Zap"></i>
                Configuración Java VM
            </h1>
            <div class="vm-alert vm-alert--yellow">
                <i data-lucide="Info"></i>
                <span>
                PERMADEATHSMP requiere configuraciones específicas de Java para manejar las mecánicas complejas del mod. Cambios incorrectos pueden afectar el rendimiento.
            </span>
            </div>
            <form class="vm-grid">
                <!-- Memoria -->
                <section class="vm-section">
                    <div class="vm-section__header">
                        <i data-lucide="memory-stick"></i>
                        Memoria
                    </div>
                    <div class="vm-row">
                        <label class="vm-label">
                            Memoria Asignada
                            <input type="text" class="vm-input" value="4096MB" id="max_ram"/>
                        </label>
                    </div>
                    <div class="vm-row">
                        <div class="vm-recommendation">
                            <i data-lucide="Info"></i>
                            <span>
                            <strong>Recomendación</strong><br>
                            Para PERMADEATHSMP se recomienda mínimo 4 GB debido a los mobs modificados y dimensiones transformadas.
                        </span>
                        </div>
                    </div>
                </section>
                <!-- Rendimiento -->
                <section class="vm-section">
                    <div class="vm-section__header vm-section__header--green">
                        <i data-lucide="Gauge"></i>
                        Rendimiento
                    </div>
                    <div class="vm-row">
                        <label class="vm-label">
                            Garbage Collector
                            <select class="vm-select" id="gc_select">
                                
                            </select>
                        </label>
                    </div>
                    <div class="vm-row">
                        <label class="vm-label">
                            Versión de Java
                            <select class="vm-select" id="java_version">
                                
                            </select>
                        </label>
                    </div>
                </section>
                <!-- JVM Args -->
                <section class="vm-section vm-section--full">
                    <div class="vm-section__header">
                        <i data-lucide="Zap"></i>
                        Argumentos JVM
                    </div>
                    <div class="vm-row">
                        <label class="vm-label">
                            Argumentos adicionales
                            <textarea class="vm-textarea"
                                      rows="2"
                                      id="jvm_args"></textarea>
                        </label>
                    </div>
                    <div class="vm-row vm-row--buttons">
                        <button type="reset" class="vm-btn vm-btn--white" id="default_flags_button">Valores por Defecto</button>
                    </div>
                    <div class="vm-row">
                        <div class="vm-critical">
                            <i data-lucide="triangle-alert"></i>
                            <span>
                            <strong>Configuración Crítica</strong><br>
                            Los argumentos JVM incorrectos pueden causar inestabilidad o fallos. Asegúrate de entender cada cambio.
                            Los valores por defecto están optimizados buscando el mayor rendimiento del juego. 
                            Estos valores están optimizados para jugar en multijugador.  
                        </span>
                        </div>
                    </div>
                </section>
                <div class="vm-footer">
                    <button type="submit" class="vm-btn vm-btn--orange" id="apply_vm_changes">Aplicar Cambios</button>
                </div>
            </form>
        </div>`
const updateDashboard = `<div class="dashboard-updates-wrapper" id="dashboard">
        <div class="updates-title-row">
          <h1 class="updates-title">
            <i data-lucide="Download"></i>
            Actualizaciones
          </h1>
          <button class="updates-btn updates-btn--blue" type="button">
            <i data-lucide="refresh-cw"></i>
            Buscar Actualizaciones
          </button>
        </div>

        <div class="updates-mod-card">
          <div>
            <span class="mod-title">PERMADEATHSMP Mod</span>
            <span class="mod-version">Versión actual: v2.1.2</span>
            <span class="mod-check">Última verificación: hace 2 horas</span>
          </div>
          <div class="updates-mod-status">
            <span class="updates-status-icon"
              ><i data-lucide="alert-circle"></i
            ></span>
            <span class="updates-status-label">Actualización Disponible</span>
          </div>
        </div>

        <div class="updates-update-card">
          <div class="update-header-row">
            <span class="update-header">
              <i data-lucide="Download"></i>
              Actualización Disponible
            </span>
            <span class="update-label-new">Nueva</span>
          </div>
          <div class="update-main-row">
            <div>
              <span class="update-version-n">v2.1.3</span>
              <span class="update-version-highlight"> - Mejoras Críticas</span>
              <span class="update-date">15 de Diciembre, 2024 · 45.2 MB</span>
            </div>
            <button class="updates-btn updates-btn--green" type="button">
              <i data-lucide="Download"></i>
              Descargar
            </button>
          </div>
          <div class="update-desc">
            Mejoras en el sistema de Esqueletos de Clase, corrección de bugs en
            Ultra Ravagers
          </div>
          <div class="update-news">
            <span class="update-news-title">Novedades:</span>
            <ul>
              <li>Balanceado Esqueletos de Clase V (Pesadilla)</li>
              <li>Corregido bug crítico de Carlos el Esclavo</li>
              <li>Optimización del sistema Tren de la Muerte</li>
              <li>Mejoras de rendimiento en dimensión End transformada</li>
            </ul>
          </div>
        </div>

        <div class="updates-config-card">
          <span class="updates-config-title"
            >Configuración de Actualizaciones</span
          >
          <div class="updates-config-row">
            <div>
              <span class="updates-config-label"
                >Actualizaciones automáticas</span
              >
              <span class="updates-config-desc"
                >Descargar e instalar actualizaciones automáticamente</span
              >
            </div>
            <button class="updates-btn updates-btn--white" type="button" id="auto_update_btn">
              Deshabilitadas
            </button>
          </div>
          <div class="updates-config-row">
            <div>
              <span class="updates-config-label">Notificaciones</span>
              <span class="updates-config-desc"
                >Mostrar notificaciones de nuevas versiones</span
              >
            </div>
            <button class="updates-btn updates-btn--white" type="button" id="notifications_btn">
              Deshabilitadas
            </button>
          </div>
          <div class="updates-config-warning">
            <span class="updates-config-warning-title">¡Importante!</span>
            <span class="updates-config-warning-desc">
              Siempre actualiza antes de unirte al servidor. Las versiones
              incompatibles harán que no puedas unirte.
            </span>
          </div>
        </div>
      </div>`
const accountDashboard = `<div class="dashboard-account-wrapper" id="dashboard">
        <h1 class="account-title">
          <i data-lucide="log-in"></i>
          Gestión de Cuenta
        </h1>
        <div class="account-grid">
          <!-- Formulario de Inicio de Sesión -->
          <section class="account-section">
            <div class="account-section__header">
              <i data-lucide="User"></i>
              Iniciar Sesión
            </div>
            <div class="account-warning account-warning--red">
              <i data-lucide="triangle-alert"></i>
              Solo se permite una cuenta por jugador en PERMADEATHSMP. La muerte
              es permanente e irreversible.
            </div>
            <form id="login-form" class="account-form">
              <label class="account-label">
                Usuario de Minecraft
                <input
                  type="text"
                  class="account-input"
                  placeholder="TuNombreDeUsuario"
                  id="username"
                  required
                />
              </label>
              <label class="account-label">
                Contraseña
                <input
                  type="password"
                  class="account-input"
                  placeholder="********"
                  id="password"
                  required
                />
              </label>
              <button class="account-btn account-btn--blue" type="submit">
                <i data-lucide="log-in"></i>
                Iniciar Sesión
              </button>
              <a id="create_account" class="account-link">Crear Cuenta</a>
            </form>
          </section>
          <!-- Estado de la Cuenta -->
          <section class="account-section">
            <div class="account-section__header account-section__header--green">
              <i data-lucide="shield-check"></i>
              Estado de la Cuenta
            </div>
            <div class="account-status">
              <div class="account-avatar">
                <i data-lucide="User"></i>
              </div>
              <div class="account-status-info">
                <span class="account-status-title">No conectado</span>
                <span class="account-status-desc"
                  >Inicia sesión para acceder al servidor</span
                >
              </div>
              <span class="account-status-state">Desconectado</span>
            </div>
            <div class="account-status-list">
              <div class="account-status-item">
                <span>Estado del Jugador</span>
                <span id="player_status">--</span>
              </div>
              <div class="account-status-item">
                <span>Días Sobrevividos</span>
                <span id="survived_days">--</span>
              </div>
              <div class="account-status-item">
                <span>Última Conexión</span>
                <span id="last_connection">Nunca</span>
              </div>
              <div class="account-status-item">
                <span>Rol en el Servidor</span>
                <span id="server_role">--</span>
              </div>
            </div>
            <div class="account-info account-info--yellow">
              <div>
                <span class="account-info-title">Información Importante</span>
                <span class="account-info-desc">
                  Una vez que inicies sesión y entras al servidor, no podrás
                  crear otra cuenta. La muerte resulta en un baneo permanente.
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <!-- Modal para Crear Cuenta -->
      <div id="create-account-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Crear Cuenta de PERMADEATHSMP</h2>
            <button id="close-modal-btn" class="modal-close-btn">&times;</button>
          </div>
                  <form id="create-account-form" class="modal-body">
            <p class="modal-warning">
              Recuerda: solo se permite una cuenta. La muerte es final y el baneo, permanente.
            </p>
            <label class="account-label">
              Usuario de Minecraft
              <input type="text" id="new-username" class="account-input" placeholder="TuNombreDeUsuario" required />
            </label>
            <label class="account-label">
              Contraseña
              <input type="password" id="new-password" class="account-input" placeholder="********" required />
            </label>
            <label class="account-label">
              Confirmar Contraseña
              <input type="password" id="confirm-password" class="account-input" placeholder="********" required />
            </label>
            <label class="account-label">
              Código de Invitación
              <input type="text" id="invite-code" class="account-input" placeholder="PDSMP-XXXX-XXXX" required />
            </label>
            <div class="modal-footer">
              <button type="button" id="cancel-create-account" class="account-btn account-btn--secondary">Cancelar</button>
              <button type="submit" class="account-btn account-btn--blue">Crear Cuenta</button>
            </div>
          </form>
        </div>
      </div>
      `;

// --- Main Initialization Function ---
function initializeUI(): void {
    // Add listeners to the sidebar buttons
    document.getElementById("play")?.addEventListener("click", () => showDashboard(playDashboard, "play", "/src/css/dashboard.css"));
    document.getElementById("config")?.addEventListener("click", () => showDashboard(configDashboard, "config", "/src/css/dashboard-config.css", setupConfigListeners));
    document.getElementById("vm")?.addEventListener("click", () => showDashboard(vmDashboard, "vm", "/src/css/dashboard-vm.css", setupVmListeners));
    document.getElementById("updates")?.addEventListener("click", () => showDashboard(updateDashboard, "updates", "/src/css/dashboard-update.css", setupUpdatesListeners));
    document.getElementById("account")?.addEventListener("click", () => showDashboard(accountDashboard, "account", "/src/css/dashboard-signin.css", setupAccountListeners));

    // --- EVENT DELEGATION ---
    // Listen for 'submit' events on the entire document to handle all forms.
    document.addEventListener('submit', handleFormSubmissions);
}

// --- Dashboard Switching Logic ---
async function showDashboard(innerHTML: string, activeId: string, cssPath: string, setupListeners?: () => void | Promise<void>): Promise<void> {
    const app = document.getElementById("app");
    const dashboard = document.getElementById("dashboard");
    const dashboardCss = document.querySelector('link[href*="dashboard"]') as HTMLLinkElement;

    if (dashboard) {
        dashboard.remove();
    }
    if (dashboardCss) {
        dashboardCss.href = cssPath;
    }

    if (app) {
        app.insertAdjacentHTML("beforeend", innerHTML);
        toggleActiveButton(activeId);
        createIcons({ icons });

        // If there's a setup function for this view's specific listeners, call it.
        if (setupListeners) {
            await setupListeners();
        }
    }
}

// --- Listener Setup Functions for Each View ---
function setupConfigListeners(): void {
    const game_dir_input = document.getElementById("game_dir") as HTMLInputElement;
    (document.getElementById("auto_init") as HTMLInputElement).checked = options.init_on_start;
    (document.getElementById("debug_console") as HTMLInputElement).checked = options.debug_console;
    (document.getElementById("automatic_backup") as HTMLInputElement).checked = options.automatic_backup;

    if (game_dir_input) {
        console.log('Updating the Game Dir Value: ' + options.game_dir);
        game_dir_input.value = options.game_dir || "%APPDATA%/.Permadeath";
    }
}

async function setupVmListeners(): Promise<void> {
    const max_ram = document.getElementById("max_ram") as HTMLInputElement;
    const gc_select = document.getElementById("gc_select") as HTMLSelectElement;
    const java_version = document.getElementById("java_version") as HTMLSelectElement;
    const vm_args = document.getElementById("jvm_args") as HTMLInputElement;

    if (max_ram) {
        max_ram.value = game_options.max_ram ? `${game_options.max_ram}MB` : '4096MB';
    }

    if (gc_select) {
        const gc_options = await invoke<string[]>('get_garbage_collectors');
        gc_options.forEach((gc) => {
            const option = document.createElement("option");
            option.value = gc;
            option.text = gc;
            gc_select.appendChild(option);
        });
        if (game_options.garbage_collector) {
            gc_select.value = game_options.garbage_collector;
        }
    }

    if (java_version) {
        Object.values(JavaVersions).forEach((version) => {
            const option = document.createElement("option");
            option.value = version;
            option.text = version;
            if (game_options.custom_java_path?.includes(version.split(' ')[1])) {
                option.selected = true;
            }
            java_version.appendChild(option);
        });
    }

    if (vm_args) {
        vm_args.value = game_options.vm_flags?.join(' ') || '';
    }
}

function setupUpdatesListeners(): void {
    const auto_update_btn = document.getElementById("auto_update_btn");
    const notifications_btn = document.getElementById("notifications_btn");

    if (auto_update_btn) {
        if (options.auto_update) {
            auto_update_btn.classList.add("updates-btn--green");
            auto_update_btn.classList.remove("updates-btn--white");
            auto_update_btn.textContent = "Enabled";
        }
    }

    if (notifications_btn) {
        if (options.notification_enabled) {
            notifications_btn.classList.add("updates-btn--green");
            notifications_btn.classList.remove("updates-btn--white");
            notifications_btn.textContent = "Enabled";
        }
    }
}

function setupAccountListeners(): void {
    // This function now only handles the modal's logic (open/close).
    const createAccountLink = document.getElementById("create_account");
    const modal = document.getElementById("create-account-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const cancelBtn = document.getElementById("cancel-create-account");

    const showModal = () => modal && (modal.style.display = 'flex');
    const hideModal = () => modal && (modal.style.display = 'none');

    createAccountLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal();
    });

    closeModalBtn?.addEventListener('click', hideModal);
    cancelBtn?.addEventListener('click', hideModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });
}

// --- Central Form Handler (using event delegation) ---
async function handleFormSubmissions(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    // Identify the registration form by its ID
    if (form.id === 'create-account-form') {
        console.log("Handling create account form submission...");
        const username = (form.querySelector('#new-username') as HTMLInputElement).value;
        const password = (form.querySelector('#new-password') as HTMLInputElement).value;
        const confirm_password = (form.querySelector('#confirm-password') as HTMLInputElement).value;
        const inviteCode = (form.querySelector('#invite-code') as HTMLInputElement).value;
        const modal = document.getElementById("create-account-modal");

        if (password !== confirm_password) {
            await message('Passwords do not match', { title: 'Password Error', kind: 'error' });
            return;
        }

        try {
            const successMessage = await invoke<string>('register_user', { username, password, inviteCode });
            console.log('Registration successful:', successMessage);
            await message(successMessage, { title: 'Account Created', kind: 'info' });
            if (modal) modal.style.display = 'none'; // Close the modal

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error('Registration failed:', errorMessage);
            await message(errorMessage, { title: 'Registration Error', kind: 'error' });
        }
    } else if (form.id === 'login-form') {
        console.log("Handling login form submission...");
        const username = (form.querySelector('#username') as HTMLInputElement).value;
        const password = (form.querySelector('#password') as HTMLInputElement).value;

        try {
            const successMessage = await invoke<boolean>('login_user', { username, password });
            console.log('Login successful:', successMessage);

            if (successMessage) {
                await message('Login Successful', {title: 'LogIn Successful', kind: 'info'});

                // Change Account Status to Display User Info
                const userData = await loadUserData(username)
                const userStatus = document.getElementById("player_status");
                const survivedDays = document.getElementById("survived_days");
                const lastConnection = document.getElementById("last_connection");
                const serverRole = document.getElementById("server_role");
                const statusTitle = document.querySelector(".account-status-title") as HTMLElement;
                const statusDesc = document.querySelector(".account-status-desc") as HTMLElement;
                const statusState = document.querySelector(".account-status-state") as HTMLElement;

                if (userData && userStatus && survivedDays && lastConnection && serverRole && statusTitle && statusDesc && statusState) {
                    userStatus.textContent = userData.status ? "Vivo" : "Muerto";
                    survivedDays.textContent = userData.survived_days.toString();
                    lastConnection.textContent = userData.last_login;
                    serverRole.textContent = userData.server_role;

                    statusTitle.textContent = `Conectado como ${username}`;
                    statusDesc.textContent = "¡Bienvenido de nuevo al desafío!";
                    statusState.textContent = "Conectado";
                }
                return;
            }
            await message('Login Failed', {title: 'LogIn Failed', kind: 'error'});
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error('Registration failed:', errorMessage);
            await message(errorMessage, { title: 'Registration Error', kind: 'error' });
        }
    }
}

// --- Sidebar Utility Function ---
function toggleActiveButton(clickedButtonId: string): void {
    const buttons = document.querySelectorAll('.sidebar__btn');
    buttons.forEach(button => {
        if (button.id === clickedButtonId) {
            button.classList.add('sidebar__btn--primary');
        } else {
            button.classList.remove('sidebar__btn--primary');
        }
    });
}

// --- START EVERYTHING ---
// Ensures the DOM is fully loaded before adding listeners.
document.addEventListener('DOMContentLoaded', initializeUI);