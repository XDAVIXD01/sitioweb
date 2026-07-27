(function () {
  function successIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function removeCurrent() {
    var current = document.querySelector(".cool-alert-overlay");
    if (current) {
      current.remove();
    }
  }

  function makeDraggable(modal, handle) {
    var startX = 0;
    var startY = 0;
    var currentX = 0;
    var currentY = 0;
    var dragging = false;

    handle.style.cursor = "move";

    handle.addEventListener("pointerdown", function (event) {
      dragging = true;
      startX = event.clientX - currentX;
      startY = event.clientY - currentY;
      handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener("pointermove", function (event) {
      if (!dragging) {
        return;
      }

      currentX = event.clientX - startX;
      currentY = event.clientY - startY;
      modal.style.transform = "translate(" + currentX + "px, " + currentY + "px)";
    });

    handle.addEventListener("pointerup", function () {
      dragging = false;
    });
  }

  window.CoolAlert = {
    show: function (options) {
      var settings = options || {};
      var overlay = document.createElement("div");
      var modal = document.createElement("div");
      var icon = document.createElement("div");
      var title = document.createElement("h2");
      var message = document.createElement("p");

      removeCurrent();

      overlay.className = "cool-alert-overlay";
      modal.className = "cool-alert-modal";
      icon.className = "cool-alert-modal-icon";
      title.className = "cool-alert-modal-title";
      message.className = "cool-alert-modal-message";

      icon.innerHTML = settings.icon === "success" ? successIcon() : "";
      title.textContent = settings.title || "";
      message.textContent = settings.message || "";

      modal.appendChild(icon);
      modal.appendChild(title);

      if (settings.message) {
        modal.appendChild(message);
      }

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      if (settings.allowOutsideClick !== false) {
        overlay.addEventListener("click", function (event) {
          if (event.target === overlay) {
            removeCurrent();
          }
        });
      }

      if (settings.draggable) {
        makeDraggable(modal, modal);
      }

      return {
        close: removeCurrent
      };
    }
  };
})();
