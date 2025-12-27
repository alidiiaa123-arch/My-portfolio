document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // ================================================================
  // 1️⃣ Scrollspy: تغيير الـ Active Link في النافبار
  // ================================================================
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      // -150 عشان التفعيل يحصل قبل الوصول للقسم بشوية
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      // التأكد إن الرابط بيشير للقسم الحالي
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // ================================================================
  // 2️⃣ Dark & Light Mode (الوضع الليلي)
  // ================================================================
  const themeToggleBtn = document.getElementById("theme-toggle-button");
  
  const saveTheme = (theme) => localStorage.setItem("theme", theme);
  
  const applyTheme = (theme) => {
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // استرجاع الثيم المحفوظ
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      if (root.classList.contains("dark")) {
        applyTheme("light");
        saveTheme("light");
      } else {
        applyTheme("dark");
        saveTheme("dark");
      }
    });
  }

  // ================================================================
  // 3️⃣ Portfolio Filter (فلتر المشاريع)
  // ================================================================
  const filterButtons = document.querySelectorAll(".portfolio-filter");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // إزالة الستايل من الأزرار القديمة
      filterButtons.forEach((b) => {
        b.classList.remove("active", "bg-linear-to-r", "from-primary", "to-secondary", "text-white");
        b.classList.add("bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300");
      });
      
      // تفعيل الزر الحالي
      btn.classList.add("active", "bg-linear-to-r", "from-primary", "to-secondary", "text-white");
      btn.classList.remove("bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300");

      const filterValue = btn.getAttribute("data-filter");

      portfolioItems.forEach((item) => {
        const itemCategory = item.getAttribute("data-category");
        if (filterValue === "all" || filterValue === itemCategory) {
          item.classList.remove("hidden");
          item.classList.add("animate-pulse");
          setTimeout(() => item.classList.remove("animate-pulse"), 500);
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  // ================================================================
  // 4️⃣ Testimonials Carousel (سلايدر العملاء)
  // ================================================================
  const carousel = document.getElementById("testimonials-carousel");
  const nextBtn = document.getElementById("next-testimonial");
  const prevBtn = document.getElementById("prev-testimonial");
  const indicators = document.querySelectorAll(".carousel-indicator");
  let currentIndex = 0;
  
  // تحديد عدد الكروت الظاهرة حسب حجم الشاشة
  const getVisibleCards = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const updateCarousel = () => {
    const visibleCards = getVisibleCards();
    const itemWidth = 100 / visibleCards;
    const totalItems = document.querySelectorAll(".testimonial-card").length;
    
    const maxIndex = totalItems - visibleCards;
    if (currentIndex > maxIndex) currentIndex = 0;
    if (currentIndex < 0) currentIndex = maxIndex;

    // تحريك السلايدر
    if (carousel) {
        carousel.style.transform = `translateX(${currentIndex * itemWidth}%)`;
    }

    // تحديث النقاط (Dots)
    indicators.forEach((dot, index) => {
      if (index === Math.floor(currentIndex % indicators.length)) {
        dot.classList.add("bg-accent", "scale-125");
        dot.classList.remove("bg-slate-400", "dark:bg-slate-600");
      } else {
        dot.classList.remove("bg-accent", "scale-125");
        dot.classList.add("bg-slate-400", "dark:bg-slate-600");
      }
    });
  };

  if(nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => { currentIndex++; updateCarousel(); });
    prevBtn.addEventListener("click", () => { currentIndex--; updateCarousel(); });
    window.addEventListener('resize', updateCarousel);
  }

  // ================================================================
  // 5️⃣ Settings Sidebar (القائمة الجانبية - الخطوط والألوان)
  // ================================================================
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsSidebar = document.getElementById("settings-sidebar");
  const closeSettings = document.getElementById("close-settings");
  
  const toggleSidebar = () => {
    if (settingsSidebar) settingsSidebar.classList.toggle("translate-x-full");
  };

  if(settingsToggle) settingsToggle.addEventListener("click", toggleSidebar);
  if(closeSettings) closeSettings.addEventListener("click", toggleSidebar);

  // --- أ) تغيير الخطوط (Fonts) ---
  const fontOptions = document.querySelectorAll(".font-option");

  const applyFont = (fontName) => {
    // 1. تحديد قيمة المتغير في CSS
    let fontFamilyCSS = "'Tajawal', sans-serif"; 
    if (fontName === "Alexandria") fontFamilyCSS = "'Alexandria', sans-serif";
    if (fontName === "Cairo") fontFamilyCSS = "'Cairo', sans-serif";
    
    // 2. تطبيق الخط على المتغير الجذري
    root.style.setProperty("--current-font", fontFamilyCSS);

    // 3. تحديث شكل الكروت (Checkmark)
    fontOptions.forEach(btn => {
      if(btn.getAttribute("data-font") === fontName) {
        btn.classList.add("active"); 
        btn.setAttribute("aria-pressed", "true");
        // إظهار علامة الصح
        const checkIcon = btn.querySelector(".check-icon");
        if(checkIcon) checkIcon.style.display = "flex";
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
        // إخفاء علامة الصح
        const checkIcon = btn.querySelector(".check-icon");
        if(checkIcon) checkIcon.style.display = "none";
      }
    });
  };

  fontOptions.forEach(btn => {
    btn.addEventListener("click", () => {
      const fontName = btn.getAttribute("data-font");
      applyFont(fontName);
      localStorage.setItem("selected-font", fontName);
    });
  });

  // استرجاع الخط المحفوظ
  const savedFont = localStorage.getItem("selected-font");
  if (savedFont) applyFont(savedFont);

  // --- ب) تغيير الألوان (Colors) ---
  const colorsGrid = document.getElementById("theme-colors-grid");
  const colors = [
    { primary: "#6366f1", secondary: "#8b5cf6" }, // Indigo (Default)
    { primary: "#0ea5e9", secondary: "#38bdf8" }, // Blue
    { primary: "#10b981", secondary: "#34d399" }, // Emerald
    { primary: "#f43f5e", secondary: "#fb7185" }, // Rose
    { primary: "#f97316", secondary: "#fb923c" }, // Orange
    { primary: "#ef4444", secondary: "#f87171" }, // Red
    { primary: "#8b5cf6", secondary: "#a78bfa" }, // Violet
    { primary: "#06b6d4", secondary: "#67e8f9" }, // Cyan
  ];

  if (colorsGrid) {
    colorsGrid.innerHTML = ''; 
    colors.forEach(color => {
      const btn = document.createElement("button");
      btn.className = "color-btn w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-sm border-2 border-white dark:border-slate-900";
      btn.style.background = `linear-gradient(135deg, ${color.primary}, ${color.secondary})`;
      
      btn.addEventListener("click", () => {
        // تحديث متغيرات CSS
        root.style.setProperty("--color-primary", color.primary);
        root.style.setProperty("--color-secondary", color.secondary);
        
        localStorage.setItem("primary-color", color.primary);
        localStorage.setItem("secondary-color", color.secondary);

        // تحديث شكل الزر المختار
        document.querySelectorAll(".color-btn").forEach(b => {
          b.style.boxShadow = "none";
          b.classList.remove("ring-2", "ring-offset-2", "ring-primary");
          b.style.removeProperty("--tw-ring-color");
        });
        btn.classList.add("ring-2", "ring-offset-2", "ring-primary");
        btn.style.setProperty("--tw-ring-color", color.primary);
      });

      colorsGrid.appendChild(btn);
    });
  }

  // استرجاع الألوان المحفوظة
  const savedPrimary = localStorage.getItem("primary-color");
  const savedSecondary = localStorage.getItem("secondary-color");
  if (savedPrimary && savedSecondary) {
    root.style.setProperty("--color-primary", savedPrimary);
    root.style.setProperty("--color-secondary", savedSecondary);
  }

  // --- ج) زر إعادة الضبط (Reset) ---
  const resetBtn = document.getElementById("reset-settings");
  if(resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.clear(); // مسح كل الإعدادات
      location.reload();    // إعادة تحميل الصفحة
    });
  }

  // ================================================================
  // 6️⃣ Scroll to Top (زر الصعود للأعلى)
  // ================================================================
  const scrollTopBtn = document.getElementById("scroll-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      if(scrollTopBtn) {
        scrollTopBtn.classList.remove("opacity-0", "invisible");
        scrollTopBtn.classList.add("opacity-100", "visible");
      }
    } else {
      if(scrollTopBtn) {
        scrollTopBtn.classList.add("opacity-0", "invisible");
        scrollTopBtn.classList.remove("opacity-100", "visible");
      }
    }
  });

  if(scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ================================================================
  // 7️⃣ Contact Form to WhatsApp (إرسال الفورم لواتساب) 🆕
  // ================================================================
  const contactForm = document.querySelector("form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

      // تجميع البيانات
      const name = document.getElementById("full-name")?.value || "";
      const email = document.getElementById("email")?.value || "";
      const phone = document.getElementById("phone")?.value || "";
      
      // التعامل مع الـ Custom Select لو موجودة
      const projectTypeEl = document.querySelector('.custom-select[data-name="project-type"] .selected-text');
      const projectType = projectTypeEl ? projectTypeEl.textContent : "غير محدد";

      const budgetEl = document.querySelector('.custom-select[data-name="budget"] .selected-text');
      const budget = budgetEl ? budgetEl.textContent : "غير محدد";

      const details = document.getElementById("project-details")?.value || "";

      // 📝 تجهيز نص الرسالة
      const message = `
*طلب مشروع جديد من الموقع* 🚀
---------------------------
👤 *الاسم:* ${name}
📧 *الإيميل:* ${email}
📱 *الهاتف:* ${phone}
---------------------------
🛠 *المشروع:* ${projectType}
💰 *الميزانية:* ${budget}
---------------------------
📝 *التفاصيل:*
${details}
      `.trim();

      // ⚠️⚠️ اكتب رقم تليفونك هنا (بكود الدولة وبدون +) ⚠️⚠️
      // مثال: لمصر 201012345678
      const myPhoneNumber = "201026738588"; 

      // إنشاء الرابط وفتحه
      const whatsappURL = `https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, "_blank");
    });
  }

  // ================================================================
  // 8️⃣ Custom Select Logic (عشان القوائم المخصصة في الفورم تشتغل)
  // ================================================================
  const customSelects = document.querySelectorAll(".custom-select");
  
  customSelects.forEach(select => {
    const optionsContainer = select.nextElementSibling;
    const options = optionsContainer.querySelectorAll(".custom-option");
    const selectedText = select.querySelector(".selected-text");

    // فتح/غلق القائمة
    select.addEventListener("click", () => {
      optionsContainer.classList.toggle("hidden");
      select.querySelector(".fa-chevron-down").classList.toggle("rotate-180");
    });

    // اختيار عنصر
    options.forEach(option => {
      option.addEventListener("click", () => {
        selectedText.textContent = option.textContent.trim();
        selectedText.classList.remove("text-slate-500", "dark:text-slate-400");
        selectedText.classList.add("text-slate-800", "dark:text-white");
        
        optionsContainer.classList.add("hidden");
        select.querySelector(".fa-chevron-down").classList.remove("rotate-180");
      });
    });

    // إغلاق القائمة عند الضغط خارجها
    document.addEventListener("click", (e) => {
      if (!select.contains(e.target) && !optionsContainer.contains(e.target)) {
        optionsContainer.classList.add("hidden");
        select.querySelector(".fa-chevron-down").classList.remove("rotate-180");
      }
    });
  });

});