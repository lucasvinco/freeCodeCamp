const User = require('../models/user');
const Exercise = require('../models/exercise');

function checkDate(date) {
    let re = new RegExp(/^[0-9]{4,4}-[0-1]{1,1}[0-9]{1,1}-[0-3]{1,1}[0-9]{1}/);

    if (re.test(date)) {
        return date;
    } else {
        return Date.now();
    }
}

exports.addExercise = async function (req, res, next) {
    const userId = req.body.userId;
    let user = await User.find({ _id: userId });

    if (user && user.length > 0) {
        let exercise = new Exercise({
            description: req.body.description,
            duration: req.body.duration,
            date: checkDate(req.body.date),
            username: user[0].username,
            userId: user[0]._id
        });

        try {
            await exercise.save();

            res.json({
                username: exercise.username, description: exercise.description, duration: exercise.duration,
                _id: exercise.userId, date: (new Date(exercise.date)).toDateString()
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    } else {
        res.send("Invalid userId");
    }
}

exports.findAllByUser = async function (req, res, next) {
    const userId = req.query.userId;
    let user = await User.find({ _id: userId });
    let from = new Date(req.query.from);
    let to = new Date(req.query.to);

    if (user && user.length > 0) {
        let exercises;
        try {
            exercises = await Exercise.find({
                userId: userId,
                date: {
                    $gte: from != 'Invalid Date' ? from.getTime() : 0,
                    $lte: to != 'Invalid Date' ? to.getTime() : Date.now()
                }
            })
            .select({
                _id: 0,
                __v: 0
            })
            .limit(parseInt(req.query.limit));

            res.json({
                _id: user[0]._id, username: user[0].username, from: from != 'Invalid Date' ? from.toDateString() : undefined,
                to: to != 'Invalid Date' ? to.toDateString() : undefined, count: exercises.length, log: exercises.map(e => ({
                    description: e.description,
                    duration: e.duration,
                    date: e.date.toDateString()
                }))
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    } else {
        res.send("Invalid userId");
    }
}