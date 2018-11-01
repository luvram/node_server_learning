const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MOngoDB...', err));

const courseSchema = new mongoose.Schema({
    // _id: String,
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        // uppercase: true,
        trim: true,
    },
    author: String,
    tags: {
        type: [String],
        validate: {
            // isAsync: true, // validator 내에서 async 동작을 해야할 경우에는 이 값을 true 로 주고, validator 의 두번째 인자로 callback 을 지정해준다. 그러면 validator 의 동작이 끝날때까지 기다려준다? ex. API, filesystem 호출 등
            validator: function (v, callback) {
                // setTimeout(() => {
                //     // Do some async work
                //     const result = v && v.length > 0;
                //     callback(result);
                // }, 4000);
                return v && v.length > 0;
            },
            message: 'A course sould have at least one tag.'
        }
    },
    date: Date,
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () { return this.isPublished; }, // this 때문에 arrow function 은 쓸 수 없다.
        min: 10,
        max: 200,
        get: v => Math.round(v), // DB에서 데이터를 가져올때 소수점값을 반올림 한다.
        set: v => Math.round(v), // 입력값이 15.8 이 들어오면 16으로 세팅해준다.
    },
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Angular Course2',
        category: 'Web',
        author: 'Mosh',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
    });

    try {
        // await course.validate();
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        for (field in ex.errors)
            console.log(ex.errors[field].message);
    }

}

async function getCourses() {
    const courses = await Course
        .find({ author: 'Mosh', isPublished: true })
        .limit(10)
        .sort({ name: 1 }) // 1: asc, -1: desc
        .select({ name: 1, tags: 1, isPublished: 1 })
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

async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id });
    console.log(result);
}

createCourse();