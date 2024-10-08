// 'express' modülünü yükler.
const express = require('express');
// 'verifyToken' middleware'ini yükler. Bu middleware, JWT token doğrulaması yapar.
const verifyToken = require('../middlewares/verifyToken');

// Yeni bir Express router nesnesi oluşturur.
const router = express.Router();

// '/some-secure-route' URL'sine POST isteği yapıldığında, 'verifyToken' middleware'i çağrılır.
// Bu middleware, token'ı doğrular ve geçerli ise işlemi gerçekleştirir.
router.post('/some-secure-route', verifyToken, async (req, res) => {
    // Güvenli işlem burada yapılır. Token doğrulandıktan sonra buraya ulaşılır.
    res.status(200).send({ message: "Access granted." });
});

// Router'ı dışa aktarır, böylece başka dosyalarda kullanılabilir.
module.exports = router;
