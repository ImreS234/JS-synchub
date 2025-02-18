
// Modulok importálása
const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const db = require('./data'); // Importáljuk az adatbázis kapcsolatot

// Express példány létrehozása
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validációs sémák importálása
const { employeeSchema, employmentContractSchema, equipmentSchema } = require('./validation');

// Végpontok az employees táblához

// Új alkalmazott felvitele
app.post('/api/v1/employees', (req, res) => {
    const { error } = employeeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { idCardNum, lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID } = req.body;

    db.run(`INSERT INTO employees (idCardNum, lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [idCardNum, lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Új alkalmazott sikeresen hozzáadva', idCardNum });
            }
        });
});

// Alkalmazottak lekérése
app.get('/api/v1/employees', (req, res) => {
    db.all(`SELECT * FROM employees`, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.send(rows);
    });
});

// Alkalmazott adatainak frissítése
app.put('/api/v1/employees/:idCardNum', (req, res) => {
    const { idCardNum } = req.params;
    const { error } = employeeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID } = req.body;

    db.run(`UPDATE employees SET lastName = ?, middleName = ?, firstName = ?, email = ?, pass = ?, job = ?, phoneNumber = ?, homeAddress = ?, taxNum = ?, socialSecNum = ?, dateOfBirth = ?, placeOfBirth = ?, bankAccountNumber = ?, supervisorID = ? WHERE idCardNum = ?`,
        [lastName, middleName, firstName, email, pass, job, phoneNumber, homeAddress, taxNum, socialSecNum, dateOfBirth, placeOfBirth, bankAccountNumber, supervisorID, idCardNum],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Alkalmazott adatai frissítve', idCardNum });
            }
        });
});

// Alkalmazott törlése
app.delete('/api/v1/employees/:idCardNum', (req, res) => {
    const { idCardNum } = req.params;

    db.run(`DELETE FROM employees WHERE idCardNum = ?`, [idCardNum],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Alkalmazott törölve' });
            }
        });
});

// Végpontok az employmentcontracts táblához

// Új szerződés felvitele
app.post('/api/v1/employmentcontracts', (req, res) => {
    const { error } = employmentContractSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { employee, startDate, endDate, hourlyRates, working_hours } = req.body;

    db.run(`INSERT INTO employmentcontracts (employee, startDate, endDate, hourlyRates, working_hours) 
            VALUES (?, ?, ?, ?, ?)`,
        [employee, startDate, endDate, hourlyRates, working_hours],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Új szerződés sikeresen hozzáadva', id: this.lastID });
            }
        });
});

// Szerződések lekérése
app.get('/api/v1/employmentcontracts', (req, res) => {
    db.all(`SELECT * FROM employmentcontracts`, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.send(rows);
    });
});

// Szerződés frissítése
app.put('/api/v1/employmentcontracts/:contractID', (req, res) => {
    const { contractID } = req.params;
    const { error } = employmentContractSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { employee, startDate, endDate, hourlyRates, working_hours } = req.body;

    db.run(`UPDATE employmentcontracts SET employee = ?, startDate = ?, endDate = ?, hourlyRates = ?, working_hours = ? WHERE contractID = ?`,
        [employee, startDate, endDate, hourlyRates, working_hours, contractID],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Szerződés frissítve', contractID });
            }
        });
});

// Szerződés törlése
app.delete('/api/v1/employmentcontracts/:contractID', (req, res) => {
    const { contractID } = req.params;

    db.run(`DELETE FROM employmentcontracts WHERE contractID = ?`, [contractID],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Szerződés törölve' });
            }
        });
});

// Végpontok az equipment táblához

// Új eszköz felvitele
app.post('/api/v1/equipment', (req, res) => {
    const { error } = equipmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks } = req.body;

    db.run(`INSERT INTO equipment (equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Új eszköz sikeresen hozzáadva', id: this.lastID });
            }
        });
});

// Eszközök lekérése
app.get('/api/v1/equipment', (req, res) => {
    db.all(`SELECT * FROM equipment`, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.send(rows);
    });
});

// Eszköz frissítése
app.put('/api/v1/equipment/:equipmentID', (req, res) => {
    const { equipmentID } = req.params;
    const { error } = equipmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks } = req.body;

    db.run(`UPDATE equipment SET equipmentName = ?, serial_number = ?, purchase_date = ?, status = ?, employee = ?, last_service_date = ?, warranty_expiration = ?, remarks = ? WHERE equipmentID = ?`,
        [equipmentName, serial_number, purchase_date, status, employee, last_service_date, warranty_expiration, remarks, equipmentID],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Eszköz frissítve', equipmentID });
            }
        });
});

// Eszköz törlése
app.delete('/api/v1/equipment/:equipmentID', (req, res) => {
    const { equipmentID } = req.params;

    db.run(`DELETE FROM equipment WHERE equipmentID = ?`, [equipmentID],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: 'Eszköz törölve' });
            }
        });
});

// Szerver elindítása a 3000-es porton
app.listen(port, () => {
    console.log(`A szerver fut a ${port}-es számú porton.`)
});