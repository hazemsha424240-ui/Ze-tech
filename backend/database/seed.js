// سكريبت البيانات التجريبية: بينشئ حساب الأدمن وعملاء تجريبيين (آمن لو اتشغّل أكتر من مرة)
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const env = require('../config/env');
const User = require('../models/user.model');

if (!User.findByEmail(env.seedAdminEmail)) {
  User.create({
    name: 'Admin',
    email: env.seedAdminEmail,
    passwordHash: bcrypt.hashSync(env.seedAdminPassword, 10)
  });
  console.log('Admin created:', env.seedAdminEmail);
} else {
  console.log('Admin already exists:', env.seedAdminEmail);
}

const count = db.prepare('SELECT COUNT(*) AS c FROM leads').get().c;
if (count === 0) {
  const daysAgo = (d) => new Date(Date.now() - d * 864e5).toISOString();
  const samples = [
    ['Omar Hassan', 'omar@nilesoft.eg', '+201001234567', 'Nile Soft', 'Web Development', '10-25k', 'Need a corporate website with a blog.', 'Contacted', 6],
    ['Salma Adel', 'salma@zahra.shop', '+201112223344', 'Zahra Shop', 'E-Commerce', '25-50k', 'Moving our store from Instagram to a real site.', 'Interested', 5],
    ['Karim Nabil', 'karim@fastlog.com', '+201223334455', 'FastLog', 'Mobile App', '50k+', 'Driver tracking app for 200 drivers.', 'In Progress', 4],
    ['Mona Samir', 'mona@clinic.eg', '+201555667788', 'Smile Clinic', 'UI/UX', 'Less than 10k', 'Redesign the appointment booking flow.', 'Won', 3],
    ['Youssef Tarek', 'youssef@example.com', '+201066778899', '', 'Digital Marketing', 'Not Sure', 'Want more leads for my gym.', 'Lost', 2],
    ['Hana Mostafa', 'hana@brightedu.org', '+201099887766', 'Bright Edu', 'Other', '10-25k', 'Learning portal with student accounts.', 'New', 1]
  ];
  const insert = db.prepare(
    `INSERT INTO leads (name, email, phone, company, service, budget, message, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  db.transaction(() => {
    samples.forEach((s) => insert.run(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], daysAgo(s[8]), daysAgo(s[8])));
  })();
  console.log('Sample leads added:', samples.length);
} else {
  console.log('Leads table already has data, skipping sample leads.');
}
