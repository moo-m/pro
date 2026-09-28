// ============================================
// الجزء الأول: إدارة الأقسام والأنيميشن الخلفي
// ============================================

function showSection(sectionId) {
    // إخفاء جميع الأقسام
    const sections = document.querySelectorAll(".main-section");
    sections.forEach(section => {
        section.style.display = "none";
    });

    // إظهار القسم المطلوب
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = "flex";
    }

    // إيقاف/تشغيل الأنيميشن حسب القسم
    if (sectionId === "home") {
        if (!animationRunning) {
            animate();
            animationRunning = true;
        }
    } else if (sectionId === "triangle") {
        initTriangle();
    } else if (sectionId === "proof") {
        setTimeout(initProof, 100);
    }
}

let animationRunning = true;
const canvas = document.getElementById("geometryCanvas");
const ctx = canvas.getContext("2d");

// تهيئة كانفس الخلفية
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.92;

const colors = {
    primary: "#38bdf8",
    secondary: "#0ea5e9",
    accent: "#7c3aed",
    dark: "#1e293b",
    light: "#cbd5e1"
};

const shapes = [];

class Square {
    constructor(x, y, size, color, rotation, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.rotation = rotation;
        this.speed = speed;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.strokeStyle = colors.light;
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
    update() {
        this.rotation += this.rotationSpeed;
        this.y += this.speed;
        if (this.y > canvas.height + this.size) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
    }
}

class TriangleShape {
    constructor(x, y, size, color, rotation, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.rotation = rotation;
        this.speed = speed;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = colors.light;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
    update() {
        this.rotation += this.rotationSpeed;
        this.y += this.speed;
        if (this.y > canvas.height + this.size) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
    }
}

function createShapes() {
    const colorArray = [
        colors.primary,
        colors.secondary,
        colors.accent,
        colors.dark
    ];
    for (let i = 0; i < 15; i++) {
        shapes.push(
            new Square(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 60 + 40,
                colorArray[Math.floor(Math.random() * colorArray.length)] +
                    "80",
                Math.random() * Math.PI * 2,
                Math.random() * 0.5 + 0.2
            )
        );
        shapes.push(
            new TriangleShape(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 70 + 50,
                colorArray[Math.floor(Math.random() * colorArray.length)] +
                    "80",
                Math.random() * Math.PI * 2,
                Math.random() * 0.5 + 0.2
            )
        );
    }
}

function animate() {
    if (!animationRunning) return;
    const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
    );
    gradient.addColorStop(0, "#1e293b");
    gradient.addColorStop(0.5, "#334155");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        shape.update();
        shape.draw();
    });
    requestAnimationFrame(animate);
}

createShapes();
animate();





/* // ============================================
// قسم المقدمة - Slideshow
// ============================================
 */
let currentSlide = 0;
let slides = [];
let indicators = [];
let touchStartXT = 0;
let touchEndX = 0;

function initSlideshow() {
    slides = document.querySelectorAll('.slide');
    indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    const container = document.querySelector('.slideshow-container');
    if (container) {
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    showSlide(0);
}

function showSlide(index) {
    if (slides.length === 0) return;
    
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    slides[currentSlide].classList.add('active');
    
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
    
    console.log('Showing slide:', currentSlide);
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

function goToSlide(index) {
    showSlide(index);
}

function handleTouchStart(e) {
    touchStartXT = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartXT - touchEndX > swipeThreshold) {
        changeSlide(1);
    } else if (touchEndX - touchStartXT > swipeThreshold) {
        changeSlide(-1);
    }
}

document.addEventListener('keydown', (e) => {
    const introSection = document.getElementById('intro');
    
    if (introSection && introSection.style.display !== 'none') {
        if (e.key === 'ArrowLeft') {
            changeSlide(1); // السهم الأيسر - التالي (RTL)
        } else if (e.key === 'ArrowRight') {
            changeSlide(-1); // السهم الأيمن - السابق (RTL)
        }
    }
});

const previousShowSection = showSection;
showSection = function(sectionId) {
    previousShowSection(sectionId);
    
    if (sectionId === 'intro') {
        setTimeout(initSlideshow, 100);
    }
    
    if (typeof updateActiveNav === 'function') {
        updateActiveNav(sectionId);
    }
};







// ============================================
// الجزء الثاني: تطبيق نظرية فيثاغورس (المصلح بصرياً)
// ============================================

let triangleCanvas, triangleCtx;
let state = {
    a: 200,
    b: 150,
    c: 250,
    showSquares: false,
    isDragging: false,
    dragPoint: null,
    scale: 1,
    offsetX: 0,
    offsetY: 0
};

function initTriangle() {
    triangleCanvas = document.getElementById("triangleCanvas");
    if (!triangleCanvas) return;
    triangleCtx = triangleCanvas.getContext("2d");

    setupSidebarToggle();
    setupTriangleControls();
    setupTriangleInteractions();

    handleResize();
    window.addEventListener("resize", handleResize);
}

function setupSidebarToggle() {
    const btn = document.getElementById("toggleSidebarBtn");
    const page = document.querySelector(".triangle-page");
    if (btn) {
        btn.onclick = () => {
            page.classList.toggle("sidebar-closed");
            setTimeout(handleResize, 350);
        };
    }
}

function setupTriangleControls() {
    const inputA = document.getElementById("sideA");
    const inputB = document.getElementById("sideB");
    const checkSquares = document.getElementById("showSquares");

    inputA.addEventListener("input", e => {
        state.a = parseFloat(e.target.value);
        state.c = Math.sqrt(state.a * state.a + state.b * state.b);
        updateUI();
        drawScene();
    });

    inputB.addEventListener("input", e => {
        state.b = parseFloat(e.target.value);
        state.c = Math.sqrt(state.a * state.a + state.b * state.b);
        updateUI();
        drawScene();
    });

    checkSquares.addEventListener("change", e => {
        state.showSquares = e.target.checked;
        drawScene();
    });
}

function updateUI() {
    document.getElementById("sideA").value = Math.round(state.a);
    document.getElementById("sideB").value = Math.round(state.b);
    document.getElementById("valueA").textContent = Math.round(state.a);
    document.getElementById("valueB").textContent = Math.round(state.b);
    document.getElementById("valueC").textContent = Math.round(state.c);

    const a2 = Math.round(state.a ** 2);
    const b2 = Math.round(state.b ** 2);
    const c2 = Math.round(state.c ** 2);

    document.getElementById(
        "formulaValues"
    ).innerHTML = `<span style="color:#ff6b6b">${a2}</span> + <span style="color:#4ecdc4">${b2}</span> = <span style="color:#95e1d3">${c2}</span>`;
}

function handleResize() {
    if (!triangleCanvas) return;
    const container = document.getElementById("canvasContainer");

    // أخذ الأبعاد الحقيقية للحاوية بعد توزيع الـ Flex
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    triangleCanvas.width = w;
    triangleCanvas.height = h;

    // مقياس ديناميكي محسن للشاشات الكبيرة (4K و Desktop)
    const baseDimension = Math.min(w, h);
    state.scale = baseDimension / 650;

    // وضع الزاوية القائمة في مكان متوازن
    // نضعها في ثلث العرض وثلثي الارتفاع لترك مساحة للمربعات
    state.offsetX = w * 0.35;
    state.offsetY = h * 0.7;

    drawScene();
}

function drawScene() {
    if (!triangleCtx) return;
    const ctx = triangleCtx;
    ctx.clearRect(0, 0, triangleCanvas.width, triangleCanvas.height);

    ctx.save();
    ctx.translate(state.offsetX, state.offsetY);
    ctx.scale(state.scale, state.scale);

    const p1 = { x: 0, y: 0 }; // الزاوية القائمة
    const p2 = { x: state.a, y: 0 }; // نهاية الضلع الأفقي
    const p3 = { x: 0, y: -state.b }; // نهاية الضلع العمودي

    // 1. رسم المربعات والمساحات بداخلها
    if (state.showSquares) {
        // مربع الضلع a
        drawPoly(
            ctx,
            [p1, p2, { x: p2.x, y: state.a }, { x: p1.x, y: state.a }],
            "#ff6b6b30",
            "#ff6b6b"
        );
        drawText(
            ctx,
            `${Math.round(state.a ** 2)}`,
            state.a / 2,
            state.a / 2,
            "#ff6b6b",
            16
        );

        // مربع الضلع b
        drawPoly(
            ctx,
            [p1, p3, { x: -state.b, y: p3.y }, { x: -state.b, y: p1.y }],
            "#4ecdc430",
            "#4ecdc4"
        );
        drawText(
            ctx,
            `${Math.round(state.b ** 2)}`,
            -state.b / 2,
            -state.b / 2,
            "#4ecdc4",
            16
        );

        // مربع الوتر c
        const dx = p3.x - p2.x;
        const dy = p3.y - p2.y;
        const perpX = -dy;
        const perpY = dx;
        const cP3 = { x: p2.x + perpX, y: p2.y + perpY };
        const cP4 = { x: p3.x + perpX, y: p3.y + perpY };
        drawPoly(ctx, [p3, p2, cP3, cP4], "#95e1d330", "#95e1d3");

        const centerX = (p3.x + p2.x + cP3.x + cP4.x) / 4;
        const centerY = (p3.y + p2.y + cP3.y + cP4.y) / 4;
        drawText(
            ctx,
            `${Math.round(state.c ** 2)}`,
            centerX,
            centerY,
            "#95e1d3",
            16
        );
    }

    // 2. رسم المثلث الأساسي
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fill();

    // 3. رسم أضلاع المثلث
    drawLine(ctx, p1, p2, "#ff6b6b"); // a
    drawLine(ctx, p1, p3, "#4ecdc4"); // b
    drawLine(ctx, p2, p3, "#95e1d3"); // c

    // 4. كتابة أطوال الأضلاع بجانب كل ضلع
    // طول الضلع a (تحت الضلع)
    drawText(ctx, `${Math.round(state.a)}`, state.a / 2, 25, "#ff6b6b", 18);

    // طول الضلع b (يسار الضلع)
    drawText(ctx, `${Math.round(state.b)}`, -40, -state.b / 2, "#4ecdc4", 18);

    // طول الوتر c (فوق الضلع المائل)
    const midCX = (p2.x + p3.x) / 2 + 15;
    const midCY = (p2.y + p3.y) / 2 - 15;
    drawText(ctx, `${Math.round(state.c)}`, midCX, midCY, "#95e1d3", 18);

    // 5. نقاط التحكم (الدوائر القابلة للسحب)
    drawControlPoint(ctx, p2.x, p2.y, "#ff6b6b");
    drawControlPoint(ctx, p3.x, p3.y, "#4ecdc4");

    // رمز الزاوية القائمة
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, -15, 15, 15);

    ctx.restore();
}

function drawLine(ctx, p1, p2, color) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
}

function drawPoly(ctx, points, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++)
        ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.stroke();
}

function drawControlPoint(ctx, x, y, color) {
    const r = 10 / state.scale;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2 / state.scale;
    ctx.stroke();
}

function drawLabel(ctx, text, x, y, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1 / state.scale, 1 / state.scale);
    ctx.fillStyle = color;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

function setupTriangleInteractions() {
    const getPos = e => {
        const rect = triangleCanvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left - state.offsetX) / state.scale,
            y: (clientY - rect.top - state.offsetY) / state.scale
        };
    };

    const handleStart = e => {
        const pos = getPos(e);
        const hitA = Math.hypot(pos.x - state.a, pos.y) < 40 / state.scale;
        const hitB = Math.hypot(pos.x, pos.y + state.b) < 40 / state.scale;

        if (hitA) {
            state.isDragging = true;
            state.dragPoint = "a";
        } else if (hitB) {
            state.isDragging = true;
            state.dragPoint = "b";
        }
    };

    const handleMove = e => {
        if (!state.isDragging) return;
        e.preventDefault();
        const pos = getPos(e);

        if (state.dragPoint === "a") {
            state.a = Math.max(50, Math.min(800, pos.x));
        } else if (state.dragPoint === "b") {
            state.b = Math.max(50, Math.min(800, -pos.y));
        }

        state.c = Math.sqrt(state.a * state.a + state.b * state.b);
        updateUI();
        drawScene();
    };

    const handleEnd = () => {
        state.isDragging = false;
        state.dragPoint = null;
    };

    triangleCanvas.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    triangleCanvas.addEventListener("touchstart", handleStart, {
        passive: false
    });
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
}

// دالة موحدة لرسم النصوص (الأطوال والمساحات) لضمان الوضوح
function drawText(ctx, text, x, y, color, fontSize) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1 / state.scale, 1 / state.scale); // لإلغاء تأثير السكيل على جودة النص
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // إضافة ظل خفيف للنص لزيادة الوضوح على الخلفية الداكنة
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

// ============================================
// قسم البرهان - Drag and Drop (المُصلح)
// ============================================

let proofState = {
    a: 200,
    b: 150,
    c: 250,
    piecesPlaced: {
        a: false,
        b: false
    }
};

// تهيئة البرهان عند فتح القسم
function initProof() {
    // حساب الأبعاد من القسم السابق
    if (typeof state !== "undefined" && state.a && state.b) {
        proofState.a = state.a;
        proofState.b = state.b;
        proofState.c = state.c;
    }

    // إعادة تعيين الحالة
    proofState.piecesPlaced = { a: false, b: false };

    updateProofSquares();
    setupDragAndDrop();
}

// تحديث أحجام المربعات
function updateProofSquares() {
    const baseSize = 150; // الحجم الأساسي بالبكسل

    // حساب نسب الأحجام بناءً على نظرية فيثاغورس
    const totalC = proofState.c;
    const ratioA = proofState.a / totalC;
    const ratioB = proofState.b / totalC;

    const sizeA = ratioA * baseSize;
    const sizeB = ratioB * baseSize;
    const sizeC = baseSize;

    const squareA = document.getElementById("squareA");
    const squareB = document.getElementById("squareB");
    const targetC = document.getElementById("targetC");

    if (squareA) {
        squareA.style.width = sizeA + "px";
        squareA.style.height = sizeA + "px";
        squareA.style.minWidth = sizeA + "px";
        squareA.style.minHeight = sizeA + "px";
    }

    if (squareB) {
        squareB.style.width = sizeB + "px";
        squareB.style.height = sizeB + "px";
        squareB.style.minWidth = sizeB + "px";
        squareB.style.minHeight = sizeB + "px";
    }

    if (targetC) {
        targetC.style.width = sizeC + "px";
        targetC.style.height = sizeC + "px";
        targetC.style.minWidth = sizeC + "px";
        targetC.style.minHeight = sizeC + "px";
    }
}

// إعداد السحب والإفلات
function setupDragAndDrop() {
    const draggables = document.querySelectorAll(".draggable-square");
    const dropZone = document.getElementById("targetC");
    const resetBtn = document.getElementById("resetBtn");

    if (!dropZone) {
        console.error("Drop zone not found!");
        return;
    }

    // إزالة المستمعين القدامى أولاً
    draggables.forEach(square => {
        const newSquare = square.cloneNode(true);
        square.parentNode.replaceChild(newSquare, square);
    });

    // إعادة الحصول على العناصر بعد الاستنساخ
    const freshDraggables = document.querySelectorAll(".draggable-square");

    freshDraggables.forEach(square => {
        square.addEventListener("dragstart", handleDragStart);
        square.addEventListener("dragend", handleDragEnd);

        // إضافة دعم اللمس للموبايل
        square.addEventListener("touchstart", handleTouchStart, {
            passive: false
        });
        square.addEventListener("touchmove", handleTouchMove, {
            passive: false
        });
        square.addEventListener("touchend", handleTouchEnd, { passive: false });
    });

    // تنظيف المستمعين القدامى من dropZone
    const newDropZone = dropZone.cloneNode(true);
    dropZone.parentNode.replaceChild(newDropZone, dropZone);

    // إعادة الحصول على dropZone
    const freshDropZone = document.getElementById("targetC");

    freshDropZone.addEventListener("dragover", handleDragOver);
    freshDropZone.addEventListener("drop", handleDrop);
    freshDropZone.addEventListener("dragleave", handleDragLeave);
    freshDropZone.addEventListener("dragenter", handleDragEnter);

    if (resetBtn) {
        resetBtn.onclick = resetProof;
    }
}

// متغيرات للمس
let touchedElement = null;
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
    touchedElement = e.currentTarget;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchedElement.style.opacity = "0.5";
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!touchedElement) return;

    const touch = e.touches[0];
    touchedElement.style.position = "fixed";
    touchedElement.style.left =
        touch.clientX - touchedElement.offsetWidth / 2 + "px";
    touchedElement.style.top =
        touch.clientY - touchedElement.offsetHeight / 2 + "px";
    touchedElement.style.zIndex = "1000";
}

function handleTouchEnd(e) {
    if (!touchedElement) return;

    const touch = e.changedTouches[0];
    const dropZone = document.getElementById("targetC");
    const rect = dropZone.getBoundingClientRect();

    // التحقق من وقوع اللمسة داخل منطقة الإسقاط
    if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
    ) {
        const squareType = touchedElement.dataset.square;
        if (!proofState.piecesPlaced[squareType]) {
            placePiece(squareType, dropZone);
            proofState.piecesPlaced[squareType] = true;
            touchedElement.style.visibility = "hidden";
            checkCompletion();
        }
    }

    // إعادة تعيين الموضع
    touchedElement.style.position = "";
    touchedElement.style.left = "";
    touchedElement.style.top = "";
    touchedElement.style.opacity = "1";
    touchedElement.style.zIndex = "";
    touchedElement = null;
}

function handleDragStart(e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", e.target.dataset.square);
    e.target.style.opacity = "0.5";

    console.log("Drag started:", e.target.dataset.square);
}

function handleDragEnd(e) {
    e.target.style.opacity = "1";
    console.log("Drag ended");
}

function handleDragEnter(e) {
    e.preventDefault();
    console.log("Drag enter");
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    const dropZone = e.currentTarget;
    if (!dropZone.classList.contains("drag-over")) {
        dropZone.classList.add("drag-over");
    }

    console.log("Drag over");
    return false;
}

function handleDragLeave(e) {
    const dropZone = e.currentTarget;
    // التحقق من أن المغادرة ليست لعنصر فرعي
    if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove("drag-over");
    }
    console.log("Drag leave");
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Drop event triggered!");

    const dropZone = e.currentTarget;
    dropZone.classList.remove("drag-over");

    const squareType = e.dataTransfer.getData("text/plain");
    console.log("Dropped square type:", squareType);

    if (!squareType) {
        console.error("No square type found in dataTransfer");
        return false;
    }

    if (!proofState.piecesPlaced[squareType]) {
        placePiece(squareType, dropZone);
        proofState.piecesPlaced[squareType] = true;

        // إخفاء المربع الأصلي
        const originalSquare = document.querySelector(
            `[data-square="${squareType}"]`
        );
        if (originalSquare) {
            originalSquare.style.visibility = "hidden";
        }

        checkCompletion();
    } else {
        console.log("Piece already placed");
    }

    return false;
}

function placePiece(type, container) {
    console.log("Placing piece:", type);

    const ratioA = proofState.a / proofState.c;
    const ratioB = proofState.b / proofState.c;

    console.log("Ratio A:", ratioA, "Ratio B:", ratioB);
    console.log(
        "Verification: A²+B² =",
        (ratioA * ratioA + ratioB * ratioB).toFixed(3)
    );

    container.classList.add("has-pieces");

    if (type === "a") {
        // مربع A في الزاوية السفلية اليسرى
        const piece = document.createElement("div");
        piece.className = "placed-piece";
        piece.dataset.piece = "a";

        const sizePercent = ratioA * 100;
        piece.style.width = sizePercent + "%";
        piece.style.height = sizePercent + "%";
        piece.style.bottom = "0";
        piece.style.left = "0";
        piece.style.backgroundColor = "rgba(255, 107, 107, 0.7)";
        piece.style.border = "3px solid #ff6b6b";
        piece.style.borderRadius = "4px";
        piece.style.zIndex = "15";
        piece.innerHTML =
            '<span style="color: #fff; font-weight: bold; font-size: 1.2em; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">a²</span>';

        container.appendChild(piece);
        console.log("مربع A تم وضعه");
    } else if (type === "b") {
        // تقسيم مربع B إلى 3 قطع تملأ الفراغات:
        // 1. مستطيل أفقي (أسفل يمين) - يمين مربع a
        // 2. مستطيل عمودي (أعلى يسار) - فوق مربع a
        // 3. مربع صغير (أعلى يمين) - الزاوية المتبقية

        const aSize = ratioA * 100; // حجم ضلع مربع a
        const remaining = 100 - aSize; // المساحة المتبقية

        // القطعة 1: مستطيل أفقي (أسفل يمين) - عرضه = المتبقي، ارتفاعه = a
        setTimeout(() => {
            const rect1 = document.createElement("div");
            rect1.className = "placed-piece";
            rect1.dataset.piece = "b-rect1";
            rect1.style.width = remaining + "%";
            rect1.style.height = aSize + "%";
            rect1.style.bottom = "0";
            rect1.style.right = "0";
            rect1.style.backgroundColor = "rgba(78, 205, 196, 0.7)";
            rect1.style.border = "3px solid #4ecdc4";
            rect1.style.borderRadius = "4px";
            rect1.style.zIndex = "14";
            rect1.innerHTML =
                '<span style="color: #fff; font-weight: bold; font-size: 0.9em; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">b² جزء 1</span>';
            container.appendChild(rect1);
            console.log("مستطيل 1 (أفقي) تم وضعه");
        }, 150);

        // القطعة 2: مستطيل عمودي (أعلى يسار) - عرضه = a، ارتفاعه = المتبقي
        setTimeout(() => {
            const rect2 = document.createElement("div");
            rect2.className = "placed-piece";
            rect2.dataset.piece = "b-rect2";
            rect2.style.width = aSize + "%";
            rect2.style.height = remaining + "%";
            rect2.style.top = "0";
            rect2.style.left = "0";
            rect2.style.backgroundColor = "rgba(78, 205, 196, 0.7)";
            rect2.style.border = "3px solid #4ecdc4";
            rect2.style.borderRadius = "4px";
            rect2.style.zIndex = "14";
            rect2.innerHTML =
                '<span style="color: #fff; font-weight: bold; font-size: 0.9em; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">b² جزء 2</span>';
            container.appendChild(rect2);
            console.log("مستطيل 2 (عمودي) تم وضعه");
        }, 300);

        // القطعة 3: مربع صغير (أعلى يمين) - يملأ الزاوية المتبقية
        setTimeout(() => {
            const square = document.createElement("div");
            square.className = "placed-piece";
            square.dataset.piece = "b-square";
            square.style.width = remaining + "%";
            square.style.height = remaining + "%";
            square.style.top = "0";
            square.style.right = "0";
            square.style.backgroundColor = "rgba(78, 205, 196, 0.7)";
            square.style.border = "3px solid #4ecdc4";
            square.style.borderRadius = "4px";
            square.style.zIndex = "14";
            square.innerHTML =
                '<span style="color: #fff; font-weight: bold; font-size: 0.9em; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">b² جزء 3</span>';
            container.appendChild(square);
            console.log("مربع صغير تم وضعه");
        }, 450);
    }
}

function createTrianglePiece(container, pieceId, position, delay) {
    setTimeout(() => {
        const piece = document.createElement("div");
        piece.className = "placed-piece snapping";
        piece.dataset.piece = pieceId;

        // تطبيق الأبعاد والموضع
        piece.style.width = position.width + "%";
        piece.style.height = position.height + "%";

        if (position.top !== undefined) piece.style.top = position.top + "%";
        if (position.bottom !== undefined)
            piece.style.bottom = position.bottom + "%";
        if (position.left !== undefined) piece.style.left = position.left + "%";
        if (position.right !== undefined)
            piece.style.right = position.right + "%";

        // إضافة نص صغير
        const label = document.createElement("span");
        label.textContent = "¼b²";
        label.style.fontSize = "clamp(0.6rem, 1.2vw, 0.9rem)";
        piece.appendChild(label);

        container.appendChild(piece);

        console.log(`Triangle ${pieceId} placed`);
    }, delay);
}

function checkCompletion() {
    const statusMsg = document.getElementById("statusMessage");
    const targetSquare = document.getElementById("targetC");

    if (proofState.piecesPlaced.a && proofState.piecesPlaced.b) {
        setTimeout(() => {
            statusMsg.innerHTML =
                "🎉 ممتاز! لقد أكملت البرهان البصري<br>a² (مربع أحمر) + b² (مستطيلين + مربع أزرق) = c²";
            statusMsg.style.color = "#22c55e";
            statusMsg.style.fontSize = "clamp(0.85rem, 2vw, 1.1rem)";
            targetSquare.classList.add("complete");

            // تأثير احتفالي
            targetSquare.style.animation = "pulse 0.5s ease-in-out 3";

            console.log("البرهان اكتمل!");
        }, 600);
    } else if (proofState.piecesPlaced.a || proofState.piecesPlaced.b) {
        if (proofState.piecesPlaced.b) {
            statusMsg.textContent =
                "رائع! المربع انقسم إلى 3 قطع (مستطيلين + مربع). الآن اسحب المربع الأحمر";
        } else {
            statusMsg.textContent = "رائع! استمر... اسحب المربع الأزرق";
        }
        statusMsg.style.color = "#38bdf8";
    }
}

function addCelebrationEffect(element) {
    element.style.animation = "pulse 0.5s ease-in-out 3";
}

const style = document.createElement("style");
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(149, 225, 211, 0.7);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(149, 225, 211, 0);
        }
    }
`;
document.head.appendChild(style);

function resetProof() {
    console.log("Resetting proof...");

    // إعادة تعيين الحالة
    proofState.piecesPlaced = { a: false, b: false };

    // مسح القطع الموضوعة
    const placedPieces = document.querySelectorAll(".placed-piece");
    placedPieces.forEach(piece => {
        piece.style.animation = "fadeOut 0.3s forwards";
        setTimeout(() => piece.remove(), 300);
    });

    setTimeout(() => {
        // إظهار المربعات الأصلية
        const squares = document.querySelectorAll(".draggable-square");
        squares.forEach(square => {
            square.style.visibility = "visible";
            square.style.position = "";
            square.style.left = "";
            square.style.top = "";
            square.style.opacity = "1";
            square.classList.remove("being-dragged");
        });

        // إعادة تعيين الرسائل
        const statusMsg = document.getElementById("statusMessage");
        statusMsg.textContent = "اسحب المربعات إلى مربع الوتر لإكمال البرهان";
        statusMsg.style.color = "#cbd5e1";
        statusMsg.style.fontSize = "clamp(0.9rem, 2vw, 1.1rem)";

        const targetSquare = document.getElementById("targetC");
        targetSquare.classList.remove("complete", "has-pieces");
        targetSquare.classList.remove("drag-over");
        targetSquare.style.animation = "";
    }, 350);
}

function updateActiveNav(sectionId) {
    // إزالة الكلاس active من جميع الروابط
    const navLinks = document.querySelectorAll(".navbar a");
    navLinks.forEach(link => {
        link.classList.remove("active");
    });

    // إضافة الكلاس active للرابط الحالي
    const activeLink = document.querySelector(
        `.navbar a[data-section="${sectionId}"]`
    );
    if (activeLink) {
        activeLink.classList.add("active");
    }
}
const originalShowSectionFunc = showSection;

showSection = function (sectionId) {
    // استدعاء الدالة الأصلية
    if (typeof originalShowSectionFunc === "function") {
        originalShowSectionFunc(sectionId);
    } else {
        // إذا لم تكن معرّفة، نفذ المنطق الأساسي
        const sections = document.querySelectorAll(".main-section");
        sections.forEach(section => {
            section.style.display = "none";
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = "flex";
        }

        if (sectionId === "home") {
            if (!animationRunning) {
                animate();
                animationRunning = true;
            }
        } else if (sectionId === "triangle") {
            initTriangle();
        } else if (sectionId === "proof") {
            setTimeout(initProof, 100);
        }
    }

    // تحديث الرابط النشط
    updateActiveNav(sectionId);
};

document.addEventListener("DOMContentLoaded", () => {
    updateActiveNav("home");
});
