(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const menuButton = document.querySelector(".menu-button");
  const mainNav = document.querySelector(".main-nav");
  if (menuButton && mainNav) {
    const menuIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>';
    const closeIcon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg>';
    const setMenu = (open) => {
      mainNav.classList.toggle("open", open);
      menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menuButton.innerHTML = open ? closeIcon : menuIcon;
    };

    menuButton.addEventListener("click", () =>
      setMenu(!mainNav.classList.contains("open")),
    );
    mainNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
  }

  const flowSteps = [...document.querySelectorAll(".flow-step")];
  if (flowSteps.length > 0 && !reducedMotion) {
    let activeFlowStep = 0;
    window.setInterval(() => {
      flowSteps[activeFlowStep].classList.remove("active");
      flowSteps[activeFlowStep].removeAttribute("aria-current");
      flowSteps[activeFlowStep].lastElementChild.textContent =
        flowSteps[activeFlowStep].dataset.status || "";
      activeFlowStep = (activeFlowStep + 1) % flowSteps.length;
      flowSteps[activeFlowStep].classList.add("active");
      flowSteps[activeFlowStep].setAttribute("aria-current", "step");
      flowSteps[activeFlowStep].lastElementChild.textContent = "processando";
    }, 4500);

    flowSteps.forEach((step) => {
      step.dataset.status = step.lastElementChild.textContent;
    });
  }

  const tabs = [...document.querySelectorAll(".product-screen-tabs [role=tab]")];
  const screenImages = [
    ...document.querySelectorAll(".product-screen-stage img"),
  ];
  if (tabs.length && screenImages.length) {
    const imageAlts = screenImages.map((image) => image.alt);
    const panel = document.querySelector("#product-screen-panel");
    const gallery = panel?.closest(".product-gallery");
    const screenTitle = panel?.querySelector(".product-screen-bar small");
    const screenLabel = document.querySelector(".product-screen-label");
    const screenDescription = document.querySelector(
      ".product-screen-label + .lead",
    );
    const selectScreen = (index) => {
      const title = tabs[index].textContent.replace(/^\s*\d+\s*/, "").trim();
      tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      screenImages.forEach((image, imageIndex) => {
        const selected = imageIndex === index;
        image.classList.toggle("active", selected);
        image.setAttribute("aria-hidden", String(!selected));
        image.alt = selected ? imageAlts[index] : "";
      });
      if (panel) panel.setAttribute("aria-labelledby", `product-tab-${index}`);
      if (screenTitle) screenTitle.textContent = `${title} · Audire`;
      if (screenLabel) screenLabel.textContent = title;
      if (screenDescription)
        screenDescription.textContent = tabs[index].dataset.description || "";
    };

    const imagesReady = screenImages.map(
      (image) =>
        new Promise((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        }),
    );
    Promise.all(imagesReady).then(() => {
      gallery?.classList.add("ready");
      tabs.forEach((tab) => {
        tab.disabled = false;
      });
      panel?.setAttribute("aria-busy", "false");
    });
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectScreen(index));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
          return;
        event.preventDefault();
        const nextIndex =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
                tabs.length;
        selectScreen(nextIndex);
        tabs[nextIndex].focus();
      });
    });
  }

  const approvedForm = document.querySelector("#audire-form");
  approvedForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(approvedForm);
    const value = (name, fallback = "Não informado") =>
      String(data.get(name) || fallback).trim();
    const message = `Olá, equipe SNG Audire!\n\nTenho interesse em: *${value("interesse", "Suite completa")}*.\nCNPJs: ${value("cnpjs")}\nFornecedores: ${value("fornecedores")}\n\n*Contato*\nNome: ${value("nome")}\nEmpresa: ${value("empresa")}\nCargo: ${value("cargo")}\nE-mail: ${value("email")}\n\n*Desafio*\n${value("desafio")}`;
    window.open(
      `https://wa.me/5511984133148?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    const status = document.querySelector("#form-msg");
    if (status) status.textContent = "Mensagem preparada no WhatsApp.";
  });

  document.querySelectorAll("[data-count]").forEach((counter) => {
    counter.textContent = Number(counter.dataset.count || 0).toLocaleString("pt-BR");
  });

  if (!reducedMotion && "IntersectionObserver" in window) {
    const selector = [
      "main section",
      ".inner-page .eyebrow",
      ".inner-page h1",
      ".page-lead",
      ".detail-section",
      ".contact-image-panel",
      ".contact-form-content",
    ].join(",");
    const elements = [...new Set(document.querySelectorAll(selector))];
    elements.forEach((element, index) => {
      element.classList.add("motion-item");
      element.style.setProperty(
        "--motion-delay",
        `${Math.min(index % 6, 5) * 70}ms`,
      );
    });
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-visible");
            activeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -7% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
  }
})();
