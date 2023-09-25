const express = require("express");
const EmployeeRouter = express.Router();
const EmployeeModel = require("../Models/employeeModel");

// Add Employee
EmployeeRouter.post('/add', async (req, res) => {
  const { firstName, lastName, email, department, salary } = req.body;
  const newEmployee = new EmployeeModel({
    firstName,
    lastName,
    email,
    department,
    salary,
  });

  try {
    const employee = await newEmployee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve employees with pagination, filter, sorting, and search
EmployeeRouter.get('/', async (req, res) => {
  const { page = 1, limit = 5, department, sortBy, search } = req.query;

  const query = {};
  if (department) {
    query.department = department;
  }
  if (search) {
    query.firstName = { $regex: search, $options: 'i' }; // Case-insensitive search
  }

  const sortOptions = {};
  if (sortBy === 'salary') {
    sortOptions.salary = 1; // Sort by salary in ascending order
  }

  try {
    const totalEmployees = await EmployeeModel.countDocuments(query);
    const employees = await EmployeeModel.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    res.status(200).json({ employees, totalEmployees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an employee
EmployeeRouter.patch('/edit/:id', (req, res) => {
  const employeeId = req.params.id;
  const updateFields = req.body;

  EmployeeModel.findByIdAndUpdate(
    employeeId,
    { $set: updateFields },
    { new: true },
    (err, updatedEmployee) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(updatedEmployee);
      }
    }
  );
});

// Delete an employee
EmployeeRouter.delete('/delete/:id', (req, res) => {
  const employeeId = req.params.id;

  EmployeeModel.findByIdAndRemove(employeeId, (err, removedEmployee) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(removedEmployee);
    }
  });
});

module.exports = {
  EmployeeRouter
};
