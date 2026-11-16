// نقطة تشغيل السيرفر: بينشئ تطبيق Express، يضيف الـ middleware، يركّب الـ API ويقدّم تطبيق React بعد الـ build
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const distDir = path.join(__dirname, '..', 'frontend', 'dist');

app.use(helmet());
app.use(cors({ origin: env.corsOrigin || true }));
app.use(express.json({ limit: '10kb' }));

app.use('/api', routes);
app.use('/api', notFound);

// بعد `npm run build` في فولدر frontend، Express بيقدّم تطبيق React من frontend/dist
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  app.use(express.static(distDir));
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Ze tech API running on http://localhost:${env.port}`);
});
