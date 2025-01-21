const Home = {
    template: `
        <div>
            <h1>Ласкаво просимо до системи управління коледжем</h1>
            <p>Використовуйте меню для навігації.</p>
        </div>
    `
};

const Students = {
    template: `
        <div>
            <h1>Студенты</h1>
            <form @submit.prevent="addStudent">
                <input v-model="newStudent.name" placeholder="Имя" required>
                <select v-model="newStudent.group_id" required>
                    <option value="">Выберите группу</option>
                    <option v-for="group in groups" :value="group.id">{{ group.name }}</option>
                </select>
                <button type="submit">Добавить студента</button>
            </form>
            <table>
                <tr>
                    <th>Имя</th>
                    <th>Группа</th>
                    <th>Обновить</th>
                    <th>Удалить</th>
                </tr>
                <tr v-for="student in students" :key="student.id">
                    <td><input v-model="student.name"></td>
                    <td>
                        <select v-model="student.group_id">
                            <option v-for="group in groups" :value="group.id">{{ group.name }}</option>
                        </select>
                    </td>
                    <td><button @click="updateStudent(student)">Обновить</button></td>
                    <td><button @click="deleteStudent(student.id)">Удалить</button></td>
                </tr>
            </table>
        </div>
    `,
    data() {
        return {
            students: [],
            groups: [],
            newStudent: {
                name: '',
                group_id: ''
            }
        };
    },
    methods: {
        fetchData() {
            axios.get('/college/index.php/students/getData')
                .then(response => {
                    this.students = response.data.students;
                    this.groups = response.data.groups;
                })
                .catch(error => console.error(error));
        },
        addStudent() {
            axios.post('/college/index.php/students/addStudent', this.newStudent)
                .then(() => {
                    this.newStudent = { name: '', group_id: '' };
                    this.fetchData();
                })
                .catch(error => console.error(error));
        },
        updateStudent(student) {
            axios.post('/college/index.php/students/actions', {
                id: student.id,
                name: student.name,
                group_id: student.group_id,
                update: true
            }).then(() => this.fetchData())
              .catch(error => console.error(error));
        },
        deleteStudent(id) {
            axios.post('/college/index.php/students/actions', {
                id: id,
                delete: true
            }).then(() => this.fetchData())
              .catch(error => console.error(error));
        }
    },
    mounted() {
        this.fetchData();
    }
};

const Subjects = {
    template: `
        <div>
            <h1>Предметы</h1>
            <form @submit.prevent="addSubject">
                <input v-model="newSubject" placeholder="Название предмета" required>
                <button type="submit">Добавить</button>
            </form>
            <ul>
                <li v-for="subject in subjects" :key="subject.id">
                    {{ subject.name }}
                    <button @click="deleteSubject(subject.id)">Удалить</button>
                </li>
            </ul>
        </div>
    `,
    data() {
        return {
            subjects: [],
            newSubject: ''
        };
    },
    methods: {
        fetchSubjects() {
            axios.get('/college/index.php/subjects/getData')
                .then(response => {
                    this.subjects = response.data;
                })
                .catch(error => console.error(error));
        },
        addSubject() {
            axios.post('/college/index.php/subjects/addSubject', { name: this.newSubject })
                .then(() => {
                    this.newSubject = '';
                    this.fetchSubjects();
                })
                .catch(error => console.error(error));
        },
        deleteSubject(id) {
            axios.post('/college/index.php/subjects/deleteSubject', { id })
                .then(() => this.fetchSubjects())
                .catch(error => console.error(error));
        }
    },
    mounted() {
        this.fetchSubjects();
    }
};

const routes = [
    { path: '/', component: Home },
    { path: '/students', component: Students },
    { path: '/subjects', component: Subjects }
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    router
});
