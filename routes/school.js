const express = require("express");
const router = express.Router();
const db = require("../db");




// formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}


//POST request
router.post("/addSchool",(req,res)=>{
    
   try {

     const {name,address,latitude,longitude}=req.body;
if(!name || !address || latitude==null || longitude==null){
    return res.status(400).json({error:"All fields are mandatory"})
}

if(isNaN(latitude) || isNaN(longitude)){
    return res.status(400).json({error:"Latitude and Longitude must be numbers"})
}

   const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });


    res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
  })
   } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
   }
    
    
})

//End point for listing school through get methiod

router.get("/listSchools",(req,res)=>{
const userLat=parseFloat(req.query.latitude);
const userLon=parseFloat(req.query.longitude);

if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ error: "User latitude and longitude are required!" });
  }

  const sql = "SELECT * FROM schools";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const schoolsWithDistance = results.map((school) => {
      const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return { ...school, distance };
    });
  // sort by nearest first
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  });

})

module.exports=router;