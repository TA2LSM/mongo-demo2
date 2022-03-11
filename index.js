const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.error("Couldn't connect to MongoDB!", err);
  });

const courseSchema = new mongoose.Schema({
  //_id: mongoose.ObjectId,
  //bu kısım önceki kodlarda yok. .findById() çalışmadığı için araştırıldı id'ler database'de
  //ObjectId olarak tanımlı olması gerekirken string olduğu için çalışmıyormuş.
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Angular Course",
    author: "TA2LSM",
    tags: ["angular", "frontend"],
    //date: ...
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find(/*{ author: "TA2LSM", isPublished: true }*/)
    //.skip((pageNumber - 1) * pageSize)
    //.limit(pageSize)
    .sort({ name: 1 }); // 1: artan sırada, -1: azalan sırada sırala demek
  //.select({ name: 1, tags: 1 }); // sadece name ve tags alanı dolu olanları bul
  console.log(courses);
}

//getCourses();

//--- 17. Video ---
// async function updateCourse(id) {
//   // Approach 1: Query first, findById(), modify its properties, save()

//   // try {
//   //   // aşağıdaki fonksiyonun callback fonksiyonunun çağırılabilmesi için başına await
//   //   // eklemek gerekli...
//   //   await Course.findById(id, function (err, data) {
//   //     if (err) {
//   //       console.log("The course was not found!");
//   //       return;
//   //     } else {
//   //       console.log(data);
//   //     }
//   //   });
//   // } catch (err) {
//   //   return;
//   // }

//   //const course = await Course.find({ name: "Node.js Course" });
//   //const course = await Course.find({ _id: id });
//   const course = await Course.findById(id); // bu işlem zaman alacağı için async çalışır ve bir promise döner
//   if (!course) {
//     //course objesi NULL ise direkt böyle kontrol edebiliyor
//     console.log("The course was not found!");
//     return;
//   }

//   // Query first bazı durumları kontrol edip değişiklik yapmak için
//   // örneğin kurs zaten yayınlanmışsa yayıncısını değiştirmek olmaz...
//   // if (course.isPublished) {
//   //   console.log("The course has already been published!");
//   //   return;
//   // }

//   console.log(course);

//   // course.isPublished = false;
//   // course.author = "Modified Author!";
//   // Yukarıdaki kodlar yerine aşağıdaki kodlar da kullanılabilir.
//   course.set({
//     isPublished: true,
//     author: "Modified Author!",
//   });
//   //console.log(course);

//   const result = await course.save();
//   console.log(result);
// }

//--- 18. Video ---
// async function updateCourse(id) {
//   // Approach 2: Update first, update directly, optionally get the updated document

//   // Kursta .update() metodu kullanılmış fakat bu metot artık yok. Onun yerine
//   // .findOne() ile adım adım gidildi. Aşağıdaki diğer fonksiyonda başka bir
//   // yöntem kullanıldı.
//   const course = await Course.findOne({ _id: id });
//   if (!course) {
//     //course objesi NULL ise direkt böyle kontrol edebiliyor
//     console.log("The course was not found!");
//     return;
//   }
//   console.log(course);

//   course.set({
//     isPublished: true,
//     author: "Modified Author!",
//   });
//   //console.log(course);

//   const result = await course.save();
//   console.log(result);
// }

async function updateCourse(id) {
  // Approach 2: Update first, update directly, optionally get the updated document
  // MongoDB update operator kısmına kendi web sitesinden bakılabilir.
  // $currentDate, $inc, $min, $max, $mul, $rename, $set, $unSet, $setOnInsert ...vs
  // Fakat burada kurstaki yöntem kullanılamadı için bu operatörlere gerek kalmadı !!!

  // Aşağıdaki iki yöntem de çalışıyor...
  // (1)
  // const result = await Course.findByIdAndUpdate(id, {
  //   isPublished: true,
  //   author: "Modified Author!",
  // });
  // console.log(result);

  // (2)
  const result = await Course.findOneAndUpdate(id, {
    isPublished: true,
    author: "Modified Author!",
  });
  console.log(result);

  const course = await Course.findOne({ _id: id });
  console.log(course);
}

// MongoDB Compass'tan geçerli _id'ler alındı.
//updateCourse("5a68fdf95db93f6477053ddd"); // not published course
updateCourse("5a68fdd7bee8ea64649c2777"); // published course
