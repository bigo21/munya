import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'MUNYA' });
  });

  // Mock Experts API
  app.get('/api/experts', (req, res) => {
    res.json([
      { id: '1', name: 'Dr. Marie Ngo', specialty: 'Psychologue Clinicienne', rating: 4.9, isCertified: true },
      { id: '2', name: 'Me. Jean Kamdem', specialty: 'Avocat Droit de la Famille', rating: 4.8, isCertified: true },
      { id: '3', name: 'Sarah Tchakounté', specialty: 'Assistante Sociale', rating: 4.7, isCertified: true }
    ]);
  });

  // Emergency Alert API (Simulé)
  app.post('/api/emergency', (req, res) => {
    const { userId, location, contacts } = req.body;
    console.log(`[EMERGENCY] Alerte reçue pour ${userId} à ${JSON.stringify(location)}`);
    console.log(`[EMERGENCY] Envoi SMS aux contacts: ${contacts.join(', ')}`);
    res.json({ status: 'alert_sent' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
