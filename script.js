let activeWhatsapp = '970590000000';

function openModal(targetName = 'حجز مساحة عمل') {
    document.getElementById('modalTarget').value = targetName;
    document.getElementById('bookingModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

window.onclick = function(event) {
    let modal = document.getElementById('bookingModal');
    if (event.target == modal) closeModal();
}

function logBookingToDashboard(name, phone, target, source) {
    const bookings = JSON.parse(localStorage.getItem('madarBookings')) || [];
    bookings.unshift({
        name, phone, target, source,
        date: new Date().toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('madarBookings', JSON.stringify(bookings));
}

function sendToWhatsApp(e) {
    e.preventDefault();
    let name = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    let service = document.getElementById('service').value;
    let message = document.getElementById('message').value;

    logBookingToDashboard(name, phone, service, 'نموذج التواصل');
    let text = `مرحباً مدار تك،%0Aأنا: ${name}%0Aرقم التواصل: ${phone}%0Aمهتم بـ: ${service}%0Aملاحظات: ${message}`;
    window.open(`https://wa.me/${activeWhatsapp}?text=${text}`, '_blank');
}

function sendModalToWhatsApp(e) {
    e.preventDefault();
    let name = document.getElementById('modalName').value;
    let phone = document.getElementById('modalPhone').value;
    let target = document.getElementById('modalTarget').value;

    logBookingToDashboard(name, phone, target, 'حجز سريع');
    let text = `مرحباً مدار تك،%0A أرغب بحجز: ${target}%0Aالاسم: ${name}%0Aرقم التواصل: ${phone}`;
    window.open(`https://wa.me/${activeWhatsapp}?text=${text}`, '_blank');
    closeModal();
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = JSON.parse(localStorage.getItem('madarTechData'));
    if (!saved) return;

    if (saved.colors) {
        document.documentElement.style.setProperty('--oxford-blue', saved.colors.primary);
        document.documentElement.style.setProperty('--fresh-lime', saved.colors.secondary);
        document.documentElement.style.setProperty('--light-bg', saved.colors.lightBg);
    }

    if (saved.content) {
        const c = saved.content;
        const badgeEl = document.querySelector('.hero-badge');
        if (badgeEl) badgeEl.innerHTML = `<i class="fas fa-star"></i> ${c.heroBadge}`;

        const heroH1 = document.querySelector('.hero-content h1');
        if (heroH1) heroH1.innerHTML = `${c.heroTitleMain} <span>${c.heroTitleHighlight}</span>`;

        const heroP = document.querySelector('.hero-content p');
        if (heroP) heroP.textContent = c.heroDesc;

        const heroImg = document.querySelector('.hero-image img');
        if (heroImg && c.heroImg) heroImg.src = c.heroImg;

        const aboutBoxes = document.querySelectorAll('.about-box p');
        if (aboutBoxes.length >= 2) {
            aboutBoxes[0].textContent = c.aboutMission;
            aboutBoxes[1].textContent = c.aboutVision;
        }

        const topInfoSpans = document.querySelectorAll('.top-info span');
        if (topInfoSpans.length >= 2) {
            topInfoSpans[0].innerHTML = `<i class="fas fa-map-marker-alt"></i> ${c.contactAddress}`;
            if (c.contactEmail) topInfoSpans[1].innerHTML = `<i class="fas fa-envelope"></i> ${c.contactEmail}`;
        }

        const topPhoneSpan = document.querySelector('.top-social span');
        if (topPhoneSpan) topPhoneSpan.innerHTML = `<i class="fas fa-phone-alt"></i> ${c.contactPhone}`;

        const infoCards = document.querySelectorAll('.contact-info .info-card p');
        if (infoCards.length >= 3) {
            infoCards[0].textContent = c.contactAddress;
            infoCards[1].textContent = c.contactPhone;
            if (c.contactEmail) infoCards[2].textContent = c.contactEmail;
        }

        if (c.whatsappNumber) activeWhatsapp = c.whatsappNumber;
    }

    if (saved.services && Array.isArray(saved.services)) {
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.innerHTML = saved.services.map(s => `
                <div class="service-card">
                    <div class="service-icon"><i class="${s.icon}"></i></div>
                    <h3>${s.title}</h3>
                    <p>${s.desc}</p>
                </div>
            `).join('');
        }
    }

    if (saved.courses && Array.isArray(saved.courses)) {
        const coursesGrid = document.querySelector('.courses-grid');
        if (coursesGrid) {
            coursesGrid.innerHTML = saved.courses.map(course => `
                <div class="course-card">
                    <div class="course-header">
                        <span class="course-tag">${course.tag}</span>
                        <h3>${course.title}</h3>
                    </div>
                    <div class="course-body">
                        <div class="course-meta">
                            <span><i class="far fa-clock"></i> ${course.hours}</span>
                            <span><i class="fas fa-user-graduate"></i> ${course.level}</span>
                        </div>
                        <p>${course.desc}</p>
                        <br>
                        <button class="btn btn-outline course-btn" onclick="openModal('${course.title}')">التسجيل في الدورة</button>
                    </div>
                </div>
            `).join('');
        }
    }

    if (saved.features && Array.isArray(saved.features)) {
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid) {
            featuresGrid.innerHTML = saved.features.map(f => `
                <div class="feature-item">
                    <i class="${f.icon}"></i>
                    <h4>${f.title}</h4>
                    <p>${f.desc}</p>
                </div>
            `).join('');
        }
    }

    if (saved.visibility) {
        Object.keys(saved.visibility).forEach(secId => {
            const sectionEl = document.getElementById(secId);
            if (sectionEl) sectionEl.style.display = saved.visibility[secId] ? 'block' : 'none';
        });
    }
});