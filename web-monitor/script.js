const content = {
    seabed: {
        title: "Seabed Lamp (Frutiger Aero)",
        text: "Lampu kaca berisi air dan gelembung, sering jadi pajangan aesthetic ala 2000-an. Efek cahaya dan bentuk khas Frutiger Aero yang memberikan nuansa futuristik namun natural.",
        img: "https://placehold.co/400x300?text=Seabed+Lamp",
    },
    xp: {
        title: "Windows XP",
        text: "Sistem operasi legendaris dengan wallpaper padang rumput biru yang ikonik. Interface yang user-friendly dan startup sound yang tak terlupakan membuat XP menjadi favorit sepanjang masa.",
        img: "https://placehold.co/400x300?text=Windows+XP",
    },
    ps2: {
        title: "PlayStation 2",
        text: "Konsol legendaris Sony yang mendominasi era 2000s. Suara booting yang khas dan tampilan memory card screen yang membekas di ingatan banyak anak 2000-an.",
        img: "https://placehold.co/400x300?text=PS2",
    },
    gta: {
        title: "GTA San Andreas",
        text: "Game open-world ikonik dengan karakter CJ yang legendaris. Kode cheat, sepeda BMX, dan kebebasan eksplorasi Los Santos menjadi kenangan tak terlupakan.",
        img: "https://placehold.co/400x300?text=GTA+San+Andreas",
    },
    tarzan: {
        title: "Game Tarzan",
        text: "Platformer klasik dari Disney dengan soundtrack Phil Collins yang epic. Gameplay swinging dan petualangan di hutan yang seru di masa kecil.",
        img: "https://placehold.co/400x300?text=Tarzan+Game",
    },
    nokia: {
        title: "Nokia 3310",
        text: "Ponsel legendaris dengan daya tahan luar biasa dan game Snake yang adiktif. Simbol ketangguhan teknologi era 2000s yang tak tergantikan.",
        img: "https://placehold.co/400x300?text=Nokia+3310",
    },
    msn: {
        title: "MSN Messenger",
        text: "Layanan chatting jadul yang penuh dengan emoticon klasik dan fitur buzz yang mengganggu tapi seru. Era keemasan komunikasi online.",
        img: "https://placehold.co/400x300?text=MSN+Messenger",
    },
    clippy: {
        title: "Clippy (Microsoft Assistant)",
        text: "Asisten Microsoft Office berbentuk klip kertas yang muncul tiba-tiba dengan tips dan komentar lucu. Love it or hate it, Clippy adalah ikon era 2000s.",
        img: "https://placehold.co/400x300?text=Clippy",
    },
}

class Windows7Modal {
    constructor() {
        this.contentGrid = document.getElementById("contentGrid")
        this.modal = document.getElementById("windowsModal")
        this.modalOverlay = document.getElementById("modalOverlay")
        this.titlebar = document.getElementById("windowTitlebar")
        this.isFullscreen = false
        this.isDragging = false
        this.dragOffset = { x: 0, y: 0 }
        this.originalPosition = { x: 0, y: 0 }

        this.init()
    }

    init() {
        this.loadAllContent()
        this.setupModalControls()
        this.setupDragFunctionality()
        this.createFloatingParticles()
        this.setupCardInteractions()
    }

    loadAllContent() {
        Object.values(content).forEach((contentData) => {
            this.addContentCard(contentData)
        })
    }

    addContentCard(contentData) {
        const card = document.createElement("div")
        card.className = "content-card"
        card.innerHTML = `
        <img src="${contentData.img}" alt="${contentData.title}" class="card-image">
        <h3 class="card-title">${contentData.title}</h3>
        <p class="card-text">${contentData.text}</p>
      `

        card.style.opacity = "0"
        card.style.transform = "translateY(50px)"
        this.contentGrid.appendChild(card)

        setTimeout(() => {
            card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
        }, 100)

        return card
    }

    setupModalControls() {
        const closeBtn = document.getElementById("closeBtn")
        const maximizeBtn = document.getElementById("maximizeBtn")
        const minimizeBtn = document.getElementById("minimizeBtn")

        closeBtn.addEventListener("click", () => this.closeModal())
        maximizeBtn.addEventListener("click", () => this.toggleFullscreen())
        minimizeBtn.addEventListener("click", () => this.minimizeModal())

        // Close modal when clicking overlay
        this.modalOverlay.addEventListener("click", (e) => {
            if (e.target === this.modalOverlay) {
                this.closeModal()
            }
        })

        // Escape key to close
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.modalOverlay.classList.contains("show")) {
                this.closeModal()
            }
        })
    }

    setupDragFunctionality() {
        this.titlebar.addEventListener("mousedown", (e) => {
            if (this.isFullscreen) return

            this.isDragging = true
            const rect = this.modal.getBoundingClientRect()
            this.dragOffset.x = e.clientX - rect.left
            this.dragOffset.y = e.clientY - rect.top

            document.addEventListener("mousemove", this.handleDrag)
            document.addEventListener("mouseup", this.handleDragEnd)

            this.modal.style.transition = "none"
            document.body.style.userSelect = "none"
        })
    }

    handleDrag = (e) => {
        if (!this.isDragging) return

        const x = e.clientX - this.dragOffset.x
        const y = e.clientY - this.dragOffset.y

        // Constrain to viewport
        const maxX = window.innerWidth - this.modal.offsetWidth
        const maxY = window.innerHeight - this.modal.offsetHeight

        const constrainedX = Math.max(0, Math.min(x, maxX))
        const constrainedY = Math.max(0, Math.min(y, maxY))

        this.modal.style.left = constrainedX + "px"
        this.modal.style.top = constrainedY + "px"
        this.modal.style.transform = "none"
    }

    handleDragEnd = () => {
        this.isDragging = false
        this.modal.style.transition = ""
        document.body.style.userSelect = ""

        document.removeEventListener("mousemove", this.handleDrag)
        document.removeEventListener("mouseup", this.handleDragEnd)
    }

    openModal(contentData) {
        // Populate modal content
        document.getElementById("modalTitle").textContent = contentData.title
        document.getElementById("modalImage").src = contentData.img
        document.getElementById("modalImage").alt = contentData.title
        document.getElementById("modalContentTitle").textContent = contentData.title
        document.getElementById("modalContentText").textContent = contentData.text

        // Reset modal position and state
        this.modal.classList.remove("fullscreen")
        this.modal.style.left = ""
        this.modal.style.top = ""
        this.modal.style.transform = "translate(-50%, -50%)"
        this.isFullscreen = false

        // Show modal with animation
        this.modalOverlay.classList.add("show")
        this.modal.classList.add("opening")

        setTimeout(() => {
            this.modal.classList.remove("opening")
        }, 300)

        // Update status bar
        document.querySelector(".status-text").textContent = `Viewing: ${contentData.title}`
    }

    closeModal() {
        this.modalOverlay.classList.remove("show")
        document.querySelector(".status-text").textContent = "Ready"
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen

        if (this.isFullscreen) {
            this.originalPosition = {
                left: this.modal.style.left,
                top: this.modal.style.top,
                transform: this.modal.style.transform,
            }
            this.modal.classList.add("fullscreen")
            document.getElementById("maximizeBtn").innerHTML = "<span>❐</span>"
        } else {
            this.modal.classList.remove("fullscreen")
            this.modal.style.left = this.originalPosition.left
            this.modal.style.top = this.originalPosition.top
            this.modal.style.transform = this.originalPosition.transform
            document.getElementById("maximizeBtn").innerHTML = "<span>□</span>"
        }
    }

    minimizeModal() {
        // Simple minimize animation
        this.modal.style.transform = "translate(-50%, -50%) scale(0.1)"
        this.modal.style.opacity = "0"

        setTimeout(() => {
            this.closeModal()
            this.modal.style.transform = "translate(-50%, -50%) scale(1)"
            this.modal.style.opacity = "1"
        }, 200)
    }

    createFloatingParticles() {
        const particlesContainer = document.querySelector(".floating-particles")

        setInterval(() => {
            if (document.querySelectorAll(".particle").length < 15) {
                const particle = document.createElement("div")
                particle.className = "particle"
                particle.style.left = Math.random() * 100 + "%"
                particle.style.animationDuration = Math.random() * 3 + 5 + "s"
                particle.style.animationDelay = Math.random() * 2 + "s"

                particlesContainer.appendChild(particle)

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle)
                    }
                }, 8000)
            }
        }, 500)
    }

    setupCardInteractions() {
        this.contentGrid.addEventListener("click", (e) => {
            const card = e.target.closest(".content-card")
            if (card) {
                const title = card.querySelector(".card-title").textContent
                const contentData = Object.values(content).find((item) => item.title === title)
                if (contentData) {
                    this.createRippleEffect(card, e)
                    setTimeout(() => {
                        this.openModal(contentData)
                    }, 200)
                }
            }
        })

        this.contentGrid.addEventListener("mouseover", (e) => {
            const card = e.target.closest(".content-card")
            if (card) {
                this.createHoverEffect(card)
            }
        })
    }

    createRippleEffect(card, event) {
        const ripple = document.createElement("div")
        const rect = card.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = event.clientX - rect.left - size / 2
        const y = event.clientY - rect.top - size / 2

        ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
      `

        card.style.position = "relative"
        card.appendChild(ripple)

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple)
            }
        }, 600)
    }

    createHoverEffect(card) {
        const glowEffect = document.createElement("div")
        glowEffect.style.cssText = `
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #74b9ff, #00cec9, #74b9ff);
        border-radius: 22px;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
      `

        card.style.position = "relative"
        card.appendChild(glowEffect)

        setTimeout(() => {
            glowEffect.style.opacity = "0.5"
        }, 10)

        card.addEventListener(
            "mouseleave",
            () => {
                glowEffect.style.opacity = "0"
                setTimeout(() => {
                    if (glowEffect.parentNode) {
                        glowEffect.parentNode.removeChild(glowEffect)
                    }
                }, 300)
            },
            { once: true },
        )
    }
}

// Add ripple animation to CSS dynamically
const style = document.createElement("style")
style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `
document.head.appendChild(style)

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new Windows7Modal()
})

// Add parallax effect to header
window.addEventListener("load", () => {
    window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset
        const header = document.querySelector(".glass-header")
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`
        }
    })
})
  