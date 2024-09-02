// 'mongoose' modülünü yükler. Mongoose, MongoDB ile etkileşim kurmak için kullanılan bir kütüphanedir.
const mongoose = require('mongoose');
// Mongoose'un 'Schema' sınıfını alır. Schema, veritabanı koleksiyonunun yapısını tanımlar.
const Schema = mongoose.Schema;
const User = require('./user'); // User modelini içe aktar
// Rol verilerini tanımlayan bir Mongoose şeması oluşturur.
const roleSchema = new Schema({
    // 'rolename' alanı, rolün adıdır.
    rolename: {
        type: String,                  // 'rolename' alanı bir dizedir.
        required: true,                // 'rolename' alanının doldurulması zorunludur.
        unique: true,                 // 'rolename' alanı benzersiz olmalıdır (aynı rol adı iki kez kullanılmamalıdır).
        trim: true,                    // Rol adındaki boşlukları otomatik olarak keser.
        lowercase: true,              // Rol adını küçük harfe dönüştürür.
        enum: ['admin', 'moderator', 'guest'] // 'rolename' alanı sadece bu belirtilen değerlerden biri olabilir.
    }
});
roleSchema.pre('remove', async function(next) {
    const usersWithRole = await User.find({ role: this._id });
    if (usersWithRole.length > 0) {
        next(new Error('Bu role atanmış kullanıcılar var, silinemez.'));
    } else {
        next();
    }
});


// 'roleSchema' şemasını 'Role' adında bir model olarak dışa aktarır.
// Bu model, MongoDB koleksiyonlarıyla etkileşim kurmak için kullanılacaktır.
module.exports = mongoose.model('Role', roleSchema);
