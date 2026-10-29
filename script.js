
const overlay = document.getElementById("confirm-overlay");
const openConfirm = document.getElementById("open-confirm");
const dismissConfirm = document.getElementById("dismiss-confirm");
const cancelClose = document.getElementById("cancel-close");
const confirmClose = document.getElementById("confirm-close");

const windowViewButtons = document.querySelectorAll("[data-window-view]");
const windowViews = document.querySelectorAll(".window-view");

const mainWindowTitle = document.querySelector(
    ".window > .title-bar .window-title span:last-child"
);

const mainWindow = document.querySelector(".window");
const desktop = document.querySelector(".desktop");

const windowTitles = {
    course: "\u00b7 Mostra de Curso - Informática",
    projects: "\u00b7 Projetos",
    events: "\u00b7 Projetos e Eventos",
    visits: "\u00b7 Visitas Técnicas"
};

/* ========================================
   TROCA DE VISUALIZAÇÕES
======================================== */

function showWindowView(viewName) {
    const isVisitsView = viewName === "visits";

    windowViews.forEach((view) => {
        const isActive = view.dataset.view === viewName;

        view.hidden = !isActive;
        view.classList.toggle("is-active", isActive);

        // Reinicia a rolagem vertical ao abrir a seção.
        if (isActive && isVisitsView) {
            view.scrollTop = 0;
        }
    });

    windowViewButtons.forEach((button) => {
        const isActive = button.dataset.windowView === viewName;
        const icon = button.querySelector(".desktop-icon-image");

        button.setAttribute("aria-pressed", String(isActive));

        if (icon) {
            icon.src = isActive
                ? "assets/folder - aberto.png"
                : "assets/folder - fechado.png";
        }
    });

    if (mainWindowTitle && windowTitles[viewName]) {
        mainWindowTitle.textContent = windowTitles[viewName];
    }

    if (mainWindow) {
        mainWindow.classList.toggle("is-visits-view", isVisitsView);
    }

    if (desktop) {
        desktop.classList.toggle("visits-open", isVisitsView);
    }
}

windowViewButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showWindowView(button.dataset.windowView);
    });
});

/* ========================================
   JANELA DE CONFIRMAÇÃO
======================================== */

function showConfirm() {
    if (!overlay) return;

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
}

function hideConfirm() {
    if (!overlay) return;

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");

    if (confirmClose) {
        confirmClose.style.transform = "";
    }
}

if (openConfirm) {
    openConfirm.addEventListener("click", showConfirm);
}

if (dismissConfirm) {
    dismissConfirm.addEventListener("click", hideConfirm);
}

if (cancelClose) {
    cancelClose.addEventListener("click", hideConfirm);
}

/* ========================================
   BOTÃO CONFIRMAR QUE FOGE DO MOUSE
======================================== */

function fleeButton(event) {
    if (!confirmClose) return;

    const button = confirmClose;
    const box = button.getBoundingClientRect();

    const near =
        event.type === "pointerenter" ||
        (
            Math.abs(event.clientX - (box.left + box.width / 2)) < 90 &&
            Math.abs(event.clientY - (box.top + box.height / 2)) < 55
        );

    if (!near) return;

    const maxX = Math.max(120, window.innerWidth * 0.38);
    const maxY = Math.max(90, window.innerHeight * 0.25);

    const x = (Math.random() * 2 - 1) * maxX;
    const y = (Math.random() * 2 - 1) * maxY;

    button.style.transform = `translate(${x}px, ${y}px)`;
}

if (confirmClose) {
    confirmClose.addEventListener("pointerenter", fleeButton);
    confirmClose.addEventListener("pointermove", fleeButton);

    confirmClose.addEventListener("click", (event) => {
        event.preventDefault();
        fleeButton({ type: "pointerenter" });
    });
}

/* ========================================
   FECHAR CONFIRMAÇÃO COM ESC
======================================== */

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        overlay &&
        overlay.classList.contains("is-open")
    ) {
        hideConfirm();
    }
});
