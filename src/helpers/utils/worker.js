const {
    Job,
    Queue,
    Worker
} = require('bullmq');

const config = require('../../helpers/config/config');
const Notification = require('../../api/controller/tasks/models/Notification');

const init = () => {
    initEventListener();
};
const processTask = async (job) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (job.data.email) {
        await Notification.create({
            deliveryEmail: job.data.email,
            createdAt: new Date().toISOString()
        });
        console.log(`Notif has been send to ${job.data.email}`);
    }
};
const initEventListener = () => {
    const worker = new Worker('queueCreate', processTask, {
        connection: {
            host: config.get('/redis/redisHost'),
            port: config.get('/redis/redisPort'),
            username: 'default',
            password: config.get('/redis/redisPassword')
        }
    });
};

module.exports = {
    init
};