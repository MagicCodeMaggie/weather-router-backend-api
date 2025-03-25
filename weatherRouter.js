const express = require('express');
//create a router instance
const weatherRouter = express.Router();

//js中的key都不带引号，json中的key都要求带引号，而且必须双引号
let data = [
    {
        activity: ['morning jog', 'breakfast', 'work', 'lunch', 'gym'],
        weather: 'sunny',
    },
    {
        activity: ['work', 'coffee break', 'meetings', 'dinner', 'movie'],
        weather: 'cloudy',
    },
    {
        activity: ['weekend', 'hiking', 'picnic', 'reading', 'gardening'],
        weather: 'rainy',
    }
]

//GET retrieve the evtire list
//http://localhost:8000/api/list

weatherRouter.get('/list', (req, res) => {
    res.send(data);
});

//GET items by query parameter    ?activity=work
//http://localhost:8000/api/activities?activity=work

weatherRouter.get('/activities', (req, res) => {
    const activityToFind = req.query.activity;
    if (!activityToFind) {
        return res.status(400).send('Activity parameter is missiong');
    }
    const foundItems = data.filter(item => item.activity.includes(activityToFind));
    if (!foundItems.length) {
        return res.status(404).send('No items found');
    }
    res.send(foundItems);
})

//POST add a new item  存在body中，理论上信息大小不受限制，可以用req.body
//http://localhost:8000/api/list
weatherRouter.post('/activities', (req, res) => {
    console.log("body", req.body); //只写这句是不会打印body的，index.js中添加app.use(express.json());
    const { activity, weather } = req.body;
    if (!activity || !weather) {
        return res.status(400).send('Activity and weather are required');
    }
    data.push(req.body);
    res.status(201).send({ msg: 'Item added successfully' });
})

//GET activities based on weather condition  动态参数:condition匹配上sunny  /api/activities/weather/:condition
//http://localhost:8000/api/activities/weather/sunny
weatherRouter.get('/activities/weather/:condition', (req, res) => {
    const foundItems = data.filter(item => item.weather === req.params.condition);
    if (!foundItems.length) {
        return res.status(404).send('No items found');
    }
    res.send(foundItems);
})

//Delete items based on weather condition   /api/activities/weather/:condition
//http://localhost:8000/api/activities/weather/rainy
weatherRouter.delete('/activities/weather/:condition', (req, res) => {
    const foundItems = data.filter(item => item.weather === req.params.condition);
    if (!foundItems.length) {
        return res.status(404).send('No items found');
    }
    //或者用index判断也行，Ally老师写法
    // const index = data.findIndex(item => item.weather === req.params.condition);
    // if (index === -1) {
    //     return res.status(404).send('No items found');
    // }
    data = data.filter(item => item.weather !== req.params.condition);
    res.send({ msg: 'Items deleted successfully' });
})

module.exports = weatherRouter;