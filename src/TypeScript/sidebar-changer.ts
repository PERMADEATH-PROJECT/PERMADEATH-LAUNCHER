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
    LogOut
} from 'lucide';

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
    LogOut
};

// Change the dashboard and css when clicked on the sidebar
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
                            <input type="checkbox" class="switch-input" />
                            <span class="switch"></span>
                        </div>
                    </label>
                </div>
                <div class="config-row">
                    <label class="config-label">
                        Mostrar advertencias de muerte
                        <div class="config-inputs">
                            <span class="config-desc">Recordatorios sobre permadeath</span>
                            <input type="checkbox" class="switch-input" />
                            <span class="switch"></span>
                        </div>
                    </label>
                </div>
                <div class="config-row">
                    <label class="config-label">
                        Modo compacto
                        <div class="config-inputs">
                            <span class="config-desc">Interfaz más pequeña</span>
                            <input type="checkbox" class="switch-input" />
                            <span class="switch"></span>
                        </div>
                    </label>
                </div>
                <div class="config-row">
                    <label class="config-label" style="margin-bottom:0;">
                        Idioma
                        <div class="config-inputs">
                            <select class="select-input">
                                <option>Español</option>
                                <option>Inglés</option>
                            </select>
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
                        Directorio de screenshots
                        <div class="config-inputs">
                            <div class="input-group">
                                <input type="text" class="input-text" value="~/Pictures/PERMADEATHSMP" readonly />
                                <button class="btn btn--light" type="button">Cambiar</button>
                            </div>
                        </div>
                    </label>
                </div>
                <div class="config-row">
                    <label class="config-label">
                        Mantener logs detallados
                        <div class="config-inputs">
                            <span class="config-desc">Para debugging</span>
                            <input type="checkbox" class="switch-input" />
                            <span class="switch"></span>
                        </div>
                    </label>
                </div>
                <div class="config-row">
                    <label class="config-label">
                        Copia de seguridad automática
                        <div class="config-inputs">
                            <span class="config-desc">Backup de configuración</span>
                            <input type="checkbox" class="switch-input" />
                            <span class="switch"></span>
                        </div>
                    </label>
                </div>
            </section>
            <div class="config-footer">
                <button class="btn btn--light" type="reset">Restablecer</button>
                <button class="btn btn--red" type="submit">Guardar Cambios</button>
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
                            <input type="text" class="vm-input" value="6G" />
                        </label>
                    </div>
                    <div class="vm-row">
                        <div class="vm-recommendation">
                            <i data-lucide="Info"></i>
                            <span>
                            <strong>Recomendación</strong><br>
                            Para PERMADEATHSMP se recomienda mínimo 6GB debido a los mobs modificados y dimensiones transformadas.
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
                            <select class="vm-select">
                                <option>G1GC (Recomendado)</option>
                                <option>CMS</option>
                                <option>Parallel</option>
                            </select>
                        </label>
                    </div>
                    <div class="vm-row">
                        <label class="vm-label">
                            Versión de Java
                            <select class="vm-select">
                                <option>Java 17 (Recomendado)</option>
                                <option>Java 8</option>
                                <option>Java 11</option>
                            </select>
                        </label>
                    </div>
                </section>
                <!-- JVM Args -->
                <section class="vm-section vm-section--full">
                    <div class="vm-section__header">
                        <i data-lucide="Zap"></i>
                        Argumentos JVM Personalizados
                    </div>
                    <div class="vm-row">
                        <label class="vm-label">
                            Argumentos adicionales
                            <textarea class="vm-textarea"
                                      rows="2">-XX:+UseG1GC -XX:+UnlockExperimentalVMOptions -XX:MaxGCPauseMillis=200 -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5</textarea>
                        </label>
                    </div>
                    <div class="vm-row vm-row--buttons">
                        <button type="button" class="vm-btn vm-btn--white">Valores por Defecto</button>
                        <button type="button" class="vm-btn vm-btn--yellow">Optimizado PERMADEATHSMP</button>
                        <button type="button" class="vm-btn vm-btn--blue">Máximo Rendimiento</button>
                    </div>
                    <div class="vm-row">
                        <div class="vm-critical">
                            <i data-lucide="triangle-alert"></i>
                            <span>
                            <strong>Configuración Crítica</strong><br>
                            Los argumentos optimizados son esenciales para manejar las mecánicas intensivas como el sistema de mods por niveles, las dimensiones transformadas y los eventos del Tren de la Muerte sin lag.
                        </span>
                        </div>
                    </div>
                </section>
                <div class="vm-footer">
                    <button type="button" class="vm-btn vm-btn--white">Probar Configuración</button>
                    <button type="submit" class="vm-btn vm-btn--orange">Aplicar Cambios</button>
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
            <i data-lucide="RefreshCw"></i>
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
              ><i data-lucide="AlertCircle"></i
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
            <button class="updates-btn updates-btn--white" type="button">
              Habilitado
            </button>
          </div>
          <div class="updates-config-row">
            <div>
              <span class="updates-config-label">Notificaciones</span>
              <span class="updates-config-desc"
                >Mostrar notificaciones de nuevas versiones</span
              >
            </div>
            <button class="updates-btn updates-btn--white" type="button">
              Habilitado
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
            <form class="account-form">
              <label class="account-label">
                Usuario de Minecraft
                <input
                  type="text"
                  class="account-input"
                  placeholder="TuNombreDeUsuario"
                />
              </label>
              <label class="account-label">
                Contraseña
                <input
                  type="password"
                  class="account-input"
                  placeholder="********"
                />
              </label>
              <label class="account-label">
                Código de Invitación
                <input
                  type="text"
                  class="account-input"
                  placeholder="PDSMP-XXXX-XXXX"
                />
                <span class="account-hint"
                  >Código proporcionado por <b>Ponchisao326</b> para acceso al
                  servidor</span
                >
              </label>
              <button class="account-btn account-btn--blue" type="submit">
                <i data-lucide="log-in"></i>
                Iniciar Sesión
              </button>
              <a href="#" class="account-link">¿Olvidaste tu contraseña?</a>
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
                <span>--</span>
              </div>
              <div class="account-status-item">
                <span>Días Sobrevividos</span>
                <span>--</span>
              </div>
              <div class="account-status-item">
                <span>Última Conexión</span>
                <span>Nunca</span>
              </div>
              <div class="account-status-item">
                <span>Rol en el Servidor</span>
                <span>--</span>
              </div>
            </div>
            <div class="account-info account-info--yellow">
              <div>
                <span class="account-info-title">Información Importante</span>
                <span class="account-info-desc">
                  Una vez que inicies sesión y entres al servidor, no podrás
                  crear otra cuenta. La muerte resulta en un baneo permanente.
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>`;

document.getElementById("play")?.addEventListener("click", () => {
    const app = document.getElementById("app");
    const dashboard = document.getElementById("dashboard");
    const dashboardCss = document.querySelector('link[href*="dashboard"]') as HTMLLinkElement;

    if (dashboard) {
        dashboard.remove();
    }

    if (dashboardCss) {
        dashboardCss.href = "/src/css/dashboard.css";
    }

    if (app) {
        app.insertAdjacentHTML("beforeend", playDashboard);
        toggleActiveButton("play");
        // Re-initialize icons
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
        createIcons({ icons: icons });
    }
});

document.getElementById("config")?.addEventListener("click", () => {
    const app = document.getElementById("app");
    const dashboard = document.getElementById("dashboard");
    const dashboardCss = document.querySelector('link[href*="dashboard"]') as HTMLLinkElement;

    if (dashboard) {
        dashboard.remove();
    }

    if (dashboardCss) {
        dashboardCss.href = "/src/css/dashboard-config.css";
    }

    if (app) {
        app.insertAdjacentHTML("beforeend", configDashboard);
        toggleActiveButton("config");
        // Re-initialize icons
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
        createIcons({ icons: icons });
    }
});

document.getElementById("vm")?.addEventListener("click", () => {
    const app = document.getElementById("app");
    const dashboard = document.getElementById("dashboard");
    const dashboardCss = document.querySelector('link[href*="dashboard"]') as HTMLLinkElement;

    if (dashboard) {
        dashboard.remove();
    }

    if (dashboardCss) {
        dashboardCss.href = "/src/css/dashboard-vm.css";
    }

    if (app) {
        app.insertAdjacentHTML("beforeend", vmDashboard);
        toggleActiveButton("vm");
        // Re-initialize icons
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
        createIcons({ icons: icons });
    }
});

document.getElementById("updates")?.addEventListener("click", () => {
    const app = document.getElementById("app");
    const dashboard = document.getElementById("dashboard");
    const dashboardCss = document.querySelector('link[href*="dashboard"]') as HTMLLinkElement;

    if (dashboard) {
        dashboard.remove();
    }

    if (dashboardCss) {
        dashboardCss.href = "/src/css/dashboard-update.css";
    }

    if (app) {
        app.insertAdjacentHTML("beforeend", updateDashboard);
        toggleActiveButton("updates");
        // Re-initialize icons
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
        createIcons({ icons: icons });
    }
});

document.getElementById("account")?.addEventListener("click", () => {
    const app = document.getElementById("app");
    const dashboard = document.getElementById("dashboard");
    const dashboardCss = document.querySelector('link[href*="dashboard"]') as HTMLLinkElement;

    if (dashboard) {
        dashboard.remove();
    }

    if (dashboardCss) {
        dashboardCss.href = "/src/css/dashboard-signin.css";
    }

    if (app) {
        app.insertAdjacentHTML("beforeend", accountDashboard);
        toggleActiveButton("account");
        // Re-initialize icons
        // @ts-ignore
        if (window.lucide) {
            // @ts-ignore
            window.lucide.createIcons();
        }
        createIcons({ icons: icons });
    }
});

// Remove the "sidebar__btn--primary" class from all sidebar buttons except the clicked one
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