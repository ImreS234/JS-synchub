// Modulok importálása
const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const db = require('./data'); // Az adatbázis kapcsolat importálása

// Express példány létrehozása
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validációs sémák definiálása
const employeeSchema = Joi.object({
    idCardNum: Joi.string().max(15).required(),
    lastName: Joi.string().max(50).required(),
    middleName: Joi.string().max(50).allow(null, ''),
    firstName: Joi.string().max(50).required(),
    email: Joi.string().email().max(255).required(),
    pass: Joi.string().max(255).required(),
    job: Joi.number().integer().required(),
    phoneNumber: Joi.string().max(25).allow(null, ''),
    homeAddress: Joi.number().integer().required(),
    taxNum: Joi.string().max(20).allow(null, ''),
    socialSecNum: Joi.string().max(20).allow(null, ''),
    dateOfBirth: Joi.date().iso(),
    placeOfBirth: Joi.string().max(255).allow(null, ''),
    bankAccountNumber: Joi.string().max(34).allow(null, ''),
    supervisorID: Joi.string().max(15).allow(null, '')
});

const contractSchema = Joi.object({
    employee: Joi.string().max(15).required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().allow(null, ''),
    hourlyRates: Joi.number().integer().required(),
    working_hours: Joi.number().integer().required()
});

const equipmentSchema = Joi.object({
    equipmentName: Joi.string().max(255).required(),
    serial_number: Joi.string().max(255).required(),
    purchase_date: Joi.date().iso().required(),
    status: Joi.string().max(255).required(),
    employee: Joi.string().max(15).required(),
    last_service_date: Joi.date().iso().allow(null, ''),
    warranty_expiration: Joi.date().iso().required(),
    remarks: Joi.string().allow(null, '')
});

// Végpontok

// Employees végpontok
app.post('/api/v1/employees', (req, res) => {
    const { error } = employeeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { idCardNum, lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID } = req.body;

    db.run(`INSERT INTO employees (idCardNum, lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [idCardNum, lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Alkalmazott sikeresen hozzáadva', idCardNum });
        });
});

app.get('/api/v1/employees', (req, res) => {
    db.all(`SELECT * FROM employees`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/v1/employees/:idCardNum', (req, res) => {
    const { error } = employeeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { idCardNum } = req.params;
    const { lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID } = req.body;

    db.run(`UPDATE employees SET lastName = ?, middleName = ?, firstName = ?, email = ?, pass = ?, job = ?, phoneNumber = ?, homeAddress = ?, taxNum = ?, socialSecNum = ?, dateOfBirth = ?, placeOfBirth = ?, bankAccountNumber = ?, supervisorID = ? WHERE idCardNum = ?`,
        [lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID, idCardNum],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Alkalmazott adatai frissítve', idCardNum });
        });
});

app.delete('/api/v1/employees/:idCardNum', (req, res) => {
    const { idCardNum } = req.params;

    db.run(`DELETE FROM employees WHERE idCardNum = ?`, [idCardNum], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Alkalmazott törölve', idCardNum });
    });
});

// Employment Contracts végpontok
app.post('/api/v1/contracts', (req, res) => {
    const { error } = contractSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { employee, startDate, endDate, hourlyRates, working_hours } = req.body;

    db.run(`INSERT INTO employmentcontracts (employee, startDate, endDate, hourlyRates, working_hours) 
            VALUES (?, ?, ?, ?, ?)`,
        [employee, startDate, endDate, hourlyRates, working_hours],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Szerződés sikeresen hozzáadva', id: this.lastID });
        });
});

app.get('/api/v1/contracts', (req, res) => {
    db.all(`SELECT * FROM employmentcontracts`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/v1/contracts/:id', (req, res) => {
    const { error } = contractSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { id } = req.params;
    const { employee, startDate, endDate, hourlyRates, working_hours } = req.body;

    db.run(`UPDATE employmentcontracts SET employee = ?, startDate = ?, endDate = ?, hourlyRates = ?, working_hours = ? WHERE contractID = ?`,
        [employee, startDate, endDate, hourlyRates, working_hours, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Szerződés frissítve', id });
        });
});

app.delete('/api/v1/contracts/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM employmentcontracts WHERE contractID = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Szerződés törölve', id });
    });
});

// Equipment végpontok
app.post('/api/v1/equipment', (req, res) => {
    const { error } = equipmentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks } = req.body;

    db.run(`INSERT INTO equipment (equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Eszköz sikeresen hozzáadva', id: this.lastID });
        });
});

app.get('/api/v1/equipment', (req, res) => {
    db.all(`SELECT * FROM equipment`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/v1/equipment/:id', (req, res) => {
    const { error } = equipmentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { id } = req.params;
    const { equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks } = req.body;

    db.run(`UPDATE equipment SET equipmentName = ?, serial_number = ?, purchase_date = ?, status = ?, employee = ?, last_service_date = ?, warranty_expiration = ?, remarks = ? WHERE equipmentID = ?`,
        [equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Eszköz frissítve', id });
        });
});

app.delete('/api/v1/equipment/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM equipment WHERE equipmentID = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Eszköz törölve', id });
    });
});

// Szerver elindítása
app.listen(port, () => {
    console.log(`A szerver fut a ${port}-es számú porton.`);
});