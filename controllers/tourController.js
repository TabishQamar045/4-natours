const Tour = require('../models/toursModel');
const APIFeatures=require('../utils/apiFeatures');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.aliasTopTours = (req, res, next) => {
  // Pre-fill the query string
  Object.assign(req.query, {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
    price: { lte: '1000' }
  });
  next();
}


exports.getAllTours = async (req, res) => {
  try {
    
    // 1A) Building the query
    // const queryObj = {...req.query};
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(el => delete queryObj[el]);
    
    // // 1B) Advanced Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log('Processed query:', queryStr);
    // let query = Tour.find(JSON.parse(queryStr));

  // 2) Sorting
    // if(req.query.sort){
    //   const sortBy=req.query.sort.split(',').join(' ');
    //   query=query.sort(sortBy);
    // }
    // else{
    //   query=query.sort('-createdAt');
    // }

    // 3) Field Limiting
    // if(req.query.fields){
    //   const fields=req.query.fields.split(',').join(' ');
    //   query=query.select(fields);
    // }
    // else{
    //   query=query.select('-__v');
    // }

    // 4) Pagination
    // const page=req.query.page*1 || 1;
    // const limit=req.query.limit*1 || 100;
    // const skip=(page-1)*limit;
    // query=query.skip(skip).limit(limit);

    // if(req.query.page){
    //   const numTours=await Tour.countDocuments();
    //   if(skip>=numTours) throw new Error('This page does not exist');
    // }
    const features=new APIFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
  

    const tours=await features.query;
  

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
 
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
 try{
  const tour=await Tour.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour:tour
    },
  });
 }catch(err){
  res.status(400).json({
    status: 'fail',
    message: err,
  });
 }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats=async(req,res)=>{
  try{
    const stats=await Tour.aggregate([
      {
        $match:{ratingsAverage:{$gte:4.5}}, 
      },
      {
        $group:{
          _id:{$toUpper:'$difficulty'},
          numTours:{$sum:1},
          numRatings:{$sum:'$ratingsQuantity'},
          avgRating:{$avg:'$ratingsAverage'},
          avgPrice:{$avg:'$price'},
          minPrice:{$min:'$price'},
          maxPrice:{$max:'$price'},
        }
      },
      {
        $sort:{avgPrice:1}
      },
      {
        $match:{_id:{$ne:'EASY'}}
      }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        stats: stats
      }
    })
  }catch(err){
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}

exports.getMonthlyPlan=async(req,res)=>{
  try{
    const year=req.params.year*1;
    
    const plan=await Tour.aggregate([
      {
        $unwind:'$startDates'
      },
      {
        $addFields: {
          // Extract year from the date string
          year: { 
            $toInt: { $substr: ['$startDates', 0, 4] }
          },
          // Extract month from the date string
          month: { 
            $toInt: { $substr: ['$startDates', 5, 2] }
          }
        }
      },
      {
        $match: {
          year: year
        }
      },
      {
        $group:{
          _id: '$month',
          numTourStarts:{$sum:1},
          tours:{$push: {
            name: '$name',
            date: '$startDates'
          }}
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0,
          month: 1,
          numTourStarts: 1,
          tours: 1
        }
      },
      {
        $sort:{ month: 1 }
      }
    ])
    res.status(200).json({
      status: 'success',
      results:plan.length,
      data: {
        plan: plan
      }
    })
  }catch(err){
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}