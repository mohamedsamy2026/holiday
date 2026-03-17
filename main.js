// 1. تحديد تاريخ الهدف (تعديل الوقت بناءً على طلبك)
// التاريخ ده هيخلي العداد يقرأ (1 يوم، 22 ساعة، 38 دقيقة) من اللحظة الحالية
const targetDate = new Date("March 20, 2026 00:00:00").getTime();

function updateTimer() {
    const now = new Date().getTime();
    const gap = targetDate - now;

    if (gap < 0) {
        document.querySelector(".main-title").innerText = "عيدكم مبارك!";
        return;
    }

    // الحسبة البرمجية الصحيحة (تأكد من ترتيب المتغيرات داخل الكود عندك)
    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((gap % (1000 * 60)) / 1000);

    // ربط الأرقام بالـ HTML
    document.getElementById("days").innerText = d;
    document.getElementById("hours").innerText = h;
    document.getElementById("minutes").innerText = m;
    document.getElementById("seconds").innerText = s;
}

// تحديث كل ثانية
setInterval(updateTimer, 1000);




// 2. مولد بطاقات التهنئة (Canvas)
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const genBtn = document.getElementById('generateBtn');
const downBtn = document.getElementById('downloadBtn');

// تهيئة الكانفاس بشكل افتراضي
function initCanvas() {
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 30px Cairo";
    ctx.textAlign = "center";
    ctx.fillText("بطاقة العيد", 250, 250);
}
initCanvas();

genBtn.addEventListener('click', () => {
    const name = document.getElementById('userName').value;
    if(!name) return alert("ادخل الاسم يا حريف!");

    // رسم البطاقة
    ctx.clearRect(0, 0, 500, 500);
    let grd = ctx.createLinearGradient(0, 0, 500, 500);
    grd.addColorStop(0, "#6c5ce7");
    grd.addColorStop(1, "#a29bfe");
    ctx.fillStyle = grd;
    ctx.roundRect(0, 0, 500, 500, 20); // متاح في المتصفحات الحديثة
    ctx.fill();

    // زخرفة
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 15;
    ctx.strokeRect(30, 30, 440, 440);

    // نصوص
    ctx.fillStyle = "#fff";
    ctx.font = "bold 40px Cairo";
    ctx.fillText("كل عام وأنت بخير", 250, 180);
    
    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 45px Cairo";
    ctx.fillText(name, 250, 300);

    ctx.fillStyle = "#fff";
    ctx.font = "20px Cairo";
    ctx.fillText("عيد فطر 2026", 250, 400);

    downBtn.style.display = 'block';
});

downBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'eid-2026.png';
    link.href = canvas.toDataURL();
    link.click();
});






// تحديث نسبة الإنجاز والدائرة
function updateProgress() {
    const allTasks = document.querySelectorAll('.task-check');
    const completedTasks = document.querySelectorAll('.task-check:checked');
    const percentSpan = document.getElementById('task-percent');
    const ring = document.getElementById('ring');

    // حساب النسبة المئوية
    const total = allTasks.length;
    const count = completedTasks.length;
    const percentage = Math.round((count / total) * 100);

    // تحديث النص بأنيميشن بسيط
    percentSpan.innerText = percentage;

    // تحديث شكل الدائرة (conic-gradient)
    ring.style.background = `conic-gradient(var(--accent) ${percentage}%, rgba(255, 255, 255, 0.1) 0%)`;
    
    // لمسة إضافية: لو خلص كله الدائرة تنور
    if (percentage === 100) {
        ring.style.boxShadow = "0 0 30px var(--accent)";
    } else {
        ring.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.2)";
    }
}



// 1. وظيفة تحديث الإنجاز والحفظ في LocalStorage
function updateProgress() {
    const allTasks = document.querySelectorAll('.task-check');
    const checkedTasks = document.querySelectorAll('.task-check:checked');
    const percentSpan = document.getElementById('task-percent');
    const ring = document.getElementById('ring');

    // حساب النسبة
    const total = allTasks.length;
    const count = checkedTasks.length;
    const percentage = Math.round((count / total) * 100);

    // تحديث الواجهة
    percentSpan.innerText = percentage;
    ring.style.background = `conic-gradient(var(--accent) ${percentage}%, rgba(255, 255, 255, 0.1) 0%)`;
    
    // تأثير الإضاءة عند الاكتمال
    ring.style.boxShadow = (percentage === 100) ? "0 0 30px var(--accent)" : "0 0 20px rgba(0, 0, 0, 0.2)";

    // --- الحفظ في LocalStorage ---
    const savedStates = {};
    allTasks.forEach(task => {
        savedStates[task.id] = task.checked;
    });
    localStorage.setItem('eidTasks', JSON.stringify(savedStates));
}

// 2. وظيفة استعادة البيانات عند تحميل الصفحة
function loadSavedTasks() {
    const savedData = localStorage.getItem('eidTasks');
    
    if (savedData) {
        const states = JSON.parse(savedData);
        Object.keys(states).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = states[id];
            }
        });
        // تحديث الدائرة والنسبة بناءً على البيانات المستعادة
        updateProgress();
    }
}

// 3. تأكد من تشغيل الاستعادة عند فتح الصفحة
window.addEventListener('load', () => {
    loadSavedTasks();
    // لو عندك كود "اللودر" أو "الكويز" خليهم شغالين عادي هنا برضه
});





// الكويز
const quizData = [
    {
        q: "ما هو اسم الصدقة التي تُخرج قبل صلاة عيد الفطر؟",
        options: ["صدقة التطوع", "زكاة الفطر", "الكفارة"],
        correct: 1
    },
    {
        q: "كم عدد تكبيرات الركعة الأولى في صلاة العيد (غير تكبيرة الإحرام)؟",
        options: ["3 تكبيرات", "5 تكبيرات", "7 تكبيرات"],
        correct: 2
    },
    {
        q: "ما هو اللبس المستحب في العيد بناءً على السنة؟",
        options: ["لبس أحسن الثياب", "لبس الملابس القديمة", "أي لباس عادي"],
        correct: 0
    }
];

let currentQuestion = 0;

function loadQuestion() {
    const qText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const progress = document.getElementById("progress");

    progress.style.width = ((currentQuestion) / quizData.length) * 100 + "%";

    const currentData = quizData[currentQuestion];
    qText.innerText = currentData.q;
    optionsContainer.innerHTML = "";

    currentData.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.className = "opt-btn";
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedIndex, btn) {
    const isCorrect = selectedIndex === quizData[currentQuestion].correct;
    const allBtns = document.querySelectorAll(".opt-btn");
    
    // قفل الزراير مؤقتاً
    allBtns.forEach(b => b.style.pointerEvents = "none");

    if (isCorrect) {
        btn.classList.add("correct-flash");
        showStatusMsg("إجابة صحيحة! أحسنت 🌟", "msg-success");

        setTimeout(() => {
            currentQuestion++;
            hideStatusMsg();
            if (currentQuestion < quizData.length) {
                loadQuestion();
                allBtns.forEach(b => b.style.pointerEvents = "auto");
            } else {
                showResult();
            }
        }, 1500);
    } else {
        btn.classList.add("wrong-flash");
        btn.parentElement.parentElement.classList.add("shake"); // حركة اهتزاز عند الخطأ
        showStatusMsg("إجابة خاطئة، حاول مرة أخرى! ❌", "msg-error");

        setTimeout(() => {
            btn.classList.remove("wrong-flash");
            btn.parentElement.parentElement.classList.remove("shake");
            hideStatusMsg();
            allBtns.forEach(b => b.style.pointerEvents = "auto");
        }, 1500);
    }
}

function showStatusMsg(text, className) {
    const msgElement = document.getElementById("quiz-msg");
    msgElement.innerText = text;
    msgElement.className = "quiz-status-msg msg-visible " + className;
}

function hideStatusMsg() {
    const msgElement = document.getElementById("quiz-msg");
    msgElement.classList.remove("msg-visible");
}

function showResult() {
    document.getElementById("progress").style.width = "100%";
    document.getElementById("quiz-wrapper").style.display = "none";
    document.getElementById("quiz-msg").style.display = "none";
    document.getElementById("quiz-result").style.display = "block";
}

// تشغيل الكويز
window.onload = () => {
    if(document.getElementById("question-text")) loadQuestion();
};