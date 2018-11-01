const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MOngoDB...', err));

const courseSchema = new mongoose.Schema({
    _id: String,
    name: String,
    author: String,
    tags: [String],
    date: Date,
    isPublished: Boolean,
    price: Number,
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['angular', 'frontend'],
        isPublished: true,
    });

    const result = await course.save();
    console.log(result);
}

async function getCourses() {
    const courses = await Course
        .find({ author: 'Mosh', isPublished: true })
        .limit(10)
        .sort({ name: 1 }) // 1: asc, -1: desc
        .select({ name: 1, tags: 1, isPublished: 1 })
    console.log(courses);
}
async function getCoursesByComparison() {
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte ( greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)

    const courses = await Course
        .find({ price: { $gte: 10, $lte: 20 } }) // .find({ price: { $in: [10, 15, 20] } })
        .limit(10)
        .sort({ name: 1 }) // 1: asc, -1: desc
        .select({ name: 1, tags: 1 })
    console.log(courses);
}

async function getCoursesByLogical() {
    // or
    // and
    const courses = await Course
        .find()
        .or([{ author: 'Mosh' }, { isPublished: true }]) // .and([])
        .limit(10)
        .sort({ name: 1 }) // 1: asc, -1: desc
        .select({ name: 1, tags: 1 })
    console.log(courses);
}
async function getCoursesByRegularExpression() {
    // Starts with Mosh
    // .find({ author: /^Mosh/ })
    // Ends with Hamedani, case insensitive 
    // .find({author:/Hamedani$/i})
    // Contains Mosh, case insensitive 
    // .find({author: /.*Mosh.*/i})

    const courses = await Course
        .find({ author: /^Mosh/ })
        .limit(10)
        .sort({ name: 1 }) // 1: asc, -1: desc
        .select({ name: 1, tags: 1 })
    console.log(courses);
}

async function getCoursesCount() {
    const courses = await Course
        .find({ author: 'Mosh', isPublished: true })
        .limit(10)
        .sort({ name: 1 }) // 1: asc, -1: desc
        .count();
    console.log(courses);
}

async function getCoursesWithPagenation() {
    const pageNumber = 2;
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10
    const courses = await Course
        .find({ author: 'Mosh', isPublished: true })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ name: 1 }) // 1: asc, -1: desc
        .select({ name: 1, tags: 1 })
    console.log(courses);
}

async function updateCourse(id) {
    const course = await Course.findById(id);
    if (!course) return;
    course.isPublished = true;
    course.author = 'Another Author';
    // course.set({
    //     isPublished: true,
    //     author: 'Another Author',
    // }); // same way
    const result = await course.save()
    console.log(result);
    console.log(await Course.find());
}

async function updateCourseDirectly(id) {
    // mongodb update operators 를 검색하면 update시 사용할 수 있는 연산자들이 나온다. 보고 참고하자.
    const result = await Course.update({ _id: id }, {
        $set: {
            author: 'Mosh',
            isPublished: false,
        }
    });

    console.log(result);
}

async function updateCourseAndFind(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: false,
        }
    }, { new: true }); // new 옵션을 주지 않으면 업데이트 전 데이터가 리턴된다.

    console.log(course);
}

async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id });
    console.log(result);
}

async function removeCourseAndFind(id) {
    // const result = await Course.deleteMany({ _id: id });
    const course = await Course.findByIdAndDelete(id);
    console.log(course);

}
removeCourseAndFind('5a68fdf95db93f6477053ddd');
