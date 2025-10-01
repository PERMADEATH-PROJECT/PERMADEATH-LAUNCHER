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
    Gauge
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
    MemoryStick
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