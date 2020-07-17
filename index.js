const cron = require("node-cron")
const express = require("express")
const fs = require("fs")
const { time } = require("console")


const app = express()

//create an empty new with Date.now() function
app.get("/create_file", (req, res) => {
    const filePath = './logs/' + Date.now() + '.txt';
    fs.closeSync(fs.openSync(filePath, 'w'))
    res.send(filePath + " Created..")
})

// Delete random file from directory
app.get("/delete_random_file", (req, res) => {
    const path = './logs';

    fs.readdir(path, (err, files) => {
        if (err) {
            res.send(err)
        }
        if (files.length > 0) {
            //get random file name to delete
            let random_file = files[Math.floor(Math.random() * files.length)]

            fs.unlink(path + "/" + random_file, (err) => {
                if (err) res.send(err)

                res.send(
                    {
                        "pre_list": files,
                        'deleted': random_file
                    }
                )
            })
        }

    })
})
app.get("/schduler", (req, res) => {
    // one minute
    cron.schedule("* * * * *", function () {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        let data = `[log] ${dateTime} - ${req.method} - ${JSON.stringify(req.params)}\n`;
        fs.appendFile('./logs/scheduler.log', data, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    });

    res.send("fired...!!!")
})


app.listen(3128)
