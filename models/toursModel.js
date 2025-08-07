const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a max group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  rating: {
    type: Number,
    default: 4.5
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  summary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String
  },
  images: [String],
  startDates: [String],  // Keep as String for now since data is in string format
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  secretTour:{
    type:Boolean,
    default:false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function(){
  return this.duration/7;
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save',function(next){
  this.slug=slugify(this.name, {lower:true});
  next();
})

tourSchema.post('save',function(doc,next){
  console.log(doc);
  next();
})

// QUERY MIDDLEWARE
tourSchema.pre(/^find/,function(next){
  this.find({secretTour:{$ne:true}});
  next();
})

tourSchema.post(/^find/,function(docs,next){
  console.log(docs);
  next();
})

// AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate',function(next){
  console.log(this.pipeline());
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
  next();
})



const Tour = mongoose.model('Tour', tourSchema);


module.exports = Tour;
