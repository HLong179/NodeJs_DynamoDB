const express = require('express');
const cors =  require('cors');
const bodyParser = require('body-parser');
const {UserServices} = require('./services/userServices');


const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/addUser', async (req, res) => {
    try {
        const data = await new UserServices().addNewUser(req.body);
        res.send(data);
    } catch (error) {````
        res.send(error);
    }
});

app.get('/queryAllUsersByCustomerId', async (req, res) => {
    try {
        const data =  await new UserServices().queryAllUsersByCustomerId(req.query.customerId);
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

app.get('/getUserByCustomerIdAndEmail', async (req, res) => {
    try {
        const data = await new UserServices().getUserByCustomerIdAndEmail(req.query.customerId, req.query.email);
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

app.get('/scanUsers', async (req, res) => {
    try {
        const data = await new UserServices().scanUserTable();
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

app.delete('/deleteUserByEmail', (req, res) => {
    if (!req.query.email) {
        res.status(404).send('email not found');
    }

    new UserServices().deleteUserByEmail(req.query.email)
    .then(response => {
        res.status(200).send(response);
    })
    .catch(err => {
        res.status(400).send(err)
    })
});

app.post('/updateUser', async (req, res) => {
    try {
        const data = await new UserServices().updateUserInfo(req.body);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/batchWriteUsers', async (req, res) => {
    try {
        const data = await new UserServices().batchWriteUsers(req.body.startIndex, req.body.count);
        console.log('data: ', data);
        res.send(data);
    } catch (error) {
        res.status(400).send(error)
    }
});

app.get('/batchReadUsers', async(req, res) => {
    try {
        const data = await new UserServices().batchReadUsers();
        res.send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});


app.post('/batchDeleteUsers', async (req, res) => {
    try {
        const data = await new UserServices().batchDeleteUsers(req.body.emails);
        res.send(data);
    } catch (error) {
        res.status(400).send(error)
    }
});

app.get('/getUserByRole', async (req, res) => {
    try {
        const data = await new UserServices().getUserByRole(req.query.role);
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

app.get('/getUserByRoleAndGender', async (req, res) => {
    try {
        const data = await new UserServices().getUserByRoleAndGender(req.query.role, req.query.gender);
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

app.listen(port, () => {
    console.log('App is listening at port ', port);
})