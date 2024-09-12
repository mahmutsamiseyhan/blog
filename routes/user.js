// Express kütüphanesini ve Router'ı dahil et
const express = require("express");
// Yeni bir Express router nesnesi oluşturur
const router = express.Router();
// User controller'ını dahil et
const userController = require("../controllers/user");

const Category = require("../models/category");

// Belirli bir kategoriye ait blog yazılarını listeleme endpoint'i
// URL: /blogs/category/:slug
// :slug, kategori adını temsil eder
// Örneğin: /blogs/category/technology gibi bir URL, 'technology' kategorisindeki blogları listeler
router.get("/blogs/category/:slug", userController.blog_list);

// Belirli bir blog yazısının detaylarını gösteren endpoint
// URL: /blogs/:slug
// :slug, blog yazısının başlığını veya tanımlayıcısını temsil eder
// Örneğin: /blogs/my-first-post gibi bir URL, 'my-first-post' başlıklı blogun detaylarını gösterir
router.get("/blogs/:slug", userController.blogs_details);

// Tüm blog yazılarını listeleme endpoint'i
// URL: /blogs
// Bu endpoint, veritabanındaki tüm blogları listeler
router.get("/blogs", userController.blog_list);

// Blogları listeleme, filtreleme ve sıralama
router.get("/blogs", async (req, res) => {
    const query = req.query.search || ''; // Arama sorgusu
    const selectedCategory = req.query.category || ''; // Seçilen kategori
    const sort = req.query.sort || 'createdAt'; // Sıralama kriteri
    const order = req.query.order === 'asc' ? 1 : -1; // Sıralama yönü: asc veya desc

    let filter = {}; // Blogları filtrelemek için kullanılacak obje

    if (query) {
        filter.baslik = { $regex: query, $options: 'i' }; // Başlıkta arama (case-insensitive)
    }

    if (selectedCategory) {
        // Seçilen kategoriye göre blogları filtrele
        const category = await Category.findOne({ _id: selectedCategory }).populate('blogs').exec();
        filter._id = { $in: category.blogs.map(blog => blog._id) }; // Kategoriye ait blogların ID'lerini filtrele
    }

    try {
        // Blogları çek ve kategorilerle populate et, aynı zamanda sıralama yap
        const blogs = await Blog.find(filter)
            .populate('categories')
            .sort({ [sort]: order })
            .exec();

        // Mevcut kategorileri çek
        const categories = await Category.find({}).exec();

        // Sayfayı render et
        res.render('users/blogs', { 
            blogs, 
            categories, 
            query, 
            selectedCategory,
            sort,
            order,
            title: 'Blog Listesi'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Ana sayfa endpoint'i
// URL: /
// Bu endpoint, uygulamanın ana sayfasını render eder
router.get("/", userController.index);

// Router'ı dışa aktar
// Bu, tanımlanan rotaların uygulamanın diğer bölümlerinde kullanılmasına olanak tanır
module.exports = router;
