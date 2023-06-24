const express = require('express');

const mongoose = require('mongoose');

const User = require('../models/User');

const allUsers = async (req, res) => {
    try {
        if(req.query.search===''){
            res.status(200).json({success:true,users:[]});
            return;
        }
        const keyword = req.query.search!=='' ? {
            $or:[
                {firstName: {$regex: req.query.search,$options: 'i'}},
                {email: {$regex: req.query.search,$options: 'i'}}
            ]
        } : {}

        const users = await User.find({...keyword}).find({email:{$ne:req.user.email}}).select('-password -loginDates -assignmentsAssign -assignmentsSubmitted -lastotp -memeberGrps -filePosted -checkReset  ');

        res.status(200).json({success:true,users});


    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
}

module.exports = {allUsers};

