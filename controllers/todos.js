const Todo = require('../models/Todo')
const Task = require("../models/Task")

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        try{
            const taskItems = await Task.find({userId:req.user.id})
            // const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.render('todos.ejs', {todos: taskItems, user: req.user})
            // res.json(taskItems)
        }catch(err){
            console.log(err)
            res.status(404).send(err.message)
        }
    },
    //just added the fields we want
    createTodo: async (req, res)=>{
        const {task, day, month, startTime, endTime} = req.body
        const timeCompare = startTime > endTime
        const validationErrors = []
        try{
    if (!task || !day || !month) validationErrors.push({ msg: 'Please enter a task.' })
    if (timeCompare) validationErrors.push({ msg: 'Task end time must be after start time' })
    if (validationErrors.length) {
        req.flash('errors', validationErrors)
        return res.redirect('/todos')
      }

           await Task.create({
                task: task,
                day: day,
                month: month,
                startTime: startTime,
                endTime: endTime,
                completed: false,
                userId: req.user.id
            })
            // req.flash("success", "Task added")

            res.redirect('/todos')
        }catch(err){
            res.status(400).send(err.message)
        }
    },
    //original function
    // createTodo: async (req, res)=>{
    //     try{
    //         await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id})
    //         console.log('Todo has been added!')
    //         res.redirect('/todos')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },
    markComplete: async (req, res)=>{
        try{
            const task = await Task.findOne({_id: req.body.todoIdFromJSFile})

            if(!task){
                console.log('not found')
            }
           
            await Task.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })

            if(task.completed == true){
                await Task.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                    completed: false
                })
            }

            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
            res.status(400).send(err.message)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
            res.status(400).send(err.message)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Task.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
            res.status(400).send(err.message)
        }
    },
    //get todos based on url params like /todos/oct/10
    // only get todos with month of oct and day of 10
    //sends tasks back in json
    getTodosByDate: async (req,res) => {
        try {
            const tasks = await Task.find({userId: req.user.id, month: req.params.month, day: req.params.day }).sort({completed: 1})
            res.json(tasks)
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    },

    addDefaultTasks: async (user) => {
        const hitlist = {
            task: "Completed hitlist due",
            day: "13",
            month: "8",
            userId: user.id
        };
        const client = {
            task: "Paid Client Contract, Volunteer For Grass Org, or Actual Open Source PR due",
            day: "27",
            month: "8",
            userId: user.id
        };
        const mvp100Hours = {
            task: "100 Hours Project Beautiful MVP due",
            day: "27",
            month: "8",
            userId: user.id
        };
        const complete100Hours = {
            task: "Complete 100 Hours Project due",
            day: "11",
            month: "9",
            userId: user.id
        };
        const premiumApps = {
            task: "10 Premium Apps due",
            day: "11",
            month: "9",
            userId: user.id
        };
        const pushCode = () => {
            return { task: "push code to github" };
        }
        const codewars = () => {
            return { task: "coding challenge" };
        }
        const banki = () => {
            return { task: "BANKI" };
        }
        const anki = () => {
            return { task: "ANKI" };
        }

        const tasksToAdd = [hitlist, client, mvp100Hours, complete100Hours, premiumApps];

        let currDate = new Date(Date.now());
        const endDate = new Date("2022", "10", "1"); // November 1, 2022

        while(currDate.getMonth() != endDate.getMonth() || currDate.getDate() != endDate.getDate()) {
            const newPushCode = pushCode();
            const newCodewars = codewars();
            const newBanki = banki();
            const newAnki = anki();

            newPushCode.day = currDate.getDate();
            newPushCode.month = currDate.getMonth();
            newPushCode.userId = user.id

            newCodewars.day = currDate.getDate();
            newCodewars.month = currDate.getMonth();
            newCodewars.userId = user.id

            newBanki.day = currDate.getDate();
            newBanki.month = currDate.getMonth();
            newBanki.userId = user.id
          
            newAnki.day = currDate.getDate();
            newAnki.month = currDate.getMonth();
            newAnki.userId = user.id

            tasksToAdd.push(newAnki);
            tasksToAdd.push(newBanki);
            tasksToAdd.push(newPushCode);
            tasksToAdd.push(newCodewars);

            console.log(currDate);
            console.log(endDate);

            currDate.setDate(currDate.getDate() + 1);
        }
        
        await Task.insertMany(tasksToAdd);
    }
}    