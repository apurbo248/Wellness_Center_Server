const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const fileupload = require('express-fileupload');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs-ex');
const app = express();
app.use(cors());
app.use(express.static('upload'));
app.use(fileupload());
app.use(bodyParser.json({limit:'50mb'}))
app.use(express.json());


const uri=`mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.e7vcv.mongodb.net/${process.env.name}?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  if(!err){
    console.log("connected");
    const coursesCollection = client.db("yogaCenter").collection("courses");
    const teacherCollection = client.db("yogaCenter").collection("teacher");
    const orderCollection = client.db("yogaCenter").collection("order");
    const reviewCollection = client.db("yogaCenter").collection("review");
    const adminCollection = client.db("yogaCenter").collection("admin");


    app.post('/add_course',(req,res)=>{
        const file = req.files.file;
        const name = req.body.name;
        const totalDay = req.body.totalDay;
        const days = req.body.days;
        const price = req.body.price;
        const address = req.body.address;
        const introduction = req.body.introduction;
        const level = req.body.level;
        const openDate = req.body.openDate;
        const nextDate = req.body.nextDate;
        const from = req.body.from;
        const to = req.body.to;
        const teacher = req.body.teacher;
       
        console.log(name,totalDay,price,days,address,introduction ,openDate, nextDate,from,to,level,teacher);
        const filePath = `${__dirname}/upload/${file.name}`
        
        file.mv(filePath,err =>{
            if(err){
                console.log(err);
                return res.status(500).send({msg:"Failed to upload image"});
            }    
             const newImage = fs.readFileSync(filePath);
             const encImg = newImage.toString('base64');

             var image = {
                 Type:req.files.file.mimetype,
                 size : req.files.file.size,
                 img : Buffer(encImg, 'base64')
             }
            
             coursesCollection.insertOne({name,totalDay,price,days,level,address,introduction ,openDate, nextDate,from,to,teacher,image})
             .then(result =>{
               console.log(result);
                 fs.remove(filepath,err =>{
                     if(err){
                         console.log(err);
                        res.status(500).send({msg:"Failed to upload image"});
                     }                    
                 })
                 res.send(result.insertedCount>0);            
            })                  
        }) 
 })
 
 app.get('/get_all_course', (req, res) =>{
    coursesCollection.find()
    .toArray((err, course) =>{
     res.send(course);
    })
  })

  app.delete('/get_all_course/:id', (req, res)=>{
    const id = ObjectId(req.params.id);
    coursesCollection.deleteOne({_id:id})
    .then(document=> {
      res.send("deleted")
      console.log(document)
    })
  
  })
  app.get('/get_a_course/:id', (req, res) =>{
    const id = ObjectId(req.params.id);
    coursesCollection.find({_id: id})
    .toArray((err, course) =>{
     res.send(course[0]);
    })
      })

   app.patch('/update/:id',(req,res) =>{
   
        const id = ObjectId(req.params.id);
        coursesCollection.updateOne({_id:id},{
          $set:{
            //file : req.files.file,
             name : req.body.name,
             totalDay : req.body.totalDay,
             days : req.body.days,
             price : req.body.price,
             address : req.body.address,
             introduction : req.body.introduction,
             level : req.body.level,
             openDate : req.body.openDate,
             nextDate : req.body.nextDate,
             from : req.body.from,
             to : req.body.to,
             teacher : req.body.teacher
          }
          })
          .then(result=> {
            
          })   
        })


  app.post('/add_teacher',(req,res)=>{
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const level = req.body.level;
    const biography = req.body.biography;
    const phone = req.body.phone;
    const facebook = req.body.facebook ;
    const instagram = req.body.instagram ;
    const twetter = req.body.twetter ;

   
    
    const filePath = `${__dirname}/upload/${file.name}`
    
    file.mv(filePath,err =>{
        if(err){
            console.log(err);
            return res.status(500).send({msg:"Failed to upload image"});
        }    
         const newImage = fs.readFileSync(filePath);
         const encImg = newImage.toString('base64');

         var image = {
             Type:req.files.file.mimetype,
             size : req.files.file.size,
             img : Buffer(encImg, 'base64')
         }
        
         teacherCollection.insertOne({name,email,level,biography,phone,facebook ,instagram, twetter,image})
         .then(result =>{
         
             fs.remove(filePath,err =>{
                 if(err){
                     console.log(err);
                    res.status(500).send({msg:"Failed to upload image"});
                 }                    
             })
             res.send(result.insertedCount>0);            
        })                  
    }) 
    .catch(function(){
        console.log("Promise Rejected")
    })
    })

  app.get('/get_all_teacher', (req, res) =>{
  teacherCollection.find()
  .toArray((err, course) =>{
   res.send(course);
  })
    })

    app.get('/get_a_teacher/:id', (req, res) =>{
      const id = ObjectId(req.params.id);
      teacherCollection.find({_id: id})
      .toArray((err, course) =>{
       res.send(course[0]);
      })
        })

    
  app.delete('/get_all_teacher/:id', (req, res)=>{
    const id = ObjectId(req.params.id);
    teacherCollection.deleteOne({_id:id})
    .then(document=> {
      res.send("deleted")
      
    })
  
  })

  app.patch('/update/:id',(req,res) =>{
   
    const id = ObjectId(req.params.id);
    teacherCollection.updateOne({_id:id},{
      $set:{
        //  file : req.files.file,
         name : req.body.name,
         email : req.body.email,
         level : req.body.level,
         biography : req.body.biography,
         phone : req.body.phone,
         facebook : req.body.facebook ,
         instagram : req.body.instagram ,
         twetter : req.body.twetter
      }
      })
      .then(result=> {
        console.log(result)
      })   
    })
   

    app.post('/order',(req,res)=>{
      const userName = req.body.userName;
      const email = req.body.email;
      const phone = req.body.phone;
      const img = req.body.image;
      const courseName = req.body.courseName;
      const cardType = req.body.cardType ;
      const status = "Pending" ;
      

      orderCollection.insertOne({userName,email,phone,courseName,img,cardType,status})
      .then(document=> {
        res.send("added")
        console.log(document)
      })          
    })

    app.get('/get_all_order', (req, res) =>{
      orderCollection.find()
      .toArray((err, course) =>{
       res.send(course);
      })
        })

    app.get('/get_a_order/:id', (req, res) =>{
      const id = ObjectId(req.params.id);
          orderCollection.find({_id: id})
          .toArray((err, course) =>{
           res.send(course);
          })
            })

    app.get('/get_a_order_by_email', (req, res) =>{
 
                  orderCollection.find({email: req.query.email})
                  .toArray((err, course) =>{
                   res.send(course);
                  })
                    })
      app.delete('/get_all_order/:id', (req, res) =>{
                      orderCollection.deleteOne()
                      .toArray((err, course) =>{
                       res.send(course);
                      })
                        })

    app.patch('/updateStatus/:id',(req,res) =>{  
             
              const id = ObjectId(req.params.id);
              orderCollection.updateOne({_id:id},{
                $set:{                 
                   status : req.body.status   
                                
                }
                })
                .then(err,result=> {
                  if(result.length>0){
                    res.send(true)
                  }
                  else{
                    res.send(false)
                  }
                })   
              })

     app.post('/review',(req,res)=>{
                const name = req.body.name;
                const email = req.body.email;
                const image = req.body.image;
                const review = req.body.review;              
               reviewCollection.insertOne({name,email,review,image})
                .then(document=> {
                  res.send("added")
                 
                })          
              })

    app.get('/get_all_review', (req, res) =>{
                 reviewCollection.find()
                .toArray((err, course) =>{
                 res.send(course);
                })
                  })
                                 
      app.delete('/get_all_review/:id', (req, res)=>{
                  const id = ObjectId(req.params.id);
                  reviewCollection.deleteOne({_id:id})
                  .then(document=> {
                    res.send("deleted")
                    
                  })
                
                })

   app.post('/admin',(req,res)=>{
                  const email = req.body.email;
                 adminCollection.insertOne({email})
                  .then(document=> {
                    res.send(message="added")
                   
                  })          
                })
    app.post('/Adminornot', (req, res) =>{
                  const email= req.body.email;
                  console.log(email)
                 
                  adminCollection.find({email:email})
                 .toArray((err, email) =>{
                  
                   if(email.length > 0){
                      res.send(true)
                   }
                   else{
                     res.send(false)
                   }
                 })
                   })
        
    app.get('/', (req, res) => {
  res.send('Wellcome to wellness database...')
    })
  }
  else{
    console.log(err)
  }
   

})
app.listen(process.env.PORT || 9500);